const fs = require('fs');
const path = 'src/admin_page.ts';
const source = fs.readFileSync(path, 'utf8');
const start = source.indexOf('  function tr(text) {');
const end = source.indexOf('  var PAGE_SIZE = 10;', start);
if (start < 0 || end < 0) throw new Error('tr block not found');
let block = source.slice(start, end);
let out = '';
for (let i = 0; i < block.length; i += 1) {
  const ch = block[i];
  if (ch === '\\' && (block[i + 1] === 'd' || block[i + 1] === '+' || block[i + 1] === '/')) {
    out += '\\\\';
  } else {
    out += ch;
  }
}
fs.writeFileSync(path, source.slice(0, start) + out + source.slice(end));
console.log('patched');
