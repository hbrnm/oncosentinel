import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useReadableText } from './pdfText';
import { plural, doctorSummary, periodDays, controlDateLabel, localDay, symptomTrend, trendHasData, weekLabel, TrendWeek } from './summary';
import { PatientProfile, DoseLog, SymptomLog } from '../types';
import { loadMedicines, medicineLabel } from './myMedicines';

// „1 zi”, „5 zile”, „30 de zile”
const zile = (n: number) => plural(n, 'zi', 'zile');

export function generateOncologyReport(
  profile: PatientProfile,
  doses: DoseLog[],
  symptoms: SymptomLog[],
  // Data ultimului control: raportul acoperă perioada de după el; fără ea, ultimele 28 de zile
  since?: string
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
  const days = periodDays(since);
  const period = since
    ? `de la controlul din ${controlDateLabel(since)} (${zile(days.length)})`
    : 'ultimele 28 de zile';
  const heading = since
    ? `de la controlul din ${controlDateLabel(since)}, ${zile(days.length)}`
    : 'ultimele 28 de zile';
  doc.text(`2. RAPORT ADERENȚĂ LA TAMOXIFEN (${heading.toUpperCase()})`, 14, 66);
  doc.line(14, 68, 196, 68);

  const summary = doctorSummary(symptoms, doses, profile.tamoxifen_start_date, since);
  const { taken, total } = summary.doses;
  const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 0;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(total > 0
    ? `Zile cu doza marcată ca luată: ${taken} din ${zile(total)} (${adherenceRate}%)`
    : `Tratamentul nu a început încă în perioada raportului (${period}).`, 14, 75);
  doc.text('Dozele sunt marcate de pacientă în aplicație; o zi nemarcată nu înseamnă neapărat doză omisă.', 14, 81);
  if (summary.mood) {
    doc.text(`Starea notată cel mai des: ${summary.mood.label} (${plural(summary.mood.count, 'notă', 'note')}).`, 14, 87);
  }

  // 4. Symptoms Evolution Table: toate intrările din perioadă, cele mai noi primele
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. JURNAL DIN PERIOADA RAPORTULUI', 14, 99);
  doc.line(14, 101, 196, 101);

  const inPeriod = new Set(days);
  const symptomRows = symptoms
    .filter(s => inPeriod.has(localDay(new Date(s.logged_at))))
    .sort((a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime())
    .map(s => {
    const dureri = [
      (s.joint_pain_level || 0) > 0 ? `Art:${s.joint_pain_level}` : '',
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
      // Notele fără simptome (doar stare și gânduri) au „-” la simptome
      s.kind === 'note' ? '-' : `${s.hot_flashes_count ?? 0} (Scor ${s.hot_flashes_intensity ?? 0})`,
      dureri,
      s.kind === 'note' ? '-' : `Ob:${s.fatigue_level ?? '-'} Smn:${s.sleep_quality ?? '-'}`,
      altele,
      s.notes ? s.notes.substring(0, 40) + (s.notes.length > 40 ? '...' : '') : '-'
    ];
  });

  autoTable(doc, {
    startY: 105,
    head: [['Data', 'Bufeuri', 'Dureri(Art/Os)', 'Obos/Somn', 'Altele (Ceață, Greață, etc)', 'Observații']],
    body: symptomRows.length > 0 ? symptomRows : [['-', 'Fără note în perioadă', '-', '-', '-', '-']],
    theme: 'striped',
    // Loc pentru subsol pe fiecare pagină
    margin: { bottom: 30 },
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
      0: { cellWidth: 20 },
      1: { cellWidth: 27 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 43 },
      5: { cellWidth: 40 }
    }
  });

  let finalY = ((doc as any).lastAutoTable?.finalY || 160) + 10;

  // 4. Evoluția în ultimele 3 luni: aceleași trei grafice ca în Jurnal, mereu pe 13 săptămâni;
  // fără simptome notate în cel puțin două săptămâni, secțiunea lipsește
  const weeks = symptomTrend(symptoms);
  const hasTrend = trendHasData(weeks);
  if (hasTrend) {
    if (finalY + 52 > 266) {
      doc.addPage();
      finalY = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('4. EVOLUȚIA ÎN ULTIMELE 3 LUNI (PE SĂPTĂMÂNI)', 14, finalY);
    doc.line(14, finalY + 2, 196, finalY + 2);

    const charts: { key: keyof Pick<TrendWeek, 'flashes' | 'joint' | 'sleep'>; label: string; max: number }[] = [
      { key: 'flashes', label: 'Bufeuri: câte a notat pacienta pe săptămână', max: Math.max(1, ...weeks.map(w => w.flashes ?? 0)) },
      { key: 'joint', label: 'Dureri articulare: media notelor, 0–5', max: 5 },
      { key: 'sleep', label: 'Somn: media notelor, 1–5 (5 = foarte bine)', max: 5 }
    ];
    const width = 56;
    const height = 22;
    const base = finalY + 37;
    charts.forEach((chart, c) => {
      const left = 14 + c * (width + 7);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...textColor);
      doc.text(doc.splitTextToSize(chart.label, width), left, finalY + 8);
      doc.setDrawColor(200, 215, 205);
      doc.line(left, base, left + width, base);
      const slot = width / weeks.length;
      const values = weeks.map(w => w[chart.key]);
      const last = values.reduce<number>((l, v, i) => (v !== null ? i : l), -1);
      values.forEach((v, i) => {
        if (v === null) return;
        const h = Math.max((v / chart.max) * height, v > 0 ? 0.6 : 0);
        const x = left + i * slot + slot * 0.2;
        doc.setFillColor(122, 154, 139); // sage-500
        if (h > 0) doc.rect(x, base - h, slot * 0.6, h, 'F');
        if (i === last) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7);
          doc.text(v.toLocaleString('ro-RO'), x + slot * 0.3, base - h - 1.5, { align: 'center' });
        }
      });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(120, 120, 120);
      doc.text(weekLabel(weeks[0]), left, base + 4);
      doc.text(weekLabel(weeks[weeks.length - 1]), left + width, base + 4, { align: 'right' });
    });
    doc.setTextColor(...textColor);
    finalY = base + 14;
  }

  // 5. Safety & Red Flags Assessment
  doc.setFontSize(9);
  const medicines = loadMedicines();
  const medicineLines: string[] = medicines.length > 0
    ? doc.splitTextToSize(`Alte medicamente: ${medicines.map(m => medicineLabel(m)).join('; ')}.`, 182)
    : [];
  // Cu multe note, tabelul se poate termina jos pe pagină: secțiunea următoare trece pe o pagină nouă
  // (titlul, cel puțin un rând de medicamente și cele două rânduri despre semnalele de alarmă, deasupra subsolului)
  if (finalY + 9 + Math.min(Math.max(medicineLines.length, 1), 3) * 5 + 2 + 15 > 266) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`${hasTrend ? 5 : 4}. SEMNALE DE ALARMĂ ȘI ALTE MEDICAMENTE`, 14, finalY);
  doc.line(14, finalY + 2, 196, finalY + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  // Medicamentele notate de pacientă în Tratament, apoi semnalele de alarmă
  // O listă lungă continuă pe pagina următoare
  let y = finalY + 9;
  for (const line of medicineLines.length > 0 ? medicineLines : ['Pacienta nu a notat alte medicamente în aplicație.']) {
    if (y > 266) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 14, y);
    y += 5;
  }
  y += 2;
  if (y + 6 > 266) {
    doc.addPage();
    y = 20;
  }
  doc.text('Aplicația nu înregistrează semnale de alarmă (ex. tromboză, sângerări, dispnee). Vă rugăm să le discutați', 14, y);
  doc.text('direct cu pacienta.', 14, y + 6);

  // 6. Footer Notes, pe fiecare pagină
  const pages = doc.getNumberOfPages() || 1;
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 272, 196, 272);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Raport generat din datele notate de pacientă în OncoSentinel; are scop informativ.', 14, 277);
    doc.text(`Pagina ${page} / ${pages} • Confidențial Medical (GDPR)`, 150, 277);
  }

  // Save/Download
  doc.save(`Raport_OncoSentinel_${profile.full_name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
