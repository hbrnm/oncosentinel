import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PatientProfile, ShoppingItem } from '../types';

export function generateWeeklyPlannerPDF(
  profile: PatientProfile,
  shoppingList: ShoppingItem[],
  exerciseMinutes: number
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const sageDark: [number, number, number] = [77, 102, 91];
  const sageLight: [number, number, number] = [234, 242, 238];
  const textColor: [number, number, number] = [40, 50, 45];

  // 1. Header
  doc.setFillColor(...sageDark);
  doc.rect(0, 0, 210, 25, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('OncoSentinel - Fisa Saptamanala a Pacientei', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Pentru saptamana in curs | Pacienta: ${profile.full_name}`, 14, 21);

  // 2. Subheader Notice
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Pastreaza aceasta fisa pe frigider sau pe noptiera pentru a bifa tratamentul si miscarea cu usurinta.', 14, 33);

  // 3. Weekly Adherence & Movement Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. BIFARILOR ZILNICE (Tamoxifen 20mg & Miscare)', 14, 43);

  const dailyMinutes = Math.round((exerciseMinutes || 150) / 5);
  const days = ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'];
  const trackerRows = days.map((day) => [
    day,
    `[  ] Luat la ora ${profile.daily_reminder_time}`,
    `[  ] ${dailyMinutes} min miscare / mers (Tinta: ${exerciseMinutes}m)`,
    '[  ] Min. 2L apa bauta',
    'Stare buna / Fara febra'
  ]);

  autoTable(doc, {
    startY: 46,
    head: [['Ziua', 'Doza Tamoxifen 20mg', `Miscare (${exerciseMinutes}m)`, 'Hidratare', 'Note Zilnice']],
    body: trackerRows,
    headStyles: {
      fillColor: sageDark,
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: textColor
    },
    alternateRowStyles: {
      fillColor: [248, 250, 249]
    },
    theme: 'grid'
  });

  // 4. Shopping list & Nutrition recommendations
  const finalY = (doc as any).lastAutoTable?.finalY || 120;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. LISTA TA DE CUMPARATURI ONCOLOGICE (Fara Grapefruit!)', 14, finalY + 10);

  const pendingItems = shoppingList.filter(i => !i.isBought);
  const itemsText = pendingItems.length > 0 
    ? pendingItems.slice(0, 14).map(i => {
        const cleanName = i.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const truncated = cleanName.length > 38 ? cleanName.slice(0, 35) + '...' : cleanName;
        return `[  ] ${truncated}`;
      })
    : [
        '[  ] Seminte de in macinate (lignani)',
        '[  ] Broccoli / Conopida proaspata (sulforafan)',
        '[  ] Seminte de chia sau dovleac (Omega-3)',
        '[  ] Ceai uscat de salvie sau hibiscus',
        '[  ] Iaurt grecesc simplu & afine proaspete',
        '[  ] Ulei de masline extravirgin presat la rece',
        '[  ] Paine integrala cu maia naturala'
      ];

  const col1 = itemsText.slice(0, Math.ceil(itemsText.length / 2));
  const col2 = itemsText.slice(Math.ceil(itemsText.length / 2));

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  let curY = finalY + 16;
  col1.forEach(item => {
    doc.text(item, 16, curY);
    curY += 6;
  });

  let curY2 = finalY + 16;
  col2.forEach(item => {
    doc.text(item, 108, curY2);
    curY2 += 6;
  });

  const nextY = Math.max(curY, curY2) + 6;

  // 5. Emergency Red Flags Box
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(14, nextY, 182, 32, 3, 3, 'F');
  doc.setDrawColor(248, 113, 113);
  doc.roundedRect(14, nextY, 182, 32, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(153, 27, 27);
  doc.text('ATENTIE MEDICALA (STEAGURI ROSII) - Suna medicul oncolog imediat daca:', 18, nextY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(120, 20, 20);
  doc.text('1. Gamba/piciorul devine umflat, cald si dureros la mers (suspiciune de tromboza venoasa).', 18, nextY + 13);
  doc.text('2. Sangerari vaginale anormale sau spotting (necesita consult ginecologic & ecografie de endometru).', 18, nextY + 18);
  doc.text('3. Dificultati respiratorii bruste sau durere acuta in piept.', 18, nextY + 23);
  doc.text('4. Febra peste 38 grade C fara o cauza evidenta.', 18, nextY + 28);

  // 6. Footer
  doc.setFontSize(7.5);
  doc.setTextColor(120, 130, 125);
  doc.text('OncoSentinel - Fisa fizica saptamanala pentru acasa. Generat cu drag pentru tine.', 14, 285);

  doc.save(`OncoSentinel_Fisa_Saptamanala_${new Date().toISOString().slice(0, 10)}.pdf`);
}
