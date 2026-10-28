(() => {
  const groups = [
    ['semRuidos', ['clickDireito', 'clickEsquerdo', 'crepitacaoDireita', 'crepitacaoEsquerda']],
    ['semTravamento', ['travamentoObservado', 'limitacaoAbertura', 'travamentoAberta']]
  ];
  const HISTORY_KEY = 'cuidador-patient-history';
  function history() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (_) { return []; } }
  function renderHistory() {
    const select = document.querySelector('#savedPatient');
    select.replaceChildren(new Option('Selecione um registro enviado', ''));
    history().forEach((record, index) => select.add(new Option(`${record.nome || 'Sem nome'} — ${new Date(record.enviadoEm).toLocaleDateString()}`, String(index))));
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
        tx.onabort = () => reject(tx.error || new Error('Armazenamento indisponível.'));
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
        const link = document.createElement('a'); link.href = file.url; link.target = '_blank'; link.rel = 'noopener'; link.textContent = 'Abrir anexo salvo'; item.append(link);
      }
      const remove = document.createElement('button');
      remove.type = 'button'; remove.textContent = 'Remover';
      remove.addEventListener('click', () => {
        pending = pending.then(async () => {
          const next = files.filter(item => item !== file);
          await storage(true, next); files = next; renderFiles();
        }).catch(() => status('Não foi possível remover o anexo salvo. Tente novamente.'));
      });
      item.append(remove); list.append(item);
    });
  }
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, mimeType: file.type, size: file.size, base64: reader.result.split(',')[1] });
      reader.onerror = () => reject(new Error(`Não foi possível ler ${file.name}.`));
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
          comparisons.push(`${label}: inicial ${before}; reavaliação ${after}; variação ${difference > 0 ? '+' : ''}${difference} mm.`);
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
        catch (_) { document.querySelector('#patientHistoryStatus').textContent = 'Não foi possível abrir o registro neste dispositivo.'; return; }
        files = attachments; renderFiles();
        document.querySelector('#dtmForm').reset();
        restoreDraftFromObject(record);
        saveDraft();
        document.querySelector('#patientHistoryStatus').textContent = 'Registro aberto. Acrescente o atendimento na aba Resultado e conduta.';
      });
      document.querySelector('#addFollowup').addEventListener('click', () => {
        const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        addVisit({ data: today.toISOString().slice(0, 10) });
        document.querySelector('#dtmForm').dispatchEvent(new Event('input', { bubbles: true }));
      });
      pending = storage(false).then(saved => { files = saved || []; renderFiles(); }).catch(() => status('Armazenamento de anexos indisponível neste dispositivo.'));
      document.querySelector('#clinicalFiles').addEventListener('change', event => {
        const selected = [...event.target.files]; event.target.value = '';
        pending = pending.then(async () => {
          const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
          if (selected.some(file => !allowed.includes(file.type) || file.size > 2 * 1024 * 1024)) throw new Error('Use PDF, JPEG, PNG ou WebP com até 2 MB por arquivo.');
          if ([...files, ...selected].reduce((total, file) => total + file.size, 0) > 6 * 1024 * 1024) throw new Error('O limite total de anexos é 6 MB.');
          const next = [...files, ...await Promise.all(selected.map(readFile))];
          await storage(true, next); files = next; renderFiles(); status('Anexos guardados neste dispositivo, aguardando envio.');
        }).catch(error => status(error.message || 'Não foi possível guardar os anexos.'));
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
      if (!info.attachmentsV1) throw new Error('Para enviar anexos, atualize a implantação do Apps Script com o código fornecido. Os arquivos continuam guardados neste dispositivo.');
      return files;
    },
    archive(payload, result) {
      try {
        const record = { ...payload, atendimentos: JSON.parse(payload.atendimentos), anexosClinicos: result.anexosClinicos || [] };
        const records = history(); records.unshift(record);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(records)); renderHistory();
        document.querySelector('#patientHistoryStatus').textContent = 'Registro enviado e disponível para retomar neste dispositivo.';
      } catch (_) { document.querySelector('#patientHistoryStatus').textContent = 'Registro enviado à planilha, mas sem cópia no histórico deste dispositivo.'; }
    },
    clear() { this.restore([]); files = []; renderFiles(); status(''); pending = pending.then(() => storage(true, [])).catch(() => status('Não foi possível limpar os anexos locais.')); }
  };
})();
