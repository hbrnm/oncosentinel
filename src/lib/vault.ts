// Seiful cu PIN: când e activ, datele aplicației stau în localStorage doar criptate (AES-GCM,
// cheie derivată din PIN cu PBKDF2). Cât timp aplicația e deblocată, citirile și scrierile
// din localStorage merg într-o copie din memorie, iar scrierile se recriptează (comasate).
// Cât timp e blocată, citirile întorc null și scrierile sunt ignorate: nimic nu ajunge în clar.
// Fără PIN datele nu se pot citi; un PIN uitat înseamnă date pierdute (rămâne copia de siguranță).

const VAULT_KEY = 'oncosentinel_vault';
const ITERATIONS = 310000;

interface VaultBlob {
  salt: string;
  iv: string;
  data: string;
  iterations: number;
}

const proto = Storage.prototype;
const original = {
  getItem: proto.getItem,
  setItem: proto.setItem,
  removeItem: proto.removeItem,
  clear: proto.clear
};

let enabled = false;
let memory: Map<string, string> | null = null;
let cryptoKey: CryptoKey | null = null;
let salt: Uint8Array<ArrayBuffer> | null = null;
// Crește la blocare, ștergere și dezactivare: o scriere pornită înainte nu mai are voie să scrie după
let generation = 0;
let dirty = false;
let pending: Promise<void> = Promise.resolve();
let busy = false;
let onPersistError: (() => void) | null = null;

const isProtected = (key: string) => key !== VAULT_KEY;

// Pe bucăți: datele pot avea mulți MB (documente)
const toB64 = (bytes: Uint8Array) => {
  let text = '';
  for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(text);
};
const fromB64 = (text: string): Uint8Array<ArrayBuffer> => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

const deriveKey = async (pin: string, saltBytes: Uint8Array<ArrayBuffer>, iterations: number) => {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBytes, iterations, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

const readBlob = (): VaultBlob | null => {
  try {
    return JSON.parse(original.getItem.call(localStorage, VAULT_KEY) || 'null');
  } catch {
    return null;
  }
};

const writeBlob = async (map: Map<string, string>, key: CryptoKey, saltBytes: Uint8Array<ArrayBuffer>, gen: number) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = new TextEncoder().encode(JSON.stringify([...map.entries()]));
  const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain));
  if (gen !== generation) return false;
  const blob: VaultBlob = { salt: toB64(saltBytes), iv: toB64(iv), data: toB64(cipher), iterations: ITERATIONS };
  original.setItem.call(localStorage, VAULT_KEY, JSON.stringify(blob));
  return true;
};

// Comasează scrierile: cel mult o recriptare în lucru, plus una la final dacă au venit altele
const persist = () => {
  dirty = true;
  const gen = generation;
  pending = pending
    .catch(() => undefined)
    .then(async () => {
      if (!dirty || gen !== generation || !memory || !cryptoKey || !salt) return;
      dirty = false;
      try {
        await writeBlob(memory, cryptoKey, salt, gen);
      } catch {
        onPersistError?.();
      }
    });
  return pending;
};

// Interceptarea e instalată mereu; nu face nimic cât timp seiful nu e activ
proto.getItem = function (this: Storage, key: string) {
  if (this === localStorage && enabled && isProtected(key)) return memory ? memory.get(key) ?? null : null;
  return original.getItem.call(this, key);
};
proto.setItem = function (this: Storage, key: string, value: string) {
  if (this === localStorage && enabled && isProtected(key)) {
    if (!memory) return; // blocat: nimic în clar
    memory.set(key, String(value));
    persist();
    return;
  }
  original.setItem.call(this, key, value);
};
proto.removeItem = function (this: Storage, key: string) {
  if (this === localStorage && enabled && isProtected(key)) {
    if (!memory) return;
    memory.delete(key);
    persist();
    return;
  }
  original.removeItem.call(this, key);
};
proto.clear = function (this: Storage) {
  if (this === localStorage) reset();
  original.clear.call(this);
};

const reset = () => {
  generation++;
  enabled = false;
  memory = null;
  cryptoKey = null;
  salt = null;
  dirty = false;
};

enabled = readBlob() !== null;

const plainKeys = () => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isProtected(key)) keys.push(key);
  }
  return keys;
};

export const vault = {
  isEnabled: () => enabled,
  isUnlocked: () => memory !== null,

  // La spațiu plin, aplicația spune utilizatoarei (vezi STORAGE_FULL_MESSAGE)
  setPersistErrorHandler: (handler: () => void) => {
    onPersistError = handler;
  },

  // Mută datele existente în seif și șterge varianta necriptată; la eșec, nimic nu se schimbă
  async enable(pin: string) {
    if (busy || enabled) return;
    busy = true;
    try {
      const newSalt = crypto.getRandomValues(new Uint8Array(16));
      const key = await deriveKey(pin, newSalt, ITERATIONS);
      // Copie + interceptare fără pauză între ele: nicio scriere nu scapă în clar
      const keys = plainKeys();
      const map = new Map(keys.map((k) => [k, original.getItem.call(localStorage, k) as string]));
      generation++;
      memory = map;
      cryptoKey = key;
      salt = newSalt;
      enabled = true;
      await persist();
      if (!readBlob()) {
        reset();
        throw new Error('Seiful nu a putut fi salvat');
      }
      keys.forEach((k) => original.removeItem.call(localStorage, k));
    } finally {
      busy = false;
    }
  },

  // false = PIN greșit
  async unlock(pin: string): Promise<boolean> {
    const blob = readBlob();
    if (!blob) {
      // Seiful a fost scos (de exemplu, din altă filă): nu mai e nimic de deblocat
      reset();
      return false;
    }
    try {
      const saltBytes = fromB64(blob.salt);
      const key = await deriveKey(pin, saltBytes, blob.iterations);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(blob.iv) }, key, fromB64(blob.data));
      memory = new Map(JSON.parse(new TextDecoder().decode(plain)));
      cryptoKey = key;
      salt = saltBytes;
      enabled = true;
      return true;
    } catch {
      return false;
    }
  },

  // discardPending: altă filă a scris un seif mai nou; nu-l suprascriem
  async lock(discardPending = false) {
    if (discardPending) generation++;
    // Așteptăm și scrierile venite cât timp se termina coada
    else do await pending.catch(() => undefined); while (dirty && memory);
    generation++;
    memory = null;
    cryptoKey = null;
    salt = null;
    dirty = false;
  },

  // Scoate PIN-ul: datele revin necriptate; la spațiu plin, rămân criptate și se aruncă eroare
  async disable() {
    await pending.catch(() => undefined);
    if (!memory) return;
    const entries = [...memory.entries()];
    const written: string[] = [];
    try {
      entries.forEach(([k, v]) => {
        original.setItem.call(localStorage, k, v);
        written.push(k);
      });
    } catch (err) {
      written.forEach((k) => original.removeItem.call(localStorage, k));
      throw err;
    }
    original.removeItem.call(localStorage, VAULT_KEY);
    reset();
  },

  // „Am uitat PIN-ul”: șterge tot de pe acest dispozitiv
  eraseAll() {
    reset();
    original.clear.call(localStorage);
  },

  isVaultKey: (key: string | null) => key === VAULT_KEY,

  // Altă filă a schimbat seiful: blocăm fila aceasta fără să-l suprascriem (sau îl uităm, dacă a fost scos)
  async syncWithOtherTab() {
    if (!readBlob()) {
      reset();
      return;
    }
    if (memory) await vault.lock(true);
    // Și o filă fără PIN trece în modul blocat: nimic nu mai ajunge în clar
    enabled = true;
  },

  flush: () => pending.catch(() => undefined)
};
