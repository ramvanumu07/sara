/**
 * One-off script: extract all topic outcomes from curriculum and build HTML with copy options.
 * Run from repo root: node scripts/extract-outcomes.js
 */
import { courses } from '../data/curriculum.js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'outcomes-list.html');

const rows = [];
for (const course of courses) {
  for (const topic of course.topics) {
    const outcomes = topic.outcomes || [];
    rows.push({
      course: course.title,
      topicId: topic.id,
      topicTitle: topic.title,
      outcomes,
    });
  }
}

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const sections = rows.map((r, idx) => {
  const id = `section-${idx}`;
  const list = r.outcomes.map((o, i) => `  ${i + 1}. ${escape(o)}`).join('\n');
  const copyText = `${r.course} — ${r.topicTitle}\n${r.outcomes.map((o, i) => `${i + 1}. ${o}`).join('\n')}`;
  return `
  <section class="topic" id="${id}" data-copy="${escape(copyText.replace(/"/g, '&quot;'))}">
    <h2><span class="course">${escape(r.course)}</span> — ${escape(r.topicTitle)}</h2>
    <ol class="outcomes">${r.outcomes.map(o => `<li>${escape(o)}</li>`).join('')}</ol>
    <button type="button" class="copy-btn" data-section="${id}">Copy this topic</button>
  </section>`;
}).join('\n');

const fullText = rows.map(r =>
  `${r.course} — ${r.topicTitle}\n${r.outcomes.map((o, i) => `${i + 1}. ${o}`).join('\n')}`
).join('\n\n---\n\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Curriculum outcomes — all topics</title>
  <style>
    * { box-sizing: border-box; }
    body { font: 1rem/1.5 system-ui, sans-serif; max-width: 52rem; margin: 0 auto; padding: 1.5rem; }
    h1 { margin-top: 0; }
    .toolbar { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .copy-btn, #copy-all { padding: 0.5rem 1rem; cursor: pointer; background: #2563eb; color: #fff; border: none; border-radius: 6px; }
    .copy-btn:hover, #copy-all:hover { background: #1d4ed8; }
    .copy-btn:active, #copy-all:active { transform: scale(0.98); }
    .topic { margin-bottom: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 8px; }
    .topic h2 { margin: 0 0 0.5rem; font-size: 1.1rem; }
    .course { color: #6b7280; font-weight: normal; }
    .outcomes { margin: 0.5rem 0 0.75rem; padding-left: 1.25rem; }
    .outcomes li { margin: 0.2rem 0; }
    #toast { position: fixed; bottom: 1rem; right: 1rem; padding: 0.75rem 1rem; background: #059669; color: #fff; border-radius: 6px; opacity: 0; transition: opacity 0.2s; }
    #toast.show { opacity: 1; }
  </style>
</head>
<body>
  <h1>Curriculum outcomes (all topics)</h1>
  <div class="toolbar">
    <button type="button" id="copy-all">Copy entire list</button>
    <span id="toast" aria-live="polite">Copied to clipboard.</span>
  </div>
  <div id="content">
${sections}
  </div>
  <script>
    const fullText = ${JSON.stringify(fullText)};
    const toast = document.getElementById('toast');
    function showToast() {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }
    document.getElementById('copy-all').onclick = async () => {
      await navigator.clipboard.writeText(fullText);
      showToast();
    };
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.onclick = async () => {
        const section = document.getElementById(btn.dataset.section);
        const text = section.getAttribute('data-copy').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        await navigator.clipboard.writeText(text);
        showToast();
      };
    });
  </script>
</body>
</html>
`;

const txtPath = join(__dirname, '..', 'outcomes-list.txt');
writeFileSync(outPath, html, 'utf8');
writeFileSync(txtPath, fullText, 'utf8');
console.log('Wrote', outPath);
console.log('Wrote', txtPath);
console.log('Topics:', rows.length);
console.log('Total outcomes:', rows.reduce((n, r) => n + r.outcomes.length, 0));
