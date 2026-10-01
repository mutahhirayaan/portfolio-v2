// Generates placeholder app-window screenshots (SVG). Replace them with real screenshots any time:
// just drop shot-1.png etc. into public/screenshots/<project-id>/ and update the paths in src/data/projects.js.
import { mkdirSync, writeFileSync } from 'node:fs';

const apps = {
  loopbook: { c: ['#06b6d4', '#6366f1'], kind: 'dashboard', names: ['Dashboard', 'Transactions', 'Admin'] },
  remindme: { c: ['#8b5cf6', '#22d3ee'], kind: 'calendar', names: ['Home', 'Calendar', 'Create'] },
  'salesman-app': { c: ['#10b981', '#6366f1'], kind: 'list', names: ['Parties', 'Orders', 'Payments'] },
  'book-management': { c: ['#f59e0b', '#8b5cf6'], kind: 'table', names: ['Catalogue', 'Add book', 'Filter'] },
};

const W = 1280, H = 800;
const bar = (x, y, w, h, fill, o = 1, r = 8) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" opacity="${o}"/>`;

function screen(app, variant, name) {
  const [a, b] = app.c;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1226"/><stop offset="1" stop-color="#0a0f1f"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<circle cx="1100" cy="120" r="260" fill="${b}" opacity=".16"/><circle cx="180" cy="720" r="240" fill="${a}" opacity=".14"/>
${bar(0, 0, 230, H, '#ffffff', 0.04, 0)}${bar(28, 32, 40, 40, 'url(#g)', 1, 12)}${bar(84, 42, 110, 12, '#fff', 0.7)}${bar(84, 60, 70, 8, '#fff', 0.3)}`;
  ['Home', 'Activity', 'Groups', 'Settings', 'Help'].forEach((_, i) => {
    s += bar(24, 130 + i * 56, 182, 40, i === variant ? 'url(#g)' : '#fff', i === variant ? 0.9 : 0.05, 12) + bar(48, 146 + i * 56, 90, 8, '#fff', i === variant ? 0.95 : 0.35, 4);
  });
  s += `<text x="270" y="90" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="700" fill="#fff">${name}</text>${bar(270, 108, 160, 8, '#fff', 0.3, 4)}${bar(1070, 56, 140, 44, 'url(#g)', 1, 22)}`;
  for (let i = 0; i < 3; i++) s += bar(270 + i * 310, 150, 290, 130, '#fff', 0.06, 22) + bar(294 + i * 310, 176, 90, 10, '#fff', 0.4, 5) + bar(294 + i * 310, 204, 150 + (i % 2) * 30, 30, 'url(#g)', 0.95, 8) + bar(294 + i * 310, 250, 200, 8, '#fff', 0.2, 4);
  const k = app.kind;
  if (k === 'dashboard' || (k === 'calendar' && variant === 0)) {
    s += bar(270, 310, 610, 440, '#fff', 0.06, 26);
    let d = 'M300 660';
    for (let i = 0; i < 10; i++) d += ` L${300 + i * 62} ${560 - Math.sin(i * 0.9 + variant) * 90 - i * 8}`;
    s += `<path d="${d}" fill="none" stroke="url(#g)" stroke-width="5" stroke-linecap="round"/>`;
    for (let i = 0; i < 6; i++) s += bar(910, 310 + i * 76, 300, 62, '#fff', 0.06, 18) + bar(930, 328 + i * 76, 32, 26, 'url(#g)', 0.9, 8) + bar(980, 330 + i * 76, 130, 10, '#fff', 0.55, 5) + bar(980, 348 + i * 76, 80, 7, '#fff', 0.25, 4);
  } else if (k === 'calendar') {
    s += bar(270, 310, 940, 440, '#fff', 0.06, 26);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) s += bar(298 + c * 132, 340 + r * 78, 116, 64, '#fff', (r * 7 + c + variant) % 6 === 0 ? 0.2 : 0.05, 14) + ((r * 7 + c + variant) % 6 === 0 ? bar(308 + c * 132, 378 + r * 78, 84, 8, 'url(#g)', 0.95, 4) : '');
  } else {
    for (let i = 0; i < 6; i++) s += bar(270, 310 + i * 74, 940, 62, '#fff', 0.06, 18) + bar(294, 330 + i * 74, 34, 24, 'url(#g)', 0.9, 8) + bar(348, 332 + i * 74, 210 + (i % 3) * 30, 10, '#fff', 0.6, 5) + bar(348, 350 + i * 74, 120, 7, '#fff', 0.25, 4) + bar(1090, 328 + i * 74, 96, 26, i % 2 ? '#fff' : 'url(#g)', i % 2 ? 0.1 : 0.85, 13);
  }
  return s + '</svg>';
}

for (const [id, app] of Object.entries(apps)) {
  mkdirSync(`public/screenshots/${id}`, { recursive: true });
  app.names.forEach((n, i) => writeFileSync(`public/screenshots/${id}/shot-${i + 1}.svg`, screen(app, i, n)));
}
console.log('screenshots generated');
