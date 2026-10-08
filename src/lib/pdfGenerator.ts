import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useReadableText } from './pdfText';
import { PatientProfile, DoseLog, SymptomLog } from '../types';

const localDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// „1 zi”, „5 zile”, „30 de zile”
const zile = (n: number) => (n === 1 ? '1 zi' : n % 100 === 0 || n % 100 >= 20 ? `${n} de zile` : `${n} zile`);

// Zilele cu doza marcată ca luată, din ultimele 30 de zile (doar de la începutul tratamentului)
const adherenceLast30Days = (doses: DoseLog[], startDate: string) => {
  const today = new Date();
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const iso = localDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - i));
    if (!startDate || iso >= startDate) days.push(iso);
  }
  const takenDays = new Set(
    doses.filter(d => d.status === 'taken').map(d => localDay(new Date(d.taken_at || d.scheduled_for)))
  );
  const taken = days.filter(iso => takenDays.has(iso)).length;
  return { taken, total: days.length };
};

export function generateOncologyReport(
  profile: PatientProfile,
  doses: DoseLog[],
  symptoms: SymptomLog[]
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  useReadableText(doc);

  const primaryColor: [number, number, number] = [77, 102, 91]; // Sage Dark #4D665B
  const textColor: [number, number, number] = [40, 50, 45];

  // 1. Header & Title
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('OncoSentinel - Raport Periodic de Aderență & Simptome', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generat la: ${new Date().toLocaleDateString('ro-RO')}`, 14, 21);

  // 2. Patient & Clinical Context
  doc.setTextColor(...textColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. DATE CLINICE PACIENTĂ', 14, 34);

  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 215, 205);
  doc.line(14, 36, 196, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Nume: ${profile.full_name}`, 14, 43);
  doc.text(`Diagnostic: ${profile.histology} (${profile.stage})`, 14, 49);
  doc.text(`Status Receptori: ER ${profile.er_status} | PR ${profile.pr_status} | HER2 ${profile.her2_status}`, 14, 55);

  doc.text(`Tratament: ${profile.medication_name || 'Tamoxifen'} ${profile.medication_dose || '(doză necompletată)'} (Start: ${profile.tamoxifen_start_date || 'necompletat'})`, 110, 43);
  doc.text(`Medic Oncolog: ${profile.oncologist_email || 'Necompletat'}`, 110, 49);
  doc.text(`Stoc Curent Pastile: ${profile.pill_stock_count} bucăți`, 110, 55);

  // 3. Adherence Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. RAPORT ADERENȚĂ LA TAMOXIFEN (30 ZILE)', 14, 66);
  doc.line(14, 68, 196, 68);

  const { taken, total } = adherenceLast30Days(doses, profile.tamoxifen_start_date);
  const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 0;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(total > 0
    ? `Zile cu doza marcată ca luată: ${taken} din ${zile(total)} (${adherenceRate}%)`
    : 'Tratamentul nu a început încă în ultimele 30 de zile.', 14, 75);
  doc.text('Dozele sunt marcate de pacientă în aplicație; o zi nemarcată nu înseamnă neapărat doză omisă.', 14, 81);

  // 4. Symptoms Evolution Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. JURNAL DE SIMPTOME RECENTE', 14, 93);
  doc.line(14, 95, 196, 95);

    const symptomRows = symptoms.slice(0, 15).map(s => {
    const dureri = [
      s.joint_pain_level > 0 ? `Art:${s.joint_pain_level}` : '',
      (s.bone_pain_level || 0) > 0 ? `Os:${s.bone_pain_level}` : ''
    ].filter(Boolean).join(', ') || '-';

    const altele = [
      (s.brain_fog || 0) > 0 ? `Ceață:${s.brain_fog}` : '',
      (s.nausea_level || 0) > 0 ? `Greață:${s.nausea_level}` : '',
      (s.headache || 0) > 0 ? `Cef:${s.headache}` : '',
      (s.mucosal_dryness || 0) > 0 ? `Mucoase:${s.mucosal_dryness}` : ''
    ].filter(Boolean).join(', ') || '-';

    return [
      new Date(s.logged_at).toLocaleDateString('ro-RO'),
      `${s.hot_flashes_count} (Scor ${s.hot_flashes_intensity})`,
      dureri,
      `Ob:${s.fatigue_level} Smn:${s.sleep_quality}`,
      altele,
      s.notes ? s.notes.substring(0, 40) + (s.notes.length > 40 ? '...' : '') : '-'
    ];
  });

  autoTable(doc, {
    startY: 99,
    head: [['Data', 'Bufeuri', 'Dureri(Art/Os)', 'Obos/Somn', 'Altele (Ceață, Greață, etc)', 'Observații']],
    body: symptomRows.length > 0 ? symptomRows : [['-', 'Fără date recente', '-', '-', '-', '-']],
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5
    },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 27 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 45 },
      5: { cellWidth: 40 }
    }
  });

  // 5. Safety & Red Flags Assessment
  const finalY = ((doc as any).lastAutoTable?.finalY || 160) + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('4. SEMNALE DE ALARMĂ ȘI ALTE MEDICAMENTE', 14, finalY);
  doc.line(14, finalY + 2, 196, finalY + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Aplicația nu înregistrează semnale de alarmă (ex. tromboză, sângerări, dispnee) și nici alte medicamente', 14, finalY + 9);
  doc.text('luate de pacientă. Vă rugăm să le discutați direct cu ea.', 14, finalY + 15);

  // 6. Footer Notes
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 272, 196, 272);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Raport generat din datele notate de pacientă în OncoSentinel; are scop informativ.', 14, 277);
  doc.text('Pagina 1 / 1 • Confidențial Medical (GDPR)', 150, 277);

  // Save/Download
  doc.save(`Raport_OncoSentinel_${profile.full_name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
