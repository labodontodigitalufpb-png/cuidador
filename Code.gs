const SPREADSHEET_ID = "1L6jO6tJgqNrEZdZmmloFKZfhdaGEyw8M1Bxv24Qn9_E";
const SHEET_NAME = "Respostas";

function doGet() {
  try {
    const sheet = getResponseSheet();
    return jsonResponse({
      ok: true,
      attachmentsV1: true,
      app: "CuidaDor SUS",
      message: "Endpoint ativo e com acesso a planilha.",
      sheet: sheet.getName(),
      rows: sheet.getLastRow()
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      app: "CuidaDor SUS",
      message: "Endpoint ativo, mas sem acesso a planilha.",
      error: String(error && error.message ? error.message : error)
    });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  const uploaded = [];
  try {
    lock.waitLock(30000);
    const payload = parsePayload(e);
    const sheet = getResponseSheet();
    const incomingFiles = payload.anexosClinicos || [];
    if (!Array.isArray(incomingFiles)) throw new Error("Lista de anexos inválida.");
    const decoded = incomingFiles.map(file => {
      if (file.url && !file.base64 && /^https:\/\/drive\.google\.com\/file\/d\/[a-zA-Z0-9_-]+\/view$/.test(file.url)) return { existing: file };
      if (!["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(file.mimeType)) throw new Error("Tipo de arquivo não permitido.");
      const bytes = Utilities.base64Decode(file.base64);
      if (bytes.length > 2 * 1024 * 1024) throw new Error("Anexo maior que 2 MB.");
      return { bytes: bytes, file: file };
    });
    if (decoded.reduce((sum, item) => sum + (item.bytes ? item.bytes.length : 0), 0) > 6 * 1024 * 1024) throw new Error("Anexos excedem 6 MB.");
    payload.anexosClinicos = decoded.map(item => item.existing || { name: item.file.name });
    Object.keys(payload).forEach(key => {
      if (String(normalizeValue(payload[key])).length > 45000) throw new Error("Conteúdo muito longo no campo " + key + ". Divida o acompanhamento em registros menores.");
    });
    payload.anexosClinicos = decoded.map(item => {
      if (item.existing) return item.existing;
      const file = item.file;
      const saved = getAttachmentFolder().createFile(Utilities.newBlob(item.bytes, file.mimeType, String(file.name).slice(0, 180)));
      uploaded.push(saved);
      return { name: file.name, mimeType: file.mimeType, size: item.bytes.length, url: saved.getUrl() };
    });
    const headers = ensureHeaders(sheet, payload);
    const row = headers.map((key) => normalizeValue(payload[key]));

    if (row.some(value => String(value).length > 45000)) throw new Error("Conteúdo ou lista de anexos muito longa para uma célula da planilha.");
    sheet.appendRow(row);

    return jsonResponse({
      ok: true,
      recordedAt: new Date().toISOString(),
      anexosClinicos: payload.anexosClinicos
    });
  } catch (error) {
    uploaded.forEach(file => { try { file.setTrashed(true); } catch (ignored) {} });
    return jsonResponse({
      ok: false,
      error: String(error && error.message ? error.message : error)
    });
  } finally {
    lock.releaseLock();
  }
}

function getAttachmentFolder() {
  const props = PropertiesService.getScriptProperties();
  const folderId = props.getProperty("ATTACHMENT_FOLDER_ID");
  if (folderId) return DriveApp.getFolderById(folderId);
  const folder = DriveApp.createFolder("CuidaDor SUS - Exames e imagens");
  props.setProperty("ATTACHMENT_FOLDER_ID", folder.getId());
  return folder;
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Corpo da requisicao vazio.");
  }

  let payload;
  if (e.parameter && e.parameter.payload) {
    payload = JSON.parse(e.parameter.payload);
  } else {
    payload = JSON.parse(e.postData.contents);
  }

  payload.recebidoEm = new Date().toISOString();
  return payload;
}

function getResponseSheet() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders(sheet, payload) {
  const payloadKeys = Object.keys(payload);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(payloadKeys);
    sheet.setFrozenRows(1);
    return payloadKeys;
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const missing = payloadKeys.filter((key) => !headers.includes(key));

  if (missing.length > 0) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers.push(...missing);
  }

  return headers;
}

function normalizeValue(value) {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.some(item => item && typeof item === "object") ? JSON.stringify(value) : value.join("; ");
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
