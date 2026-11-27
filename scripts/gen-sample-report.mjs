// Generates public/sample-parent-report.pdf: a clearly-labelled SAMPLE parent report
// with fictional data and a "SAMPLE" watermark. Replace with a real template when you have one.
// No dependencies: writes a minimal PDF by hand (Helvetica, WinAnsi text, ASCII only).
// Run: npm run gen:report
import fs from 'fs';
import path from 'path';

const W = 595; // A4 in points
const H = 842;
const ops = [];
const esc = (t) => t.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255].map((v) => v.toFixed(3)).join(' ');
};
const text = (x, y, t, { size = 10, bold = false, color = '#1e1420' } = {}) =>
  ops.push(`BT /${bold ? 'F2' : 'F1'} ${size} Tf ${rgb(color)} rg ${x} ${y} Td (${esc(t)}) Tj ET`);
const rect = (x, y, w, h, color) => ops.push(`${rgb(color)} rg ${x} ${y} ${w} ${h} re f`);
const line = (x1, y1, x2, y2, color = '#e4e2da', w = 1) => ops.push(`${rgb(color)} RG ${w} w ${x1} ${y1} m ${x2} ${y2} l S`);

// page + watermark
rect(0, 0, W, H, '#fbf5f6');
ops.push(`q 0.94 0.90 0.98 rg BT /F2 120 Tf 0.766 0.643 -0.643 0.766 120 220 Tm (SAMPLE) Tj ET Q`);

// header
rect(0, H - 92, W, 92, '#1e1420');
text(40, H - 46, 'SamarthX', { size: 22, bold: true, color: '#ffb8dc' });
text(40, H - 70, 'Monthly parent report  -  SAMPLE WITH FICTIONAL DATA', { size: 10, color: '#ffffff' });
text(400, H - 46, 'Student: Aarav (sample)', { size: 10, color: '#ffffff' });
text(400, H - 62, 'Program: JEE Main + Advanced', { size: 10, color: '#ffffff' });
text(400, H - 78, 'Month: sample month', { size: 10, color: '#ffffff' });

rect(40, H - 124, W - 80, 22, '#ffe45c');
text(50, H - 117, 'This is a SAMPLE. Every name and number on this page is made up to show the format of the real report.', { size: 9, bold: true });

// KPI tiles
const kpis = [
  ['Attendance', '96%', 'live sessions + 1:1s'],
  ['Study hours', '124 h', 'logged in the app'],
  ['Habit score', '82/100', 'targets met vs planned'],
  ['Streak', '42 days', 'longest this month'],
];
kpis.forEach(([k, v, s], i) => {
  const x = 40 + i * 131;
  const y = H - 220;
  rect(x, y, 121, 80, '#ffffff');
  text(x + 10, y + 60, k.toUpperCase(), { size: 8, color: '#9e9c95' });
  text(x + 10, y + 32, v, { size: 22, bold: true, color: '#8b5cf6' });
  text(x + 10, y + 14, s, { size: 8, color: '#55534e' });
});

// test trend (bar chart)
let y0 = H - 260;
text(40, y0, 'Test trend (full mocks, out of 300)', { size: 12, bold: true });
const mocks = [['Mock 11', 168], ['Mock 12', 181], ['Mock 13', 196], ['Mock 14', 214]];
const base = y0 - 130;
line(60, base, 300, base, '#c9c7bf');
mocks.forEach(([m, v], i) => {
  const h = (v / 300) * 110;
  const x = 75 + i * 56;
  rect(x, base, 34, h, i === mocks.length - 1 ? '#ff4f9a' : '#c7b3ff');
  text(x + 4, base + h + 6, String(v), { size: 9, bold: true });
  text(x - 2, base - 14, m, { size: 8, color: '#55534e' });
});
text(320, y0 - 20, 'Up 18 marks since last month.', { size: 10, bold: true, color: '#12a150' });
text(320, y0 - 38, 'Silly mistakes: 7 (-28 marks), all fixable.', { size: 10 });
text(320, y0 - 56, 'Time: 41% of time on 12% of marks.', { size: 10 });
text(320, y0 - 74, 'Predicted percentile: an estimate, not', { size: 10 });
text(320, y0 - 88, 'a guarantee.', { size: 10 });

// chapter strength
y0 = base - 50;
text(40, y0, 'Chapter strength', { size: 12, bold: true });
const chapters = [
  ['Mechanics', 0.86, '#12a150'],
  ['Thermodynamics', 0.74, '#12a150'],
  ['Electrostatics', 0.62, '#ffcf5c'],
  ['Organic chemistry', 0.41, '#ff3b30'],
  ['Calculus', 0.78, '#12a150'],
  ['Coordinate geometry', 0.58, '#ffcf5c'],
];
chapters.forEach(([c, v, col], i) => {
  const y = y0 - 26 - i * 22;
  text(40, y, c, { size: 10 });
  rect(190, y - 2, 300, 10, '#efede6');
  rect(190, y - 2, 300 * v, 10, col);
  text(500, y, `${Math.round(v * 100)}%`, { size: 9, bold: true });
});

// mentor remarks
y0 = y0 - 26 - chapters.length * 22 - 24;
text(40, y0, "Mentor's remarks", { size: 12, bold: true });
rect(40, y0 - 92, W - 80, 80, '#ffffff');
[
  'Strong month. Consistency is up and the mock trend is clearly improving.',
  'Organic chemistry is the leak: 2 extra DPPs a week + a 1:1 on reaction mechanisms.',
  'Sleep: protect 11 p.m. lights-out before mocks. We will review the error log every Sunday.',
  'Next PTM: sample date. Questions any time on the parent app.',
].forEach((t, i) => text(52, y0 - 30 - i * 16, t, { size: 10 }));

// alerts
y0 = y0 - 120;
text(40, y0, 'Alerts this month', { size: 12, bold: true });
text(40, y0 - 18, '1 missed chapter test (rescheduled and completed).  0 broken streaks.', { size: 10 });

// footer
line(40, 56, W - 40, 56);
text(40, 40, 'SamarthX  -  sample parent report  -  fictional data for illustration only. Not a real student.', { size: 8, color: '#9e9c95' });

const content = ops.join('\n');
const objs = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
  '<< /Title (SamarthX - SAMPLE parent report, fictional data) /Producer (scripts/gen-sample-report.mjs) >>',
];
let pdf = '%PDF-1.4\n';
const offsets = [];
objs.forEach((o, i) => {
  offsets.push(Buffer.byteLength(pdf, 'latin1'));
  pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
});
const xref = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`;
pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R /Info 7 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
fs.writeFileSync(path.join(process.cwd(), 'public', 'sample-parent-report.pdf'), Buffer.from(pdf, 'latin1'));
console.log('wrote public/sample-parent-report.pdf', `${(pdf.length / 1024).toFixed(1)} KB`);
