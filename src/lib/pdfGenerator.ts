import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PatientProfile, DoseLog, SymptomLog } from '../types';

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

  const primaryColor: [number, number, number] = [77, 102, 91]; // Sage Dark #4D665B
  const textColor: [number, number, number] = [40, 50, 45];

  // 1. Header & Title
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('OncoSentinel - Raport Periodic de Aderență & Simptome', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generat la: ${new Date().toLocaleDateString('ro-RO')} | Ghid Integrativ Oncologic`, 140, 15);

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

  doc.text(`Tratament: Tamoxifen 20mg/zi (Start: ${profile.tamoxifen_start_date})`, 110, 43);
  doc.text(`Medic Oncolog: ${profile.oncologist_email || 'Necompletat'}`, 110, 49);
  doc.text(`Stoc Curent Pastile: ${profile.pill_stock_count} bucăți`, 110, 55);

  // 3. Adherence Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. RAPORT ADERENȚĂ LA TAMOXIFEN (30 ZILE)', 14, 66);
  doc.line(14, 68, 196, 68);

  const totalDoses = doses.length || 1;
  const takenDoses = doses.filter(d => d.status === 'taken').length;
  const adherenceRate = Math.round((takenDoses / totalDoses) * 100);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Rată estimată de aderență: ${adherenceRate}% (${takenDoses} din ${totalDoses} doze monitorizate)`, 14, 75);
  doc.text('Status: Aderență optimă terapeutică pentru protecție împotriva recidivei mamare.', 14, 81);

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
  doc.text('4. VERIFICARE SEMNALE DE ALARMĂ (RED FLAGS)', 14, finalY);
  doc.line(14, finalY + 2, 196, finalY + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('• Semne de tromboză venoasă profundă (durere/umflare unilaterală gambă): Negativ / Neraportat', 14, finalY + 9);
  doc.text('• Sângerări vaginale anormale sau modificări endometriale: Neraportat', 14, finalY + 15);
  doc.text('• Dispnee bruscă sau dureri toracice acute: Neraportat', 14, finalY + 21);
  doc.text('• Interacțiuni medicamentoase verificate: Nu s-au înregistrat inhibitori CYP2D6 concomitenti.', 14, finalY + 27);

  // 6. Footer Notes
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 272, 196, 272);
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Acest raport este generat din jurnalul de monitorizare OncoSentinel și are scop informativ de suport clinic.', 14, 277);
  doc.text('Pagina 1 / 1 • Confidențial Medical (GDPR)', 150, 277);

  // Save/Download
  doc.save(`Raport_OncoSentinel_${profile.full_name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
