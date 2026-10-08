// Seiful cu PIN: când e activ, datele aplicației stau în localStorage doar criptate (AES-GCM,
// cheie derivată din PIN cu PBKDF2). Cât timp aplicația e deblocată, citirile și scrierile
// din localStorage merg într-o copie din memorie, iar fiecare scriere se recriptează.
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

let memory: Map<string, string> | null = null;
let cryptoKey: CryptoKey | null = null;
let salt: Uint8Array<ArrayBuffer> | null = null;
let pending: Promise<void> = Promise.resolve();
let onPersistError: (() => void) | null = null;

const isProtected = (key: string) => key !== VAULT_KEY;

const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
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

// Recriptează toată copia din memorie și o scrie în localStorage
const persist = () => {
  pending = pending.then(async () => {
    if (!memory || !cryptoKey || !salt) return;
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plain = new TextEncoder().encode(JSON.stringify([...memory.entries()]));
    const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, plain));
    const blob: VaultBlob = { salt: toB64(salt), iv: toB64(iv), data: toB64(cipher), iterations: ITERATIONS };
    try {
      original.setItem.call(localStorage, VAULT_KEY, JSON.stringify(blob));
    } catch {
      onPersistError?.();
    }
  });
  return pending;
};

const install = () => {
  proto.getItem = function (this: Storage, key: string) {
    if (this === localStorage && memory && isProtected(key)) return memory.get(key) ?? null;
    return original.getItem.call(this, key);
  };
  proto.setItem = function (this: Storage, key: string, value: string) {
    if (this === localStorage && memory && isProtected(key)) {
      memory.set(key, String(value));
      persist();
      return;
    }
    original.setItem.call(this, key, value);
  };
  proto.removeItem = function (this: Storage, key: string) {
    if (this === localStorage && memory && isProtected(key)) {
      memory.delete(key);
      persist();
      return;
    }
    original.removeItem.call(this, key);
  };
  proto.clear = function (this: Storage) {
    if (this === localStorage) {
      memory = null;
      cryptoKey = null;
      uninstall();
    }
    original.clear.call(this);
  };
};

const uninstall = () => {
  proto.getItem = original.getItem;
  proto.setItem = original.setItem;
  proto.removeItem = original.removeItem;
  proto.clear = original.clear;
};

const plainKeys = () => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isProtected(key)) keys.push(key);
  }
  return keys;
};

export const vault = {
  isEnabled: () => readBlob() !== null,
  isUnlocked: () => memory !== null,

  // La spațiu plin, aplicația spune utilizatoarei (vezi STORAGE_FULL_MESSAGE)
  setPersistErrorHandler: (handler: () => void) => {
    onPersistError = handler;
  },

  // Mută datele existente în seif și șterge varianta necriptată
  async enable(pin: string) {
    salt = crypto.getRandomValues(new Uint8Array(16));
    cryptoKey = await deriveKey(pin, salt, ITERATIONS);
    const keys = plainKeys();
    memory = new Map(keys.map((k) => [k, original.getItem.call(localStorage, k) as string]));
    await persist();
    if (!readBlob()) throw new Error('Seiful nu a putut fi salvat');
    keys.forEach((k) => original.removeItem.call(localStorage, k));
    install();
  },

  // false = PIN greșit
  async unlock(pin: string): Promise<boolean> {
    const blob = readBlob();
    if (!blob) return false;
    try {
      const saltBytes = fromB64(blob.salt);
      const key = await deriveKey(pin, saltBytes, blob.iterations);
      const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(blob.iv) }, key, fromB64(blob.data));
      memory = new Map(JSON.parse(new TextDecoder().decode(plain)));
      cryptoKey = key;
      salt = saltBytes;
      install();
      return true;
    } catch {
      return false;
    }
  },

  async lock() {
    await pending;
    memory = null;
    cryptoKey = null;
    uninstall();
  },

  // Scoate PIN-ul: datele revin necriptate în localStorage
  async disable() {
    await pending;
    if (!memory) return;
    const entries = [...memory.entries()];
    uninstall();
    entries.forEach(([k, v]) => original.setItem.call(localStorage, k, v));
    original.removeItem.call(localStorage, VAULT_KEY);
    memory = null;
    cryptoKey = null;
  },

  // „Am uitat PIN-ul”: șterge tot de pe acest dispozitiv
  eraseAll() {
    memory = null;
    cryptoKey = null;
    uninstall();
    original.clear.call(localStorage);
  },

  flush: () => pending
};
