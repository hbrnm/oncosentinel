# Design Spec: Integrare Notițe Personale, Meniuri și Dosar Medical

## 1. Context și Obiectiv
Scopul acestui design este de a reintegra funcționalitățile din vechea aplicație (Notițe personale, Meniuri de mâncare și Dosarul medical) în noul design organic (Base44), respectând layout-ul minimalist, fără a adăuga secțiuni noi în bara principală de navigare inferioară.

## 2. Notițe Personale (în Jurnal)
- **Locație**: `src/components/JournalTab.tsx`
- **UI/Layout**: Un câmp de tip `textarea` plasat imediat sub pastilele cu starea de spirit (emoticoane). Marginile vor fi rotunjite (`rounded-3xl`), cu un fundal crem subtil și un placeholder cald: *„Notează un gând, un simptom sau o bucurie de azi...”*.
- **Mecanism de Salvare**: Variabila de stare `note` (React `useState`) va reține textul. La apăsarea butonului principal „Salvează în jurnal”, notița va fi captată alături de starea de spirit aleasă.

## 3. Meniuri de Mâncare (Nutriție & Rețete în Ghiduri)
- **Locație**: `src/components/GuideTab.tsx`
- **UI/Layout**: Adăugarea unui al treilea tab în zona superioară (lângă „Ghiduri” și „Noutăți”), denumit „Nutriție & Rețete”.
- **Structura de Date**: Se va crea un nou fișier `src/data/recipes.ts` cu o interfață similară `ClinicalGuide` și o listă exportată `RECIPES`. Articolele vor conține rețete anti-inflamatorii și meniuri recomandate în timpul tratamentului.
- **Redare**: Se va refolosi componenta `RenderMarkdown` și layout-ul curat tip card organic creat anterior pentru redarea ghidurilor.

## 4. Dosar Medical (în Profil)
- **Locație**: `src/components/ProfileTab.tsx`
- **UI/Layout**: Transformarea paginii de Profil într-un layout cu navigație orizontală. Zona de sus va conține un switch (toggle) între:
  1. **Setări & Tratament** (afișează detaliile existente despre Tamoxifen).
  2. **Dosar Medical** (nou).
- **Conținut Dosar Medical**: O secțiune demonstrativă (mock) care va conține:
  - Cărți/Containere pentru categorii: *Analize de sânge*, *Imagistică*, *Scrisori medicale*.
  - Un buton stilizat pentru *„Încarcă document”*.

## 5. Constrângeri și Reguli de Design
- Utilizarea strictă a paletei cromatice Base44 (nuanțe de `sage`, `petal`, crem/beige, și griuri calde).
- Fără folosirea culorilor aprinse (se vor evita nuanțe de emerald/verde strident pentru layout-uri).
- Componentele noi vor moșteni clasele CSS de tranziție (ex: `animate-fade-in`) pentru o navigare fluidă între sub-tab-uri.
