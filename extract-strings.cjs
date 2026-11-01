const fs = require('fs');
const lines = fs.readFileSync('src/admin_page.ts', 'utf8').split(/\r?\n/);
const seen = new Map();
const quoteRe = /'([^']*)'|"([^"]*)"/g;
lines.forEach((line, i) => {
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return;
  let match;
  while ((match = quoteRe.exec(line))) {
    const text = match[1] || match[2];
    if (!/[\u4e00-\u9fff]/.test(text)) continue;
    if (!seen.has(text)) seen.set(text, []);
    seen.get(text).push(i + 1);
  }
});
for (const [text, at] of [...seen.entries()].sort((a, b) => a[1][0] - b[1][0])) {
  console.log(`${at[0]}\t${text}`);
}
console.error(`count ${seen.size}`);
