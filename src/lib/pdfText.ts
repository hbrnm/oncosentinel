import type { jsPDF } from 'jspdf';

// Fontul standard din jsPDF nu are ă, ș, ț (le omite din text), dar are î și â.
// Până la includerea unui font cu diacritice, le scriem fără sedilă/căciulă ca textul să rămână lizibil.
export const foldRomanian = (text: string) =>
  String(text).replace(/[ăĂșȘşŞțȚţŢ]/g, (c) => ({ ă: 'a', Ă: 'A', ș: 's', Ș: 'S', ş: 's', Ş: 'S', ț: 't', Ț: 'T', ţ: 't', Ţ: 'T' } as Record<string, string>)[c]);

// Aplică foldRomanian pe tot textul scris în document, inclusiv în tabelele autoTable
export const useReadableText = (doc: jsPDF) => {
  const original = doc.text.bind(doc);
  doc.text = ((text: string | string[], ...rest: unknown[]) =>
    (original as (...args: unknown[]) => jsPDF)(Array.isArray(text) ? text.map(foldRomanian) : foldRomanian(text), ...rest)) as jsPDF['text'];
};
