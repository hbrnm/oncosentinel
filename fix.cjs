const fs = require('fs');
let lines = fs.readFileSync('src/components/TreatmentTab.tsx', 'utf8').split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('className={`w-8 h-8 rounded-xl flex items-center justify-center')) {
    lines[i - 1] = lines[i - 1].replace('<div', '<button onClick={() => { if (status === "missed") onTakeDose(cell.iso); }}');
    lines[i] = lines[i].replace('`w-8 h-8', '`w-8 h-8 ${status === "missed" ? "cursor-pointer hover:bg-red-700 hover:scale-110" : ""}');
  }
  if (lines[i].includes('Doz') && lines[i].includes('Viitoare')) {
    lines[i] = lines[i].replace(/: status === 'missed' \? '([^']+)'/, ": status === 'missed' ? 'Doză sărită (Apasă pentru a bifa retroactiv)'");
  }
}
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<Check className="w-3.5 h-3.5" strokeWidth={3} />')) {
    lines[i + 4] = lines[i + 4].replace('</div>', '</button>');
  }
}
fs.writeFileSync('src/components/TreatmentTab.tsx', lines.join('\n'));
