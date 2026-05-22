const SPREADSHEET_ID = "1L6jO6tJgqNrEZdZmmloFKZfhdaGEyw8M1Bxv24Qn9_E";
const SHEET_NAME = "Respostas";

function doGet() {
  try {
    const sheet = getResponseSheet();
    return jsonResponse({
      ok: true,
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
  try {
    const payload = parsePayload(e);
    const sheet = getResponseSheet();
    const headers = ensureHeaders(sheet, payload);
    const row = headers.map((key) => normalizeValue(payload[key]));

    sheet.appendRow(row);

    return jsonResponse({
      ok: true,
      recordedAt: new Date().toISOString()
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: String(error && error.message ? error.message : error)
    });
  }
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
  if (Array.isArray(value)) return value.join("; ");
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
