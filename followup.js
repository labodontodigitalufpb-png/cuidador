(() => {
  // Keep new clinical modules in the same language as the main form.
  const translations = [
  [
    "Retomar acompanhamento salvo neste dispositivo",
    "Resume follow-up saved on this device",
    "Retomar seguimiento guardado en este dispositivo"
  ],
  [
    "Selecione um registro enviado",
    "Select a submitted record",
    "Seleccione un registro enviado"
  ],
  [
    "Abrir registro e substituir rascunho atual",
    "Open record and replace current draft",
    "Abrir registro y sustituir el borrador actual"
  ],
  [
    "Sem nome",
    "Unnamed",
    "Sin nombre"
  ],
  [
    "Motivo da consulta / queixa principal",
    "Reason for consultation / chief complaint",
    "Motivo de consulta / queja principal"
  ],
  [
    "História da doença atual",
    "History of present illness",
    "Historia de la enfermedad actual"
  ],
  [
    "Sem ruídos",
    "No joint sounds",
    "Sin ruidos"
  ],
  [
    "Sem travamento",
    "No locking",
    "Sin bloqueo"
  ],
  [
    "Evolução e reavaliação",
    "Progress and reassessment",
    "Evolución y reevaluación"
  ],
  [
    "Registre a data e o que foi feito em cada atendimento. A reavaliação repete os itens do exame físico e mantém o exame inicial.",
    "Record the date and procedures for each visit. Reassessment repeats the physical examination items and preserves the initial examination.",
    "Registre la fecha y los procedimientos de cada consulta. La reevaluación repite los ítems del examen físico y conserva el examen inicial."
  ],
  [
    "Adicionar atendimento",
    "Add visit",
    "Añadir consulta"
  ],
  [
    "Data do atendimento",
    "Visit date",
    "Fecha de la consulta"
  ],
  [
    "Evolução e procedimentos realizados",
    "Progress notes and procedures performed",
    "Evolución y procedimientos realizados"
  ],
  [
    "Registrar reavaliação do exame físico",
    "Record physical examination reassessment",
    "Registrar reevaluación del examen físico"
  ],
  [
    "Exame físico de reavaliação",
    "Reassessment physical examination",
    "Examen físico de reevaluación"
  ],
  [
    "Remover atendimento",
    "Remove visit",
    "Eliminar consulta"
  ],
  [
    "Exames e imagens",
    "Tests and images",
    "Exámenes e imágenes"
  ],
  [
    "Anexar arquivos (PDF, JPEG, PNG ou WebP; até 2 MB por arquivo e 6 MB no total)",
    "Attach files (PDF, JPEG, PNG or WebP; up to 2 MB per file and 6 MB total)",
    "Adjuntar archivos (PDF, JPEG, PNG o WebP; hasta 2 MB por archivo y 6 MB en total)"
  ],
  [
    "Abrir anexo salvo",
    "Open saved attachment",
    "Abrir archivo adjunto guardado"
  ],
  [
    "Remover",
    "Remove",
    "Eliminar"
  ],
  [
    "Armazenamento indisponível.",
    "Storage unavailable.",
    "Almacenamiento no disponible."
  ],
  [
    "Não foi possível remover o anexo salvo. Tente novamente.",
    "Could not remove the saved attachment. Try again.",
    "No se pudo eliminar el archivo adjunto guardado. Inténtelo de nuevo."
  ],
  [
    "Não foi possível abrir o registro neste dispositivo.",
    "Could not open the record on this device.",
    "No se pudo abrir el registro en este dispositivo."
  ],
  [
    "Registro aberto. Acrescente o atendimento na aba Resultado e conduta.",
    "Record opened. Add a visit in the Results and management tab.",
    "Registro abierto. Añada la consulta en la pestaña Resultados y conducta."
  ],
  [
    "Armazenamento de anexos indisponível neste dispositivo.",
    "Attachment storage is unavailable on this device.",
    "El almacenamiento de archivos adjuntos no está disponible en este dispositivo."
  ],
  [
    "Use PDF, JPEG, PNG ou WebP com até 2 MB por arquivo.",
    "Use PDF, JPEG, PNG or WebP up to 2 MB per file.",
    "Utilice PDF, JPEG, PNG o WebP de hasta 2 MB por archivo."
  ],
  [
    "O limite total de anexos é 6 MB.",
    "The total attachment limit is 6 MB.",
    "El límite total de archivos adjuntos es de 6 MB."
  ],
  [
    "Anexos guardados neste dispositivo, aguardando envio.",
    "Attachments saved on this device, awaiting submission.",
    "Archivos adjuntos guardados en este dispositivo, pendientes de envío."
  ],
  [
    "Não foi possível guardar os anexos.",
    "Could not save attachments.",
    "No se pudieron guardar los archivos adjuntos."
  ],
  [
    "Para enviar anexos, atualize a implantação do Apps Script com o código fornecido. Os arquivos continuam guardados neste dispositivo.",
    "To submit attachments, update the Apps Script deployment with the provided code. Files remain saved on this device.",
    "Para enviar archivos adjuntos, actualice la implementación de Apps Script con el código proporcionado. Los archivos siguen guardados en este dispositivo."
  ],
  [
    "Registro enviado e disponível para retomar neste dispositivo.",
    "Record submitted and available to resume on this device.",
    "Registro enviado y disponible para retomar en este dispositivo."
  ],
  [
    "Registro enviado à planilha, mas sem cópia no histórico deste dispositivo.",
    "Record submitted to the spreadsheet, but no copy was saved in this device’s history.",
    "Registro enviado a la hoja de cálculo, pero sin copia en el historial de este dispositivo."
  ],
  [
    "Não foi possível limpar os anexos locais.",
    "Could not clear local attachments.",
    "No se pudieron borrar los archivos adjuntos locales."
  ],
  [
    "Não foi possível ler {name}.",
    "Could not read {name}.",
    "No se pudo leer {name}."
  ],
  [
    "{label}: inicial {before}; reavaliação {after}; variação {difference} mm.",
    "{label}: initial {before}; reassessment {after}; change {difference} mm.",
    "{label}: inicial {before}; reevaluación {after}; variación {difference} mm."
  ]
];
  function t(source, values = {}) {
    const lang = localStorage.getItem('cuidador-sus-lang') || 'pt';
    const row = translations.find(row => row[0] === source);
    const text = row ? row[lang === 'en' ? 1 : lang === 'es' ? 2 : 0] : source;
    return text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`);
  }
  function translateTree(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const source = node.textContent.trim();
      const row = translations.find(row => row.includes(source));
      if (row) node.textContent = node.textContent.replace(source, t(row[0]));
    }
  }
  const groups = [
    ['semRuidos', ['clickDireito', 'clickEsquerdo', 'crepitacaoDireita', 'crepitacaoEsquerda']],
    ['semTravamento', ['travamentoObservado', 'limitacaoAbertura', 'travamentoAberta']]
  ];
  const HISTORY_KEY = 'cuidador-patient-history';
  function history() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (_) { return []; } }
  function renderHistory() {
    const select = document.querySelector('#savedPatient');
    select.replaceChildren(new Option(t("Selecione um registro enviado"), ''));
    history().forEach((record, index) => select.add(new Option(`${record.nome || t("Sem nome")} — ${new Date(record.enviadoEm).toLocaleDateString(document.documentElement.lang)}`, String(index))));
  }
  let files = [];
  let pending = Promise.resolve();
  const status = (message) => { document.querySelector('#attachmentStatus').textContent = message; };
  function database() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('cuidador-clinical-attachments', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('draft');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async function storage(write, value) {
    const db = await database();
    try {
      return await new Promise((resolve, reject) => {
        const tx = db.transaction('draft', write ? 'readwrite' : 'readonly');
        const request = write ? tx.objectStore('draft').put(value, 'files') : tx.objectStore('draft').get('files');
        let result;
        request.onsuccess = () => { result = request.result; };
        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error);
        tx.onabort = () => reject(tx.error || new Error(t("Armazenamento indisponível.")));
      });
    } finally { db.close(); }
  }
  function renderFiles() {
    const list = document.querySelector('#clinicalFileList');
    list.replaceChildren();
    files.forEach((file, index) => {
      const item = document.createElement('li');
      item.textContent = `${file.name} (${Math.ceil((file.size || 0) / 1024)} KB) `;
      if (file.url && /^https:\/\/drive\.google\.com\/file\/d\//.test(file.url)) {
        const link = document.createElement('a'); link.href = file.url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = t("Abrir anexo salvo"); item.append(link);
      }
      const remove = document.createElement('button');
      remove.type = 'button'; remove.textContent = t("Remover");
      remove.addEventListener('click', () => {
        pending = pending.then(async () => {
          const next = files.filter(item => item !== file);
          await storage(true, next); files = next; renderFiles();
        }).catch(() => status(t("Não foi possível remover o anexo salvo. Tente novamente.")));
      });
      item.append(remove); list.append(item);
    });
  }
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, mimeType: file.type, size: file.size, base64: reader.result.split(',')[1] });
      reader.onerror = () => reject(new Error(t("Não foi possível ler {name}.", { name: file.name })));
      reader.readAsDataURL(file);
    });
  }
  function syncAbsence(target, root) {
    const key = target.name || target.dataset.field;
    const field = name => root.querySelector(`[name="${name}"], [data-field="${name}"]`);
    for (const [none, positives] of groups) {
      if (key === none && target.checked) positives.forEach(name => { const input = field(name); if (input) input.checked = false; });
      if (positives.includes(key) && target.checked && field(none)) field(none).checked = false;
    }
    if (key?.endsWith('_semDor') && target.checked) {
      const prefix = key.slice(0, -7);
      ['_dor', '_dorFamiliar'].forEach(suffix => { const input = field(prefix + suffix); if (input) input.checked = false; });
    }
    if (key?.endsWith('_dor') || key?.endsWith('_dorFamiliar')) {
      const prefix = key.replace(/_(dor|dorFamiliar)$/, '');
      const none = field(prefix + '_semDor');
      if (none) none.checked = !field(prefix + '_dor')?.checked && !field(prefix + '_dorFamiliar')?.checked;
    }
  }
  function addVisit(saved = {}) {
    const visit = document.createElement('article');
    visit.className = 'followup-visit';
    visit.innerHTML = `<div class="grid two"><label>Data do atendimento<input type="date" data-field="data" required></label></div>
      <label>Evolução e procedimentos realizados<textarea data-field="evolucao" rows="4" required></textarea></label>
      <label class="check-button"><input type="checkbox" data-field="reavaliar"> <span>Registrar reavaliação do exame físico</span></label>
      <details hidden><summary>Exame físico de reavaliação</summary><div class="reevaluation-exam"></div><p class="measurement-comparison"></p></details>
      <button type="button" class="remove-visit">Remover atendimento</button>`;
    translateTree(visit);
    const exam = visit.querySelector('.reevaluation-exam');
    document.querySelectorAll('[data-view="2"] .exam-block').forEach(block => {
      const clone = block.cloneNode(true);
      clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
      clone.querySelectorAll('input').forEach(input => {
        input.dataset.field = input.name; input.removeAttribute('name'); input.removeAttribute('required');
        delete input.dataset.palpationNone; delete input.dataset.palpationOption;
        if (input.type === 'hidden') input.remove();
        else { input.checked = false; input.value = input.type === 'checkbox' ? 'on' : ''; input.disabled = true; }
      });
      exam.append(clone);
    });
    const toggle = visit.querySelector('[data-field="reavaliar"]');
    const details = visit.querySelector('details');
    const refresh = () => {
      details.hidden = !toggle.checked;
      details.open = toggle.checked;
      exam.querySelectorAll('input').forEach(input => { input.disabled = !toggle.checked; });
      const comparisons = [];
      for (const name of ['aberturaSemDor', 'aberturaMaxima', 'aberturaAssistida']) {
        const before = document.querySelector(`#dtmForm [name="${name}"]`).value;
        const after = exam.querySelector(`[data-field="${name}"]`).value;
        if (before !== '' && after !== '') {
          const difference = Number(after) - Number(before);
          const label = exam.querySelector(`[data-field="${name}"]`).closest('label').firstChild.textContent.trim();
          comparisons.push(t("{label}: inicial {before}; reavaliação {after}; variação {difference} mm.", { label, before, after, difference: `${difference > 0 ? '+' : ''}${difference}` }));
        }
      }
      visit.querySelector('.measurement-comparison').textContent = comparisons.join(' ');
    };
    visit.querySelectorAll('[data-field]').forEach(input => {
      const value = saved[input.dataset.field];
      if (input.type === 'checkbox') input.checked = value === true;
      else if (value !== undefined) input.value = value;
    });
    visit.addEventListener('change', event => { syncAbsence(event.target, visit); refresh(); });
    visit.querySelector('.remove-visit').addEventListener('click', () => { visit.remove(); document.querySelector('#dtmForm').dispatchEvent(new Event('input', { bubbles: true })); });
    document.querySelector('#followupVisits').append(visit); refresh();
  }
  window.ClinicalFollowup = {
    applyLanguage() {
      const selected = document.querySelector('#savedPatient').value;
      translateTree(document.querySelector('#dtmForm'));
      renderHistory();
      document.querySelector('#savedPatient').value = selected;
      renderFiles();
    },
    init() {
      renderHistory();
      document.querySelector('#loadPatient').addEventListener('click', async () => {
        const selected = document.querySelector('#savedPatient').value;
        if (selected === '') return;
        const record = history()[Number(selected)];
        if (!record) return;
        await pending;
        const attachments = record.anexosClinicos || [];
        try { await storage(true, attachments); }
        catch (_) { document.querySelector('#patientHistoryStatus').textContent = t("Não foi possível abrir o registro neste dispositivo."); return; }
        files = attachments; renderFiles();
        document.querySelector('#dtmForm').reset();
        restoreDraftFromObject(record);
        saveDraft();
        document.querySelector('#patientHistoryStatus').textContent = t("Registro aberto. Acrescente o atendimento na aba Resultado e conduta.");
      });
      document.querySelector('#addFollowup').addEventListener('click', () => {
        const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        addVisit({ data: today.toISOString().slice(0, 10) });
        document.querySelector('#dtmForm').dispatchEvent(new Event('input', { bubbles: true }));
      });
      pending = storage(false).then(saved => { files = saved || []; renderFiles(); }).catch(() => status(t("Armazenamento de anexos indisponível neste dispositivo.")));
      document.querySelector('#clinicalFiles').addEventListener('change', event => {
        const selected = [...event.target.files]; event.target.value = '';
        pending = pending.then(async () => {
          const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
          if (selected.some(file => !allowed.includes(file.type) || file.size > 2 * 1024 * 1024)) throw new Error(t("Use PDF, JPEG, PNG ou WebP com até 2 MB por arquivo."));
          if ([...files, ...selected].reduce((total, file) => total + file.size, 0) > 6 * 1024 * 1024) throw new Error(t("O limite total de anexos é 6 MB."));
          const next = [...files, ...await Promise.all(selected.map(readFile))];
          await storage(true, next); files = next; renderFiles(); status(t("Anexos guardados neste dispositivo, aguardando envio."));
        }).catch(error => status(error.message || t("Não foi possível guardar os anexos.")));
      });
    },
    collect() { return [...document.querySelectorAll('.followup-visit')].map(visit => Object.fromEntries([...visit.querySelectorAll('[data-field]')].filter(input => !input.disabled).map(input => [input.dataset.field, input.type === 'checkbox' ? input.checked : input.value]))); },
    restore(visits) { document.querySelector('#followupVisits').replaceChildren(); if (Array.isArray(visits)) visits.forEach(addVisit); },
    syncAbsence,
    async prepareAttachments(endpoint) {
      await pending;
      if (!files.length) return [];
      if (window.CuidaDorAndroid?.sendPayload) return files;
      const response = await fetch(endpoint, { credentials: 'omit', signal: AbortSignal.timeout(15000) });
      const info = await response.json();
      if (!info.attachmentsV1) throw new Error(t("Para enviar anexos, atualize a implantação do Apps Script com o código fornecido. Os arquivos continuam guardados neste dispositivo."));
      return files;
    },
    archive(payload, result) {
      try {
        const record = { ...payload, atendimentos: JSON.parse(payload.atendimentos), anexosClinicos: result.anexosClinicos || [] };
        const records = history(); records.unshift(record);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(records)); renderHistory();
        document.querySelector('#patientHistoryStatus').textContent = t("Registro enviado e disponível para retomar neste dispositivo.");
      } catch (_) { document.querySelector('#patientHistoryStatus').textContent = t("Registro enviado à planilha, mas sem cópia no histórico deste dispositivo."); }
    },
    clear() { this.restore([]); files = []; renderFiles(); status(''); pending = pending.then(() => storage(true, [])).catch(() => status(t("Não foi possível limpar os anexos locais."))); }
  };
})();
