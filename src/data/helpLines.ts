export interface HelpLine {
  name: string;
  phone: string;
  description: string;
  hours: string;
  verifiedOn: string; // data la care proprietara a confirmat numărul (AAAA-LL-ZZ)
}

// Linii de sprijin din România, afișate în fereastra „Ajutor”.
// Intră aici doar numere confirmate de proprietară; lista de verificat e în docs/resurse-de-verificat.md.
export const HELP_LINES: HelpLine[] = [];
