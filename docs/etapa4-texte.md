# Etapa 4 — PIN pe telefon: texte

## Aprobate (cu „4 cifre” în loc de „6 cifre”, după alegerea proprietarei)
- „Protejează cu PIN”: „Datele tale de pe acest telefon vor fi criptate cu un PIN de 4 cifre. Fără PIN nu le poate citi nimeni, nici tu. Dacă îl uiți, datele nu se pot recupera decât dintr-o copie de siguranță. Descarcă o copie înainte.” Butoane: „Descarcă o copie”, „Alege PIN-ul”.
- Ecranul de blocare: „Bine ai revenit. Introdu PIN-ul.”; „PIN greșit. Mai încearcă.”; „Am uitat PIN-ul” → „Fără PIN, datele criptate nu se pot deschide. Poți șterge datele de pe acest telefon și să restaurezi o copie de siguranță, dacă ai una.” Buton: „Șterge datele și începe din nou”.

## Noi (aprobate de proprietară, 2026-10-08)
- Alegerea PIN-ului: câmpurile „PIN nou (4 cifre)” și „Scrie-l încă o dată”; butonul „Activează PIN-ul”.
- Erori: „PIN-ul are 4 cifre.”, „PIN-urile nu se potrivesc. Scrie-l din nou.”, „Nu am putut activa PIN-ul. Încearcă din nou; datele tale au rămas neschimbate.”
- Cu PIN activ: „PIN-ul e activ. Aplicația îl cere la fiecare deschidere și după 5 minute în fundal.”; butonul „Scoate PIN-ul”, cu confirmarea „Scoți PIN-ul? Datele vor rămâne pe telefon necriptate.”
- Ecranul de blocare: butoanele „Deblochează” și „Înapoi”; confirmarea „Sigur ștergi toate datele de pe acest telefon? Nu pot fi recuperate fără o copie de siguranță.”
- În „Siguranța datelor”, paragraful despre criptare depinde de PIN:
  - fără PIN (ca acum): „Datele nu sunt criptate: oricine poate deschide acest browser le poate vedea. Folosește un telefon blocat cu parolă sau amprentă și nu folosi aplicația pe un dispozitiv comun.”
  - cu PIN: „Datele sunt criptate cu PIN-ul tău. Copia de siguranță pe care o descarci nu e criptată: păstreaz-o într-un loc sigur.”

- Eroare la scoaterea PIN-ului (aprobată ulterior): „Nu am putut scoate PIN-ul: spațiul de pe telefon e plin. Datele tale au rămas criptate; șterge câteva documente și încearcă din nou.”

## De știut
Un PIN de 4 cifre are 10.000 de combinații. Protejează bine de cineva care ia telefonul în mână; cineva care copiază datele browserului și le încearcă pe un calculator le-ar putea ghici, chiar dacă fiecare încercare e făcută intenționat lentă. Copia de siguranță descărcată nu e criptată.
- Spațiu: datele criptate ocupă cu aproximativ o treime mai mult. La activare, pentru câteva clipe, există și datele în clar, și seiful; dacă nu e loc, activarea eșuează, iar datele rămân neschimbate.
- Mai multe file deschise: dacă aplicația e deschisă în două file și una schimbă datele, cealaltă se blochează și cere din nou PIN-ul, ca să nu suprascrie datele mai noi (cu două file folosite în paralel, asta se întâmplă la fiecare schimbare). Dacă o filă activează PIN-ul, cealaltă se blochează; dacă o filă scoate PIN-ul sau șterge datele, cealaltă repornește.
