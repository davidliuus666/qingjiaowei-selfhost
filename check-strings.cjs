const fs = require('fs');
const source = fs.readFileSync('src/admin_page.ts', 'utf8');
const start = source.indexOf('var EN = {');
const end = source.indexOf('\n  };', start);
const block = source.slice(start, end);
const keys = new Set();
const keyRe = /'((?:[^'\\]|\\.)*)'\s*:/g;
let m;
while ((m = keyRe.exec(block))) keys.add(m[1].replace(/\\'/g, "'"));

const lines = source.split(/\r?\n/);
const seen = new Set();
const quoteRe = /'([^']*)'|"([^"]*)"/g;
lines.forEach((line, i) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
  if (i >= source.slice(0, start).split(/\r?\n/).length && i <= source.slice(0, end).split(/\r?\n/).length) return;
  let q;
  while ((q = quoteRe.exec(line))) {
    const text = q[1] || q[2];
    if (!/[\u4e00-\u9fff]/.test(text)) continue;
    if (keys.has(text)) continue;
    if (seen.has(text)) continue;
    seen.add(text);
    console.log(`${i + 1}\t${text}`);
  }
});
console.error(`missing ${seen.size}`);
