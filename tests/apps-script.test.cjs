const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
function server(failAppend = false) {
  const rows = [], uploads = [], trashed = [];
  const sheet = { getLastRow: () => rows.length, getName: () => 'Respostas', appendRow: row => { if (failAppend && rows.length) throw Error('Falha na planilha'); rows.push(row); }, setFrozenRows() {} };
  const context = {
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'folder' }) },
    Utilities: { base64Decode: value => [...Buffer.from(value, 'base64')], newBlob: (bytes, type, name) => ({ bytes, type, name }) },
    DriveApp: { getFolderById: () => ({ createFile: blob => { uploads.push(blob); return { getUrl: () => 'https://drive.google.com/file/d/testId/view', setTrashed: () => trashed.push(blob) }; } }) }
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../Code.gs'), 'utf8'), context);
  return { context, rows, uploads, trashed, post: data => context.doPost({ postData: { contents: JSON.stringify(data) } }) };
}
const file = { name: 'exame.pdf', mimeType: 'application/pdf', base64: Buffer.from('%PDF-test').toString('base64') };
{
  const s = server();
  assert.equal(s.context.doGet().attachmentsV1, true);
  const result = s.post({ nome: 'Teste', atendimentos: [{ data: '2026-10-28', evolucao: 'Teste' }], anexosClinicos: [file] });
  assert.equal(result.ok, true);
  assert.equal(s.uploads.length, 1);
  const record = Object.fromEntries(s.rows[0].map((key, i) => [key, s.rows[1][i]]));
  assert.equal(JSON.parse(record.atendimentos)[0].data, '2026-10-28');
  assert.equal(JSON.parse(record.anexosClinicos)[0].url, result.anexosClinicos[0].url);
  assert(!record.anexosClinicos.includes('base64'));
}
{
  const s = server(); assert.equal(s.post({ anexosClinicos: [{ ...file, mimeType: 'application/exe' }] }).ok, false); assert.equal(s.rows.length, 0);
}
{
  const s = server(); assert.equal(s.post({ anexosClinicos: [{ ...file, base64: Buffer.alloc(2 * 1024 * 1024 + 1).toString('base64') }] }).ok, false); assert.equal(s.uploads.length, 0);
}
{
  const s = server(true); assert.equal(s.post({ anexosClinicos: [file] }).ok, false); assert.equal(s.trashed.length, 1);
}
{
  const s = server(); const result = s.post({ anexosClinicos: [{ name: 'existente.pdf', url: 'https://drive.google.com/file/d/testId/view' }] }); assert.equal(result.ok, true); assert.equal(s.uploads.length, 0);
}
{
  const s = server(); assert.equal(s.post({ atendimentos: 'a'.repeat(45001) }).ok, false); assert.equal(s.rows.length, 0);
}
console.log('6 Apps Script checks passed');
