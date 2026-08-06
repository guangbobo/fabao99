// ==================== DATA ====================
// docTypes defined in individual pages// ==================== ERROR TRAP ====================
window.onerror = function(msg, url, line, col, err) {
  var div = document.getElementById('errBox');
  if (div) {
    div.style.display = 'block';
    div.innerHTML += '<div style="color:red;margin:4px 0;">Line ' + line + ': ' + msg + '</div>';
  }
  return false;
};

// ==================== STATE ====================
// selectedDoc defined in individual pages// currentFormData defined in pages// currentDocData defined in pages// ==================== INIT ====================
function init() {
  const grid = document.getElementById('docGrid');
  docTypes.forEach((doc, i) => {
    const card = document.createElement('div');
    card.className = 'doc-card';
    const num = String(i + 1).padStart(2, '0');
    card.innerHTML = `<div class="num">${num}</div><div class="title">${doc.title}</div><div class="desc">${doc.desc}</div>`;
    card.onclick = () => selectDoc(doc, card);
    card.dataset.docId = doc.id;
    grid.appendChild(card);
  });
}

function selectDoc(doc, card) {
  selectedDoc = doc;
  currentFormData = {};
  showPage('page-form');
  renderForm(doc.id);
  document.getElementById('formTitle').textContent = doc.title;
  resetSteps();
  document.getElementById('step1').classList.add('active');
  window.scrollTo(0, 0);
}

function startForm() {
  if (!selectedDoc) return;
  currentFormData = {};
  showPage('page-form');
  renderForm(selectedDoc.id);
  document.getElementById('formTitle').textContent = selectedDoc.title;
  resetSteps();
  document.getElementById('step1').classList.add('active');
  window.scrollTo(0, 0);
}

// ==================== FORM ====================
function renderForm(docId) {
  const config = formConfigs[docId];
  if (!config) return;
  currentDocData = config;
  const container = document.getElementById('formFields');

  // Build section separator
  const sectionSep = '<div style="margin:28px 0 16px;border-top:1px solid #E5E7EB;"></div>';

  let html = '';

  // Render regular fields
  if (config.fields) {
    config.fields.forEach(f => {
    html += `<div class="form-group">`;
    html += `<label class="form-label">${f.label}${f.required ? '<span class="required">*</span>' : ''}</label>`;
    if (f.type === 'textarea') {
      html += `<textarea class="form-textarea" id="field_${f.id}" placeholder="请输入${f.label}"></textarea>`;
    } else if (f.type === 'date') {
      html += `<input class="form-input" type="date" id="field_${f.id}" />`;
    } else if (f.type === 'radio') {
      f.options.forEach((opt, i) => {
        html += `<label style="display:inline-flex;align-items:center;gap:6px;margin-right:24px;cursor:pointer;font-size:15px;">
          <input type="radio" name="${f.id}" value="${opt}" ${(f.defaultValue===opt||i===0)?'checked':''} onchange="guidedToggle('${f.id}')" style="accent-color:var(--primary);width:18px;height:18px;">
          ${opt}</label>`;
      });
    } else {
      html += `<input class="form-input" type="${f.type === 'number' ? 'text' : 'text'}" id="field_${f.id}" placeholder="请输入${f.label}" />`;
    }
    if (f.hint) {
      html += `<div style="font-size:12px;color:var(--text-weak);margin-top:4px;">${f.hint}</div>`;
    }
    html += `<div class="form-hint" id="hint_${f.id}">请填写${f.label}</div>`;
    html += `</div>`;
  });
  }

  // Render guided sections if present
  if (config.guided) {
    html += sectionSep;
    config.guided.forEach(section => {
      html += `<div class="guided-section" style="margin-bottom:24px;">`;
      html += `<div style="font-size:17px;font-weight:500;color:var(--primary);margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid var(--primary);">${section.title}</div>`;
      section.children.forEach(child => {
        const gid = 'g_' + child.id;
        html += `<div class="form-group guided-row" data-gid="${gid}" id="row_${gid}"${child.showIf ? ' style="display:none"' : ''}>`;
        html += `<label class="form-label">${child.label || ''}</label>`;
        if (child.type === 'label') {
          html += `<div style="font-size:14px;font-weight:700;color:#1E3A5F;border-left:3px solid #1E3A5F;padding:4px 0 4px 10px;margin:16px 0 10px 0;">${child.text}</div>`;
        } else if (child.type === 'radio') {
          child.options.forEach((opt, i) => {
            html += `<label style="display:inline-flex;align-items:center;gap:6px;margin-right:20px;cursor:pointer;font-size:15px;">
              <input type="radio" name="${gid}" value="${opt}" ${(child.defaultValue===opt||i===0)?'checked':''} onchange="guidedToggle('${gid}')" style="accent-color:var(--primary);width:18px;height:18px;">
              ${opt}</label>`;
          });
        } else if (child.type === 'textarea') {
          html += `<textarea class="form-textarea" id="field_${gid}" placeholder="请输入${child.label}"></textarea>`;
        } else if (child.type === 'date') {
          html += `<input class="form-input" type="date" id="field_${gid}" />`;
        } else if (child.type === 'number') {
          html += `<input class="form-input guided-number" type="text" id="field_${gid}" placeholder="请输入${child.label}" />`;
        } else if (child.repeatable) {
          // Repeatable items type
          html += `<div id="repeat_${gid}" data-repeater="${gid}" data-fields='${JSON.stringify(child.sub)}'></div>`;
          html += `<button type="button" class="btn-add-item" onclick="addRepeatItem('${gid}')" style="display:inline-flex;align-items:center;gap:4px;padding:8px 16px;background:var(--card);border:1.5px dashed var(--border);border-radius:8px;cursor:pointer;color:var(--primary);font-size:13px;margin-top:8px;">+ 添加${child.label.replace('信息','')}</button>`;
        } else {
          html += `<input class="form-input" type="text" id="field_${gid}" placeholder="请输入${child.label || ''}" />`;
        }
        if (child.hint) {
          html += `<div style="font-size:12px;color:var(--text-weak);margin-top:4px;">${child.hint}</div>`;
        }
        html += `</div>`;
      });
      html += `</div>`;
    });
  }

  // Render sections if present (for debt, partner, prenup, accident)
  if (config.sections) {
    html += sectionSep;
    config.sections.forEach(section => {
      html += `<div class="guided-section" style="margin-bottom:24px;">`;
      html += `<div style="font-size:17px;font-weight:500;color:var(--primary);margin-bottom:16px;padding-bottom:8px;border-bottom:2px solid var(--primary);">${section.title}</div>`;
      section.fields.forEach(field => {
        const gid = 'g_' + field.id;
        html += `<div class="form-group guided-row" data-gid="${gid}" id="row_${gid}"${field.showIf ? ' style="display:none"' : ''}>`;
        html += `<label class="form-label">${field.label || ''}</label>`;
        if (field.type === 'label') {
          html += `<div style="font-size:14px;font-weight:700;color:#1E3A5F;border-left:3px solid #1E3A5F;padding:4px 0 4px 10px;margin:16px 0 10px 0;">${field.text}</div>`;
        } else if (field.type === 'radio') {
          field.options.forEach((opt, i) => {
            html += `<label style="display:inline-flex;align-items:center;gap:6px;margin-right:20px;cursor:pointer;font-size:15px;">
              <input type="radio" name="${gid}" value="${opt}" ${(field.default === opt || (field.defaultValue === opt) || (!field.default && !field.defaultValue && i===0)) ? 'checked' : ''} onchange="guidedToggle('${gid}')" style="accent-color:var(--primary);width:18px;height:18px;">
              ${opt}</label>`;
          });
        } else if (field.type === 'textarea') {
          html += `<textarea class="form-textarea" id="field_${gid}" placeholder="${field.placeholder || '请输入' + field.label}"></textarea>`;
        } else if (field.type === 'date') {
          html += `<input class="form-input" type="date" id="field_${gid}" />`;
        } else if (field.type === 'number') {
          html += `<input class="form-input guided-number" type="text" id="field_${gid}" placeholder="${field.placeholder || '请输入' + field.label}" />`;
        } else {
          html += `<input class="form-input" type="text" id="field_${gid}" placeholder="${field.placeholder || '请输入' + (field.label || '')}" />`;
        }
        if (field.hint) {
          html += `<div style="font-size:12px;color:var(--text-weak);margin-top:4px;">${field.hint}</div>`;
        }
        html += `</div>`;
      });
      html += `</div>`;
    });
  }

  container.innerHTML = html;

  // Attach validators for regular fields
  if (config.fields) {
    config.fields.forEach(f => {
      const el = document.getElementById('field_' + f.id);
      if (!el) return;
      if (f.type === 'idcard') { el.maxLength = 18; el.addEventListener('blur', () => validateIdCard(f.id)); }
      if (f.type === 'phone') { el.maxLength = 11; el.addEventListener('blur', () => validatePhone(f.id)); }
      if (f.type === 'number') { el.addEventListener('input', () => { el.value = el.value.replace(/[^\\d.]/g, ''); }); }
    });
  }

  // Attach number filter and auto-CNY to guided inputs
  document.querySelectorAll('.guided-number').forEach(el => {
    el.addEventListener('input', function() {
      this.value = this.value.replace(/[^\d.]/g, '');
    });
  });
  // Validate guided idcard and phone fields
  document.querySelectorAll('.form-input[id^="field_g_"]').forEach(el => {
    const gid = el.id.replace('field_', '');
    // Check if this guided field should be idcard or phone type
    if (config.guided || config.sections) {
      const allSections = config.guided || config.sections;
      allSections.forEach(section => {
        const items = section.children || section.fields;
        items.forEach(child => {
          if (child.repeatable) return;
          if (('g_' + child.id) === gid) {
            if (child.type === 'idcard') {
              el.maxLength = 18;
              el.addEventListener('blur', function() {
                const val = this.value.trim();
                if (val && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)) {
                  this.classList.add('error');
                } else {
                  this.classList.remove('error');
                }
              });
            }
            if (child.type === 'phone') {
              el.maxLength = 11;
              el.addEventListener('blur', function() {
                const val = this.value.trim();
                if (val && !/^1[3-9]\d{9}$/.test(val)) {
                  this.classList.add('error');
                } else {
                  this.classList.remove('error');
                }
              });
            }
          }
        });
      });
    }
  });

  // Amount → CNY auto-convert for IOU and transfer
  const amtEl = document.getElementById('field_g_amount');
  const cnyEl = document.getElementById('field_g_amountCN');
  if (amtEl && cnyEl) {
    amtEl.addEventListener('input', function() {
      cnyEl.value = numberToCNY(this.value);
    });
  }
  // Auto-calculate contract end date for employment
  if (docId === 'employment') {
    const calcEndDate = () => {
      const startEl = document.getElementById('field_g_startDate');
      const endEl = document.getElementById('field_g_endDate');
      const startVal = startEl?.value;
      if (!startVal || !endEl) return;
      const term = document.querySelector('input[name="g_contractTerm"]:checked')?.value;
      if (!term || term === '无固定期限') return;
      const s = new Date(startVal);
      if (isNaN(s)) return;
      let years = 0;
      if (term === '自定义') {
        const custom = document.getElementById('field_g_customYears')?.value;
        years = parseInt(custom) || 0;
      } else {
        years = parseInt(term);
      }
      if (years <= 0) return;
      s.setFullYear(s.getFullYear() + years);
      s.setDate(s.getDate() - 1);
      const y = s.getFullYear();
      const m = String(s.getMonth() + 1).padStart(2, '0');
      const d = String(s.getDate()).padStart(2, '0');
      endEl.value = y + '-' + m + '-' + d;
    };
    document.getElementById('field_g_startDate')?.addEventListener('change', calcEndDate);
    document.querySelectorAll('input[name="g_contractTerm"]').forEach(r => r.addEventListener('change', calcEndDate));
    document.getElementById('field_g_customYears')?.addEventListener('input', calcEndDate);
  }

  // CNY validation for transfer guided number fields
  ['g_price','g_deposit'].forEach(gid => {
    const el = document.getElementById('field_' + gid);
    if (el) {
      el.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d.]/g, '');
      });
    }
  });

  // Pre-fill repeatable items for each repeater
  if (config.guided || config.sections) {
    const allSections = config.guided || config.sections;
    allSections.forEach(section => {
      const items = section.children || section.fields;
      items.forEach(child => {
        if (child.repeatable && !isHiddenByShowIf(child)) {
          const gid = 'g_' + child.id;
          if (document.getElementById('repeat_' + gid)) {
            addRepeatItem(gid);
          }
        }
      });
    });
  }

  // Live estimate display for termination compensation
  if (docId === 'labor') {
    // Insert estimate divs after each termination date field
    ['g_terminationDate','g_terminationDate2','g_terminationDate3','g_terminationDateN1'].forEach(tid => {
      const el = document.getElementById('field_' + tid);
      if (el && !document.getElementById('est_' + tid)) {
        const div = document.createElement('div');
        div.id = 'est_' + tid;
        div.style.cssText = 'margin-top:6px;font-size:14px;';
        el.parentElement.appendChild(div);
      }
    });
    const updateEstimate = () => {
      const entryRaw = document.getElementById('field_g_entryDate')?.value;
      const salRaw = document.getElementById('field_g_salary')?.value;
      if (!entryRaw || !salRaw) return;
      const sal = parseFloat(salRaw);
      if (!sal) return;
      ['g_terminationDate','g_terminationDate2','g_terminationDate3','g_terminationDateN1'].forEach(tid => {
        const estEl = document.getElementById('est_' + tid);
        if (!estEl) return;
        const termRaw = document.getElementById('field_' + tid)?.value;
        if (!termRaw) { estEl.innerHTML = ''; return; }
        const s = new Date(entryRaw), e = new Date(termRaw);
        if (isNaN(s) || isNaN(e)) { estEl.innerHTML = ''; return; }
        const totalMonths = (e.getFullYear()-s.getFullYear())*12 + (e.getMonth()-s.getMonth());
        if (totalMonths < 0) { estEl.innerHTML = ''; return; }
        const yrs = Math.floor(totalMonths / 12);
        const rem = totalMonths % 12;
        const workYrs = rem >= 6 ? yrs + 1 : yrs + (rem > 0 ? 0.5 : 0);
        const is2N = tid === 'g_terminationDate' || tid === 'g_terminationDate3';
        const isN1 = tid === 'g_terminationDateN1';
        const multiplier = is2N ? (workYrs * 2) : (isN1 ? (workYrs + 1) : workYrs);
        const amt = Math.round(sal * multiplier);
        const label = is2N ? ' × 2（违法解除）' : (isN1 ? ' + 1（代通知金）' : '（经济补偿）');
        estEl.innerHTML = '<span style="color:#16A34A;font-weight:500;">预估：工作' + workYrs + '年，月工资' + sal + '元 × ' + workYrs + '年' + label + ' = <strong>约' + amt.toLocaleString() + '元</strong></span>';
        // Auto-fill amount
        const amtFieldId = tid.replace('DateN1', 'AmountN1').replace('Date', 'Amount').replace('Date2', 'Amount2').replace('Date3', 'Amount3');
        const amtField = document.getElementById('field_g_' + amtFieldId);
        if (amtField && (!amtField.value || amtField.value === '0')) {
          amtField.value = amt;
        }
      });
    };
    document.getElementById('field_g_entryDate')?.addEventListener('change', updateEstimate);
    document.getElementById('field_g_salary')?.addEventListener('input', updateEstimate);
    ['g_terminationDate','g_terminationDate2','g_terminationDate3','g_terminationDateN1'].forEach(tid => {
      document.getElementById('field_' + tid)?.addEventListener('change', updateEstimate);
    });
    // Auto-detect arbitration commission from company address
    const autoArbitration = () => {
      const arbEl = document.getElementById('field_g_arbitration');
      if (!arbEl) return;
      const addr = document.getElementById('field_g_respondentAddr')?.value?.trim();
      if (!addr) { if (!arbEl.dataset.userEdited || arbEl.dataset.userEdited === '0') arbEl.value = ''; return; }
      if (arbEl.dataset.userEdited === '1' && arbEl.value.trim()) return;
      let m = addr.match(/([一-龥]+市)([一-龥]+区)/);
      if (m) { arbEl.value = m[1] + m[2] + '劳动人事争议仲裁委员会'; return; }
      m = addr.match(/([一-龥]+市)([一-龥]+县)/);
      if (m) { arbEl.value = m[1] + m[2] + '劳动人事争议仲裁委员会'; return; }
      m = addr.match(/([一-龥]+市)/);
      if (m) { arbEl.value = m[1] + '劳动人事争议仲裁委员会'; return; }
      if (!arbEl.dataset.userEdited || arbEl.dataset.userEdited === '0') arbEl.value = '';
    };
    document.getElementById('field_g_respondentAddr')?.addEventListener('input', autoArbitration);
    document.getElementById('field_g_arbitration')?.addEventListener('input', function() { this.dataset.userEdited = this.value.trim() ? '1' : '0'; });
    autoArbitration();
  }

  // Auto-generate dispute narrative for labor
  if (docId === 'labor') {
    const genNarrative = () => {
      const parts = [];
      const getR = (n) => { const r = document.querySelector('input[name="' + n + '"]:checked'); return r ? r.value : ''; };
      const getV = (id) => { const e = document.getElementById('field_' + id); return e ? e.value.trim() : ''; };
      const fmtD = (raw) => { if (!raw) return ''; const p = raw.split('-'); if (p.length !== 3) return raw; return parseInt(p[0]) + '年' + parseInt(p[1]) + '月' + parseInt(p[2]) + '日'; };
      const entry = getV('g_entryDate');
      const pos = getV('g_position');
      const sal = getV('g_salary');
      // Intro
      if (entry) {
        let intro = '申请人于' + fmtD(entry) + '入职被申请人处';
        if (pos) intro += '，在' + pos + '岗位工作';
        if (sal) intro += '，月工资人民币' + sal + '元';
        parts.push(intro + '。');
      }
      // Contract
      if (getR('g_hasContract') === '未签订书面劳动合同') parts.push('入职后，被申请人一直未与申请人签订书面劳动合同。根据《劳动合同法》第八十二条，用人单位自用工之日起超过一个月不满一年未签订书面劳动合同的，应向劳动者支付双倍工资。');
      // Social insurance
      if (getR('g_hasSocial') === '未缴纳社会保险') parts.push('在职期间，被申请人从未为申请人缴纳社会保险。');
      if (getR('g_hasSocial') === '部分缴纳') parts.push('在职期间，被申请人仅为申请人部分缴纳社会保险。');
      // Pay cut
      if (getR('g_hasPayCut') === '有降薪或恶意克扣工资' && getV('g_payCutDetail')) {
        parts.push(getV('g_payCutDetail') + '。被申请人单方降薪的行为未经双方协商一致，违反《劳动合同法》第三十五条的规定。');
      }
      // Wage
      if (getR('g_hasWageClaim') === '有工资纠纷' && getV('g_wageDetail')) parts.push('被申请人拖欠申请人工资：' + getV('g_wageDetail') + '。');
      // Termination with calculation
      const term = getR('g_hasTermination');
      if (term && term !== '无解除问题') {
        const tDate = getV('g_terminationDate') || getV('g_terminationDate2') || getV('g_terminationDate3') || getV('g_terminationDateN1');
        const tDateFmt = tDate ? fmtD(tDate) : '';
        if (term === '公司违法解除或单方辞退（2N）' || term === '公司逼我离职（2N）') {
          let termLine = tDateFmt ? tDateFmt + '，' : '';
          if (term === '公司逼我离职（2N）') {
            termLine += '被申请人通过调岗降薪等方式逼迫申请人离职，实质属于变相违法解除劳动合同';
          } else {
            const isProb = getR('g_hasProbation') === '是';
            const isPreg = getR('g_hasPregnancy') === '处于孕期' || getR('g_hasMaternity') === '处于产期' || getR('g_hasNursing') === '处于哺乳期';
            const isInj = getR('g_hasInjury') === '涉及工伤';
            const noReason = getR('g_isNoReason') === '是';
            // Build structured narrative from selected flags
            if (isPreg) {
              const periods = [];
              if (getR('g_hasPregnancy') === '处于孕期') periods.push('孕期');
              if (getR('g_hasMaternity') === '处于产期') periods.push('产期');
              if (getR('g_hasNursing') === '处于哺乳期') periods.push('哺乳期');
              termLine += '被申请人将正处于' + periods.join('、') + '的申请人辞退，违反了《中华人民共和国劳动合同法》第四十二条关于不得解除' + periods.join('、') + '女职工劳动合同的规定，属于违法解除劳动合同';
            } else if (isInj) {
              termLine += '被申请人将因工受伤的申请人辞退，违反了《中华人民共和国劳动合同法》第四十二条及《工伤保险条例》关于不得解除工伤职工劳动合同的规定，属于违法解除劳动合同';
            } else if (isProb) {
              termLine += '被申请人在试用期内将申请人辞退，但未提供任何证据证明申请人不符合录用条件，属于违法解除劳动合同';
            } else if (noReason) {
              termLine += '被申请人单方将申请人辞退，未说明任何合法理由，亦未支付任何赔偿，属于违法解除劳动合同';
            } else {
              termLine += '被申请人单方将申请人辞退，属于违法解除劳动合同';
            }
          }
          termLine += '。';
          if (entry && tDate && sal) {
            const s = new Date(entry), e = new Date(tDate);
            if (!isNaN(s) && !isNaN(e)) {
              const mons = (e.getFullYear()-s.getFullYear())*12 + (e.getMonth()-s.getMonth());
              if (mons > 0) {
                const y = Math.floor(mons/12), r = mons%12;
                const wy = r >= 6 ? y+1 : y + (r>0?0.5:0);
                const amt = Math.round(parseFloat(sal) * wy * 2);
                termLine += '申请人自' + fmtD(entry) + '入职至' + tDateFmt + '，工作' + wy + '年（月工资' + sal + '元 × ' + wy + '年 × 2），依法应获得违法解除劳动合同赔偿金共计人民币' + amt + '元。';
              }
            }
          }
          parts.push(termLine);
        } else if (term === '公司协商解除但未给补偿（N）') {
          let termLine = tDateFmt ? tDateFmt + '，' : '';
          termLine += '被申请人与申请人协商解除劳动合同，但至今未按约定支付经济补偿。';
          if (entry && tDate && sal) {
            const s = new Date(entry), e = new Date(tDate);
            if (!isNaN(s) && !isNaN(e)) {
              const mons = (e.getFullYear()-s.getFullYear())*12 + (e.getMonth()-s.getMonth());
              if (mons > 0) {
                const y = Math.floor(mons/12), r = mons%12;
                const wy = r >= 6 ? y+1 : y + (r>0?0.5:0);
                const amt = Math.round(parseFloat(sal) * wy);
                termLine += '申请人工作' + wy + '年（月工资' + sal + '元 × ' + wy + '年），依法应获得经济补偿金共计人民币' + amt + '元。';
              }
            }
          }
          parts.push(termLine);
        } else if (term === '公司合法解除但未提前30天通知（N+1）') {
          let termLine = tDateFmt ? tDateFmt + '，' : '';
          termLine += '被申请人单方解除劳动合同，但未提前三十日书面通知申请人，亦未支付代通知金。';
          if (entry && tDate && sal) {
            const s = new Date(entry), e = new Date(tDate);
            if (!isNaN(s) && !isNaN(e)) {
              const mons = (e.getFullYear()-s.getFullYear())*12 + (e.getMonth()-s.getMonth());
              if (mons > 0) {
                const y = Math.floor(mons/12), r = mons%12;
                const wy = r >= 6 ? y+1 : y + (r>0?0.5:0);
                const amt = Math.round(parseFloat(sal) * (wy + 1));
                termLine += '申请人工作' + wy + '年（月工资' + sal + '元 × ' + wy + '年 + 1个月代通知金），依法应获得经济补偿金及代通知金（N+1）共计人民币' + amt + '元。';
              }
            }
          }
          parts.push(termLine);
        }
      }
      // Overtime
      if (getR('g_hasOvertime') === '有加班费纠纷' && getV('g_overtimeDetail')) parts.push('加班情况：' + getV('g_overtimeDetail') + '。');
      // Annual
      if (getR('g_hasAnnual') === '有未休年假工资纠纷' && getV('g_annualDetail')) parts.push('年假情况：' + getV('g_annualDetail') + '。');
      // Pregnancy/Maternity/Nursing (only if no termination)
      const hasTermOut = term && term !== '无解除问题';
      if (!hasTermOut) {
        const isPreg = getR('g_hasPregnancy') === '处于孕期';
        const isMat = getR('g_hasMaternity') === '处于产期';
        const isNurs = getR('g_hasNursing') === '处于哺乳期';
        const isInj = getR('g_hasInjury') === '涉及工伤';
        const detail = getV('g_protectDetail');
        if (isPreg || isMat || isNurs || isInj) {
          if (detail) {
            parts.push(detail + '。');
          } else {
            const labels = [];
            if (isPreg) labels.push('孕期');
            if (isMat) labels.push('产期');
            if (isNurs) labels.push('哺乳期');
            if (isInj) labels.push('工伤');
            parts.push('申请人涉及' + labels.join('、') + '特殊保护情形，但被申请人未依法给予相应待遇。根据《中华人民共和国劳动合同法》第四十二条' + (isInj ? '及《工伤保险条例》' : '' ) + '之规定，用人单位应依法保障劳动者的合法权益。');
          }
        }
      }
      // Negotiation
      if (getR('g_hasNegotiated') === '已与公司协商但未解决') parts.push('申请人已就上述事项与被申请人协商，但被申请人至今未予解决。');
      return parts.join('\n');
    };
    const detailEl = document.getElementById('field_g_disputeDetail');
    if (detailEl) {
      detailEl.dataset.userEdited = '0';
      const updateNarrative = () => {
        if (detailEl.dataset.userEdited === '1') return;
        detailEl.value = genNarrative();
      };
      // Update on claim/reason field changes
      document.querySelectorAll('#formFields input, #formFields textarea').forEach(el => {
        if (el === detailEl) return;
        el.addEventListener('change', updateNarrative);
        el.addEventListener('input', updateNarrative);
      });
      // Mark as user-edited when they type
      detailEl.addEventListener('input', function() {
        this.dataset.userEdited = '1';
      });
      // Initial fill
      detailEl.value = genNarrative();
    }
  }

  // Auto-generate dispute narrative for complaint
  if (docId === 'complaint') {
    const genComplaintNarrative = () => {
      const parts = [];
      const getR = (n) => { const r = document.querySelector('input[name="' + n + '"]:checked'); return r ? r.value : ''; };
      const getV = (id) => { const e = document.getElementById('field_' + id); return e ? e.value.trim() : ''; };
      const fmtD = (raw) => { if (!raw) return ''; const p = raw.split('-'); if (p.length !== 3) return raw; return parseInt(p[0]) + '年' + parseInt(p[1]) + '月' + parseInt(p[2]) + '日'; };
      const caseType = getR('g_caseType');
      if (caseType !== '民间借贷纠纷') return '';
      const isWritten = getR('g_agreementType') === '书面借款合同';
      const amt = getV('g_loanAmount');
      const loanDate = fmtD(getV('g_loanDate'));
      const repayDate = fmtD(getV('g_repayDate'));
      const rateType = getR('g_rateType');
      const rate = getV('g_loanRate');
      const monthRate = getV('g_loanMonthRate');
      const fixedInt = getV('g_fixedInterest');
      const method = getR('g_loanMethod') || '转账';
      let rateText = '未约定利息';
      if (rateType === '年利率' && rate) rateText = '年利率' + rate + '%';
      else if (rateType === '月利率' && monthRate) rateText = '月利率' + monthRate + '%';
      else if (rateType === '约定固定利息金额' && fixedInt) rateText = '约定利息人民币' + parseFloat(fixedInt).toLocaleString() + '元';
      if (loanDate) {
        parts.push(loanDate + '，原、被告达成' + (isWritten ? '书面借款合同' : '口头借款协议') + '，约定原告向被告出借人民币' + (amt ? parseFloat(amt).toLocaleString() + '元' : '___元') + '，借款期限至' + repayDate + '，到期一次性还清' + rateText + '。原告已于当日通过' + method + '向被告实际交付上述款项。');
      }
      if (getR('g_hasRepaid') === '已还部分款项') {
        const rp = getV('g_repaidPrincipal');
        const ri = getV('g_repaidInterest');
        const rDate = fmtD(getV('g_repaidDate'));
        let rd = '被告仅偿还了';
        if (parseFloat(rp) > 0) rd += '本金' + parseFloat(rp).toLocaleString() + '元';
        if (parseFloat(ri) > 0) rd += (parseFloat(rp) > 0 ? '、' : '') + '利息' + parseFloat(ri).toLocaleString() + '元';
        if (!parseFloat(rp) && !parseFloat(ri)) rd += '部分款项';
        if (rDate) rd += '（最后一次还款为' + rDate + '）';
        const owed = Math.max(0, (parseFloat(amt) || 0) - (parseFloat(rp) || 0));
        rd += '，剩余' + owed.toLocaleString() + '元至今未还。';
        parts.push('借款到期后，被告未按约定还款。' + rd);
      } else {
        parts.push('借款到期后，被告未按约定归还借款本金，至今未偿还任何款项。');
      }
      parts.push('根据《中华人民共和国民法典》第六百七十九条及第六百七十五条，被告已构成违约，依法应当承担还款责任。');
      parts.push('现为维护原告合法权益，特依法向贵院提起诉讼，恳请依法判如所请。');
      return parts.join('\n');
    };
    const detailEl = document.getElementById('field_g_disputeDetail');
    if (detailEl) {
      detailEl.dataset.userEdited = '0';
      const updateNarrative = () => {
        if (detailEl.dataset.userEdited === '1') return;
        const gen = genComplaintNarrative();
        if (gen) detailEl.value = gen;
      };
      document.querySelectorAll('#formFields input, #formFields textarea').forEach(el => {
        if (el === detailEl) return;
        el.addEventListener('change', updateNarrative);
        el.addEventListener('input', updateNarrative);
      });
      detailEl.addEventListener('input', function() { this.dataset.userEdited = '1'; });
      const initGen = genComplaintNarrative();
      if (initGen) detailEl.value = initGen;
    }
  }

  // Run toggle for all radio-triggered conditions
  guidedToggleAll();
}

function validateIdCard(fieldId) {
  const el = document.getElementById('field_' + fieldId);
  const hint = document.getElementById('hint_' + fieldId);
  const val = el.value.trim();
  if (!val) { el.classList.remove('error'); return true; }
  const idReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!idReg.test(val)) {
    el.classList.add('error');
    hint.textContent = '请输入正确的18位身份证号';
    hint.style.display = 'block';
    return false;
  }
  el.classList.remove('error');
  hint.style.display = 'none';
  return true;
}

function validatePhone(fieldId) {
  const el = document.getElementById('field_' + fieldId);
  const hint = document.getElementById('hint_' + fieldId);
  const val = el.value.trim();
  if (!val) { el.classList.remove('error'); return true; }
  if (!/^1[3-9]\d{9}$/.test(val)) {
    el.classList.add('error');
    hint.textContent = '请输入正确的11位手机号';
    hint.style.display = 'block';
    return false;
  }
  el.classList.remove('error');
  hint.style.display = 'none';
  return true;
}

// ==================== GUIDED FORM HELPERS ====================
function guidedToggleAll() {
  if (!currentDocData) return;
  const sections = currentDocData.guided || currentDocData.sections;
  if (!sections) return;
  sections.forEach(section => {
    const items = section.children || section.fields;
    items.forEach(child => {
      if (child.type === 'radio' || child.showIf) {
        guidedToggle('g_' + child.id);
      }
    });
  });
}

function guidedToggle(gid) {
  if (!currentDocData) return;
  const sections = currentDocData.guided || currentDocData.sections;
  if (!sections) return;
  // Walk ALL guided children and update visibility based on showIf conditions
  sections.forEach(section => {
    const items = section.children || section.fields;
    items.forEach(child => {
      if (child.showIf) {
        const row = document.getElementById('row_g_' + child.id);
        if (!row) return;
        const visible = checkShowIf(child.showIf);
        row.style.display = visible ? '' : 'none';
        if (!visible && child.repeatable) {
          const rpt = document.getElementById('repeat_g_' + child.id);
          if (rpt) rpt.innerHTML = '';
        }
        if (visible && child.repeatable) {
          const rpt = document.getElementById('repeat_g_' + child.id);
          if (rpt && rpt.children.length === 0) {
            addRepeatItem('g_' + child.id);
          }
        }
      }
    });
  });
}

function isHiddenByShowIf(child) {
  if (!child.showIf) return false;
  return !checkShowIf(child.showIf);
}

function checkShowIf(showIf) {
  for (const [key, expected] of Object.entries(showIf)) {
    const radioName = 'g_' + key;
    const radios = document.getElementsByName(radioName);
    let selected = '';
    radios.forEach(r => { if (r.checked) selected = r.value; });
    // Also check non-guided radios
    if (!selected) {
      const legacyRadios = document.getElementsByName(key);
      legacyRadios.forEach(r => { if (r.checked) selected = r.value; });
    }
    if (selected !== expected) return false;
  }
  return true;
}

function addRepeatItem(gid) {
  const container = document.getElementById('repeat_' + gid);
  if (!container) return;
  const fieldStr = container.dataset.fields;
  if (!fieldStr) return;
  const fields = JSON.parse(fieldStr);
  const idx = container.children.length;
  const itemDiv = document.createElement('div');
  itemDiv.className = 'repeat-item';
  itemDiv.style.cssText = 'background:#F8FAFC;border:1px solid #E5E7EB;border-radius:10px;padding:14px;margin-bottom:10px;position:relative;';
  let inner = '';
  if (container.children.length > 0) {
    inner += '<button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:8px;right:10px;background:none;border:none;color:#DC2626;cursor:pointer;font-size:20px;line-height:1;">×</button>';
  }
  fields.forEach(f => {
    const fid = gid + '_' + f.id + '_' + idx;
    inner += `<div style="margin-bottom:8px;">`;
    inner += `<label style="font-size:13px;color:#475569;display:block;margin-bottom:3px;">${f.label}</label>`;
    if (f.type === 'radio') {
      f.options.forEach((opt, oi) => {
        inner += `<label style="display:inline-flex;align-items:center;gap:4px;margin-right:16px;cursor:pointer;font-size:14px;">
          <input type="radio" name="${fid}" value="${opt}" ${(f.defaultValue===opt||oi===0)?'checked':''} style="accent-color:var(--primary);width:16px;height:16px;">${opt}</label>`;
      });
    } else if (f.type === 'date') {
      inner += `<input class="form-input" type="date" id="field_${fid}" style="height:44px;" />`;
    } else {
      inner += `<input class="form-input" type="text" id="field_${fid}" placeholder="${f.label}" style="height:44px;" />`;
    }
    if (f.hint) inner += `<div style="font-size:11px;color:#9CA3AF;margin-top:2px;">${f.hint}</div>`;
    inner += `</div>`;
  });
  itemDiv.innerHTML = inner;
  container.appendChild(itemDiv);
}

function getRadioValue(name) {
  const radios = document.getElementsByName(name);
  for (const r of radios) { if (r.checked) return r.value; }
  return '';
}

function getFieldVal(fid) {
  const el = document.getElementById('field_' + fid);
  return el ? el.value.trim() : '';
}



// ==================== COMPOSE GUIDED DATA ====================


// ==================== ACTIVATION ====================
// SHA256 hashes of valid activation codes
const VALID_HASHES = [
  '48a15312cb733ba28a3968bd184339bfd1e450002fd87956f5ef2bcb8d79a087', // FB2026-FREE-TRIAL
  'fe2e5c841e1e0b3b3d49003d9098bf3c7be4406157334f4fe3af4039e71705fb', // FB2026-A001-8XK2
  'd02328cbb79188292c375f94b82c68f399a8c11621796af6f6811f315c1ef2f8', // FB2026-A002-3PQM
  '5fb0869f5f13e687085085db0cf7ae03bcd3e6d0d85c91e22956f0d4ddfaef31', // FB2026-A003-7YRN
  '1888fea5bc24d0112f5e6dc86c9ded1ce36d619608edda89b6eca0a4c5d30698', // FB2026-A004-5WTJ
  '391d3231acc9ade1101cf984c69cb2b17513da17fd154d4265eaeed13eb8599c', 'e5fffe421041328b3e330e2c9ed18ff7b6f184e237fa18a26eac3d2a9ce32f9d',
  '552e4b3bf7498b0b86fa85fa3d5d6a4c28bb5202070a4d830c03e8ce3241a6ea', '5626ce886c0ba8fcd1429806ca694dc255136b1a814e5f4b65541151ac1dbe68',
  'a4712ee95ca4fa1a806585137b9411720ea8de42f7465df9a63c1654ddd45db4', 'eba51a2e2a5173ae9c66fe9078e8c509cd71d2bbd2afc3f1692f4f7de5057a9e',
  '8c3e7f9a16fc6fa541adc9f41430ad5de6e246af2cbe5aaa6018cd3f390d8a19', 'df2839386ebafe2c909b0d4928ff648cf0098d36d7c0088c93de35533266651a',
  '2f36132227bba3b702c40f594d6772485c43f887de0f3c25ff9001f550b2c564', '4c44cf1550f5ed0c0bbc341c635f71c50ee6dca80c610f7df31be41cca772167',
  'dba96b48c06c5f87ef6cd94e4fb995217412bcc397d4c0e8cb475f9c312985ae', 'e19c6e7181d80a0575e6ea12a0e36a45e7be861c42857fe74691492e3c5fced9',
  '1e5efbaff60b1bbb9ebdb954b515e32abad09b0fa4706c634f1eba8ac6dcff7e', '9b115a8585b8b4f18d749d6690147d7789da6eb6fde710a2599f18f07d079903',
  '45845429c7a5fafde1c76450c96781d33da17293a890276f330d018e706ac838', '8b23302ead18cd248589eaf24f850891297b2381985acaa5053a0c3be8d4faee',
  'b018cbc6fb2243563983d0781fb76bbdeae787b9ef4399c22e0dfa94669bb331', '6ca1fdb38b63a206e1523298bb75a1760d4cfcbb549b0bf91da96490722ae091',
  'ede5e173e93396a8b4e210fe0614ec8118461a1c0cbd63e1f75403a19370733a', '19448d6cd0b42718d767a98370ccc133fdd5fccaefa5b3325338ffcd1d72cd33',
  'e9ebd90bc7720503603e2b5cc0a1db9dd0122c5d6929632973e5796ae4ff1d20', '23f1b47815801d1231528a3a3642a8977c1ce1a5fff14a832508078a58479db7',
  '9d9a897e9e9db282778ccdedc517e85b263e2c8d47c129134325148c734003ed', '1377df7b4c52fa959fd730ad9ddebf6df4d490f85d262a8373a8275646710582',
  '8f6ed3a4e63248fc63f41fc1b6a591d713c969570603c271f16a56d11c4e1e22', '3ae5908eedb6ce2aca8a18d700b99dde73120a66e34486bc8dfa4d8e2a879db1',
  '280affe2b1bf01b9d95f7dda3ffaeb52543a027b825abf3b865b3fc56d39e96b', 'e0549c9acfe11857b3729b2664abf4bd03436c465000609333a5e03807a1f78a',
  '5ce978937519ec0cde0997c20784fff8f9ae7012a88313e45f6aa9ee7c0df5da', '64b8a283277053571e6975481823d6a013e50b72019164aa08e51ca6f235a7a9',
  '8d22264d2fcf7e32ddb23047ca2a4016f39043fc880567b7c014c4cc1976a8ea', '199d7142de9f504c100de3393a351458d783c9f5955805e0e449ea9babff753e',
  'c4e79d81faa0d83ae747a0cbe6c41a4f5568b281d3e97be019340b51158b3530', '3f90da614cf9e033afa81a9d4cc5ca5c9faceb342868bc5a4a02595c863c6909',
  '478193bef9dfdd1160b2eb89ba9738eee4c1d54219ff21f286fe2c33d69eed11', '1c57cb67397f2d875d3aa5debde9e4a8504e457e32d717a85f88f238b7cc5180',
  '6e8c9a313e6534985a650a8af7723129fa9d7d79ca9ac46548a2aecfc48f43a6', '31087d93d506856fba3994c589acb9771d5cd4bd738f6e2a8f9d0b6d915c2140',
  'd767d730685b6ca385f828f27b6e9595c33e4ffaf9394695a9c21c2c9ad56120', '2d8c84f101dca0a4e8514daf2f6bfb0123fccbfe5aadc92596f8a22126dc2abf',
  'd83facf911c71b1ab9ca499f1723f552770e028522558e634ad76383c2a9638b', '061a881dce6f1d3073aa406ece53d6cbae7a8e9ec9b7d32eaddfc45787dfe2d0',
  '6fbf2e756ac9f890682748c00444070242ddaab969475c086198e44ede8665b0', '93066d0c3a5765e686c0b118fec3671dc2d81e1ffc026f2bfb06e673e8ce2f5f',
  '76d484da9598ab5f9b1d71577142f2046a7d3fd8ccfc0608a47b6af1149fe4d1', '7ad4da5c6e749a21602dbbbdf22b73b5f7c815bbbc9b25957a93b26ea334f91d',
  'fd89c22cac48f56f9e9daad9827084fc1e85be7c54158a1f9d996d7cdeb2acce', '35525d9fd2bf0a9adcdad5c5d704ce1e96b46ac6a7e30d657a4f9e9ee751eaaa',
  '6310b6ff6a8842b73c3ddcc0b8d8e60fac53eed542e0cacb7ec1e6836a9c7697', '73933ad8fae31cf99aa0240b042185b27cff84cf9fccfdf7666331e2f10094b6'
];

function isActivated() {
  try {
    return localStorage.getItem('fb_activated') === 'true';
  } catch(e) { return false; }
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function activateCode(code) {
  const hash = await sha256(code.trim());
  if (VALID_HASHES.includes(hash)) {
    try {
      localStorage.setItem('fb_activated', 'true');
      localStorage.setItem('fb_code', code.trim());
    } catch(e) {}
    return true;
  }
  return false;
}

function updateActivationUI() {
  const badge = document.getElementById('activationBadge');
  if (!badge) return;
  if (isActivated()) {
    badge.style.display = 'inline-block';
    badge.textContent = '✓ 已激活 · 终身使用';
    badge.style.cssText = 'display:inline-block;padding:6px 14px;background:#D1FAE5;color:#065F46;border-radius:20px;font-size:13px;font-weight:500;';
    const banner = document.querySelector('.preview-banner');
    if (banner) banner.style.display = 'none';
    const btn = document.getElementById('btnDownload');
    if (btn) { btn.onclick = downloadWord; }
  } else {
    badge.style.display = 'inline-block';
    badge.textContent = '🔒 未激活 · ￥99 终身使用';
    badge.style.cssText = 'display:inline-block;padding:6px 14px;background:#FEF3C7;color:#92400E;border-radius:20px;font-size:13px;font-weight:500;';
  }
}

// ==================== PAYMENT ====================
function showPayment() {
  if (isActivated()) {
    // Already activated, download directly
    downloadWord();
    return;
  }
  document.getElementById('paymentModal').classList.remove('hidden');
  document.getElementById('orderNo').textContent = 'LV' + Date.now().toString(36).toUpperCase();
  document.getElementById('step3').classList.add('active');
  document.getElementById('activationMsg').textContent = '';
  document.getElementById('activationCode').value = '';
  // Reset activation input
  document.getElementById('activationCode').value = '';
  document.getElementById('activationMsg').textContent = '';
}

async function handleActivation() {
  const code = document.getElementById('activationCode').value;
  const msg = document.getElementById('activationMsg');
  if (!code.trim()) { msg.innerHTML = '<span style="color:#EF4444;">请输入激活码</span>'; return; }
  msg.innerHTML = '<span style="color:#3B82F6;">验证中...</span>';
  const ok = await activateCode(code);
  if (ok) {
    msg.innerHTML = '<span style="color:#16A34A;">激活成功！点击下方按钮下载文书</span>';
    updateActivationUI();
    setTimeout(() => { closePayment(); downloadWord(); }, 1000);
  } else {
    msg.innerHTML = '<span style="color:#EF4444;">激活码无效，请检查后重试</span>';
  }
}

function closePayment() {
  document.getElementById('paymentModal').classList.add('hidden');
  clearInterval(window.payInterval);
  document.getElementById('step3').classList.remove('active');
}

let secondsLeft = 300;
function startPayTimer() {
  secondsLeft = 300;
  const el = document.getElementById('payTimer');
  clearInterval(window.payInterval);
  window.payInterval = setInterval(() => {
    secondsLeft--;
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    el.textContent = `请在 ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} 内完成支付`;
    if (secondsLeft <= 0) {
      clearInterval(window.payInterval);
      el.textContent = '支付已超时，请重新发起';
      el.style.color = 'var(--error)';
    }
  }, 1000);
}

function simulatePayment() {
  clearInterval(window.payInterval);
  document.getElementById('paymentModal').classList.add('hidden');
  showPage('page-success');
  resetSteps();
  ['step1','step2','step3','step4'].forEach(id => document.getElementById(id).classList.add('done'));
  document.getElementById('step4').classList.add('active');
  const btnDl = document.getElementById('btnDownload');
  if (btnDl) btnDl.onclick = downloadWord;
  window.scrollTo(0, 0);
}

// ==================== DOWNLOAD ====================
async function downloadWord() {
  if (typeof _hmt !== 'undefined' && selectedDoc) { _hmt.push(['_trackEvent', '下载文书', selectedDoc.title, '', 1]); }
  const title = selectedDoc ? selectedDoc.title : '法律文书';
  const previewEl = document.getElementById('a4Preview');
  const clone = previewEl.cloneNode(true);
  clone.querySelectorAll('.fill-placeholder').forEach(span => {
    span.replaceWith(document.createTextNode(span.textContent));
  });

  if (typeof docx === 'undefined') {
    // Fallback: download as HTML if docx lib not loaded
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title><style>:root{--g1:#4F46E5;--g2:#3B82F6;--g3:#06B6D4;--accent1:#8B5CF6;--accent2:#10B981;--accent3:#F59E0B;--primary:#4F46E5;--primary-hover:#4338CA;--bg:#F8FAFC;--card:#FFFFFF;--border:#E5E7EB;--success:#10B981;--error:#EF4444;--text:#0F172A;--t2:#334155;--t3:#64748B;--r:18px;--rs:14px;--shadow:0 4px 20px rgba(79,70,229,.08);--shadow-lg:0 20px 60px rgba(79,70,229,.1);--shadow-sm:0 1px 3px rgba(0,0,0,.04);--font:'Inter','PingFang SC','Microsoft YaHei',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:var(--font);color:var(--text);background:var(--bg);line-height:1.6;-webkit-font-smoothing:antialiased;min-height:100vh;overflow-x:hidden}.container{max-width:1280px;margin:0 auto;padding:0 80px}.page{display:none}.page.active{display:block;animation:fadeIn .6s ease}@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* Logo */
.logo{font-size:32px;font-weight:700;background:linear-gradient(135deg,var(--g1),var(--g2),var(--g3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-1px;display:inline-block}

/* Hero */
.hero{padding:120px 0 60px;text-align:center;position:relative}
.hero::before{content:'';position:absolute;top:-200px;right:-100px;width:600px;height:600px;background:radial-gradient(circle,rgba(79,70,229,.06)0,transparent 70%);pointer-events:none}
.hero::after{content:'';position:absolute;bottom:-100px;left:-150px;width:500px;height:500px;background:radial-gradient(circle,rgba(6,182,212,.05)0,transparent 70%);pointer-events:none}
.hero h1{font-size:56px;font-weight:700;color:var(--text);letter-spacing:-1.5px;line-height:1.15;margin-bottom:20px;position:relative;z-index:1}
.hero h1 span{background:linear-gradient(135deg,var(--g1),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:18px;color:var(--t3);margin-bottom:40px;position:relative;z-index:1}
.hero-btns{display:flex;gap:16px;justify-content:center;position:relative;z-index:1}

/* Buttons */
.btn-primary{padding:14px 32px;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;border:none;border-radius:var(--rs);font-size:16px;font-weight:500;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(79,70,229,.2)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(79,70,229,.3);background:linear-gradient(135deg,var(--primary-hover),var(--g2))}
.btn-outline{padding:14px 32px;background:#fff;color:var(--text);border:1px solid var(--border);border-radius:var(--rs);font-size:16px;font-weight:500;cursor:pointer;transition:all .2s}
.btn-outline:hover{background:#F9FAFB;border-color:#CBD5E1}

/* Hero visual */
.hero-visual{margin:60px auto 0;max-width:640px;display:flex;gap:12px;justify-content:center;position:relative;z-index:1}
.hero-card{background:rgba(255,255,255,.75);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(79,70,229,.1);border-radius:var(--r);padding:20px 24px;box-shadow:var(--shadow-sm);flex:1;max-width:200px;transition:all .2s}
.hero-card:hover{transform:translateY(-2px);box-shadow:var(--shadow);border-color:rgba(79,70,229,.2)}
.hero-card .num{font-size:32px;font-weight:700;background:linear-gradient(135deg,var(--g1),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-card .label{font-size:13px;color:var(--t3);margin-top:4px}

/* Section */
.section-head{text-align:center;padding:80px 0 48px}
.section-head h2{font-size:36px;font-weight:500;color:var(--text);letter-spacing:-1px;margin-bottom:12px}
.section-head p{font-size:16px;color:var(--t3)}

/* Doc grid */
.doc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;max-width:900px;margin:0 auto 80px}
.doc-card{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:32px 24px;cursor:pointer;transition:all .25s;user-select:none;box-shadow:var(--shadow-sm);text-align:center;position:relative;overflow:hidden;width:auto;height:auto}
.doc-card::before{content:'';position:absolute;top:0;left:0;right:0;height:0;background:linear-gradient(90deg,var(--g1),var(--g2),var(--g3));transition:height .25s;opacity:0}
.doc-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg);border-color:rgba(79,70,229,.2)}
.doc-card:hover::before{height:3px;opacity:1}
.doc-card.selected{border-color:var(--primary);box-shadow:0 0 0 3px rgba(79,70,229,.1)}
.doc-card.selected::before{height:3px;opacity:1}
.doc-card .num{font-size:28px;font-weight:700;color:var(--primary);margin-bottom:12px;opacity:.5}
.doc-card .title{font-size:17px;font-weight:700;color:var(--text);margin-bottom:4px}
.doc-card .desc{font-size:13px;color:var(--t3);font-weight:400}

/* Trust */
.trust-bar{display:flex;justify-content:center;gap:64px;padding:40px 0 80px;border-top:1px solid var(--border)}
.trust-item{text-align:center}.trust-item .num{font-size:28px;font-weight:700;color:var(--text)}.trust-item .label{font-size:14px;color:var(--t3);margin-top:4px}

/* Footer */
.footer{background:#F1F5F9;padding:40px 0;text-align:center;margin-top:80px}
.footer p{font-size:13px;color:var(--t3);line-height:2}
.footer-links{display:flex;justify-content:center;gap:32px;margin-bottom:12px}
.footer-links a{color:var(--t3);text-decoration:none;font-size:13px}
.footer-links a:hover{color:var(--text)}

/* Form */
.form-header{display:flex;align-items:center;padding:16px 24px;gap:12px;background:var(--card);border-bottom:1px solid var(--border)}
.form-header .back{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--card);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--text);transition:all .2s}
.form-header .back:hover{background:#F1F5F9}.form-header .title{font-size:17px;font-weight:600}
.steps{display:flex;padding:16px;justify-content:center}
.step{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--t3);position:relative}
.step::after{content:'—';margin:0 8px;color:var(--border)}.step:last-child::after{display:none}
.step .num{width:24px;height:24px;border-radius:50%;background:#E5E7EB;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600}
.step.active .num{background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff}.step.active{color:var(--primary);font-weight:600}
.step.done .num{background:var(--success);color:#fff}
.form-body{padding:16px 16px 120px}.form-group{margin-bottom:18px}
.form-label{display:block;font-size:14px;font-weight:500;color:var(--text);margin-bottom:6px}
.form-label .required{color:var(--error);margin-left:2px}
.form-input,.form-select,.form-textarea{width:100%;height:52px;padding:0 14px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:16px;font-family:var(--font);color:var(--text);background:var(--card);transition:border-color .2s,box-shadow .2s;outline:none;-webkit-appearance:none}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(79,70,229,.08)}
.form-input.error,.form-textarea.error{border-color:var(--error)}
.form-hint{font-size:12px;color:var(--error);margin-top:4px;display:none}
.form-input.error+.form-hint{display:block}.form-textarea{height:120px;padding:12px 14px;resize:vertical}
.form-bottom-bar{position:sticky;bottom:0;background:var(--card);border-top:1px solid var(--border);padding:12px 16px 40px}

/* Preview */
.preview-bg{background:#E5E7EB;min-height:100vh;padding:16px 0 40px}.preview-header{display:flex;align-items:center;padding:12px 16px;gap:12px}.preview-header .back{cursor:pointer;font-size:18px;color:var(--text)}
.a4-paper h3{text-align:center;font-size:18pt;font-weight:700;margin-bottom:24pt}.a4-paper{background:#fff;margin:0 12px;padding:32px 24px;box-shadow:var(--shadow);border-radius:4px;font-size:15px;line-height:2;min-height:600px;user-select:none;-webkit-user-select:none;position:relative;overflow:hidden}
.a4-watermark{position:absolute;inset:0;pointer-events:none;z-index:1;background:repeating-linear-gradient(-30deg,transparent,transparent 80px,rgba(0,0,0,.03)80px,rgba(0,0,0,.03)82px)}
.a4-watermark::after{content:'预览版 · 付费后下载完整Word';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)rotate(-25deg);font-size:40px;color:rgba(0,0,0,.06);white-space:nowrap;font-weight:700;letter-spacing:4px}
.preview-banner{background:#FEF3C7;border:1px solid var(--accent3);border-radius:8px;padding:10px 16px;margin:0 12px 12px;text-align:center;font-size:13px;color:#92400E;display:flex;align-items:center;justify-content:center;gap:8px}
.preview-actions{display:flex;gap:12px;padding:20px 16px}

/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}.modal-overlay.hidden{display:none}
.modal-card{background:var(--card);border-radius:var(--r);padding:32px 24px;width:100%;max-width:360px;text-align:center;box-shadow:var(--shadow-lg)}
.modal-card .price{font-size:36px;font-weight:700;background:linear-gradient(135deg,var(--g1),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin:8px 0 4px}
.modal-card .price-label{font-size:14px;color:var(--t3)}.modal-card .qr-box{width:180px;height:180px;background:#F1F5F9;margin:20px auto;border-radius:var(--rs);display:flex;align-items:center;justify-content:center}
.modal-card .order-no{font-size:13px;color:var(--t3);margin:8px 0 12px}.modal-card .timer{font-size:14px;color:var(--accent3);font-weight:500}
.modal-card .modal-btns{display:flex;gap:12px;margin-top:20px}

/* Success */
.success-page{text-align:center;padding:80px 24px}.success-icon{width:72px;height:72px;border-radius:50%;background:rgba(16,185,129,.12);margin:0 auto 24px;display:flex;align-items:center;justify-content:center;font-size:36px;color:var(--success)}.success-page h2{font-size:22px;margin-bottom:8px}.success-page .sub{color:var(--t3);font-size:14px;margin-bottom:32px}
.btn-download{display:block;width:100%;max-width:320px;margin:0 auto 12px;height:52px;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;border:none;border-radius:var(--rs);font-size:16px;font-weight:500;cursor:pointer;transition:all .2s}
.btn-download:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(79,70,229,.3)}
.btn-secondary{display:block;width:100%;max-width:320px;margin:0 auto;height:48px;background:var(--card);color:var(--primary);border:1.5px solid var(--primary);border-radius:var(--rs);font-size:15px;cursor:pointer;transition:all .2s}.btn-secondary:hover{background:#EEF2FF}

.security-badge{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--t3);padding:10px 0;justify-content:center}
.disclaimer-bar{display:flex;align-items:flex-start;gap:8px;padding:12px 0;font-size:12px;color:var(--t3)}.disclaimer-bar input{margin-top:2px;width:16px;height:16px;accent-color:var(--primary)}
.why-section{display:none}.trust-section{display:none}

@media(max-width:1024px){.container{padding:0 40px}.doc-grid{grid-template-columns:repeat(2,1fr)}.hero h1{font-size:40px}}
@media(max-width:640px){.container{padding:0 20px}.doc-grid{grid-template-columns:repeat(2,1fr);gap:12px}.hero{padding:80px 0 40px}.hero h1{font-size:32px}.hero p{font-size:15px}.hero-visual{flex-wrap:wrap}.hero-card{max-width:140px}.trust-bar{gap:32px}}
@media(min-width:768px){.a4-paper h3{text-align:center;font-size:18pt;font-weight:700;margin-bottom:24pt}.a4-paper{max-width:640px;margin:0 auto}}</style></head><body>${clone.innerHTML}</body></html>`;
    const blob = new Blob(['﻿' + html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = title + '.html';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }

  const { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } = docx;
  const children = [];

  function paraToDocx(el) {
    const nodeName = el.nodeName.toLowerCase();
    if (nodeName === 'h3') {
      children.push(new Paragraph({
        children: [new TextRun({ text: el.textContent, bold: true, size: 36, font: { name: 'SimHei' } })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }));
    } else if (nodeName === 'p') {
      const runs = [];
      const isStrong = el.querySelector('strong');
      if (isStrong) {
        let text = '';
        el.childNodes.forEach(c => {
          if (c.nodeType === 3) text += c.textContent;
          else if (c.nodeName === 'STRONG') {
            if (text) { runs.push(new TextRun({ text, size: 30, font: { name: 'SimSun' } })); text = ''; }
            runs.push(new TextRun({ text: c.textContent, bold: true, size: 30, font: { name: 'SimHei' } }));
          } else if (c.nodeName === 'SPAN') {
            text += c.textContent;
          }
        });
        if (text) runs.push(new TextRun({ text, size: 30, font: { name: 'SimSun' } }));
      } else {
        runs.push(new TextRun({ text: el.textContent, size: 30, font: { name: 'SimSun' } }));
      }
      const style = el.getAttribute('style') || '';
      const isRight = style.indexOf('text-align:right') !== -1;
      children.push(new Paragraph({
        children: runs,
        alignment: isRight ? AlignmentType.RIGHT : undefined,
        indent: isRight ? undefined : { firstLine: 600 },
        spacing: { after: 80 },
      }));
    }
  }

  clone.childNodes.forEach(el => { if (el.nodeType === 1) paraToDocx(el); });

  const doc = new Document({
    sections: [{
      properties: {
        page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, bottom: 1440, left: 1800, right: 1800 } }
      },
      children: children.length > 0 ? children : [new Paragraph({ children: [new TextRun({ text: '生成中...', size: 30 })] })],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = title + '.docx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function openPrintable() {
  const title = selectedDoc ? selectedDoc.title : '法律文书';
  const previewEl = document.getElementById('a4Preview');
  const clone = previewEl.cloneNode(true);
  clone.querySelectorAll('.fill-placeholder').forEach(span => {
    span.replaceWith(document.createTextNode(span.textContent));
  });
  const cleanBody = clone.innerHTML;
  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>:root{--g1:#4F46E5;--g2:#3B82F6;--g3:#06B6D4;--accent1:#8B5CF6;--accent2:#10B981;--accent3:#F59E0B;--primary:#4F46E5;--primary-hover:#4338CA;--bg:#F8FAFC;--card:#FFFFFF;--border:#E5E7EB;--success:#10B981;--error:#EF4444;--text:#0F172A;--t2:#334155;--t3:#64748B;--r:18px;--rs:14px;--shadow:0 4px 20px rgba(79,70,229,.08);--shadow-lg:0 20px 60px rgba(79,70,229,.1);--shadow-sm:0 1px 3px rgba(0,0,0,.04);--font:'Inter','PingFang SC','Microsoft YaHei',-apple-system,sans-serif}*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:var(--font);color:var(--text);background:var(--bg);line-height:1.6;-webkit-font-smoothing:antialiased;min-height:100vh;overflow-x:hidden}.container{max-width:1280px;margin:0 auto;padding:0 80px}.page{display:none}.page.active{display:block;animation:fadeIn .6s ease}@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* Logo */
.logo{font-size:32px;font-weight:700;background:linear-gradient(135deg,var(--g1),var(--g2),var(--g3));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;letter-spacing:-1px;display:inline-block}

/* Hero */
.hero{padding:120px 0 60px;text-align:center;position:relative}
.hero::before{content:'';position:absolute;top:-200px;right:-100px;width:600px;height:600px;background:radial-gradient(circle,rgba(79,70,229,.06)0,transparent 70%);pointer-events:none}
.hero::after{content:'';position:absolute;bottom:-100px;left:-150px;width:500px;height:500px;background:radial-gradient(circle,rgba(6,182,212,.05)0,transparent 70%);pointer-events:none}
.hero h1{font-size:56px;font-weight:700;color:var(--text);letter-spacing:-1.5px;line-height:1.15;margin-bottom:20px;position:relative;z-index:1}
.hero h1 span{background:linear-gradient(135deg,var(--g1),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero p{font-size:18px;color:var(--t3);margin-bottom:40px;position:relative;z-index:1}
.hero-btns{display:flex;gap:16px;justify-content:center;position:relative;z-index:1}

/* Buttons */
.btn-primary{padding:14px 32px;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;border:none;border-radius:var(--rs);font-size:16px;font-weight:500;cursor:pointer;transition:all .25s;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(79,70,229,.2)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(79,70,229,.3);background:linear-gradient(135deg,var(--primary-hover),var(--g2))}
.btn-outline{padding:14px 32px;background:#fff;color:var(--text);border:1px solid var(--border);border-radius:var(--rs);font-size:16px;font-weight:500;cursor:pointer;transition:all .2s}
.btn-outline:hover{background:#F9FAFB;border-color:#CBD5E1}

/* Hero visual */
.hero-visual{margin:60px auto 0;max-width:640px;display:flex;gap:12px;justify-content:center;position:relative;z-index:1}
.hero-card{background:rgba(255,255,255,.75);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(79,70,229,.1);border-radius:var(--r);padding:20px 24px;box-shadow:var(--shadow-sm);flex:1;max-width:200px;transition:all .2s}
.hero-card:hover{transform:translateY(-2px);box-shadow:var(--shadow);border-color:rgba(79,70,229,.2)}
.hero-card .num{font-size:32px;font-weight:700;background:linear-gradient(135deg,var(--g1),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-card .label{font-size:13px;color:var(--t3);margin-top:4px}

/* Section */
.section-head{text-align:center;padding:80px 0 48px}
.section-head h2{font-size:36px;font-weight:500;color:var(--text);letter-spacing:-1px;margin-bottom:12px}
.section-head p{font-size:16px;color:var(--t3)}

/* Doc grid */
.doc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;max-width:900px;margin:0 auto 80px}
.doc-card{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:32px 24px;cursor:pointer;transition:all .25s;user-select:none;box-shadow:var(--shadow-sm);text-align:center;position:relative;overflow:hidden;width:auto;height:auto}
.doc-card::before{content:'';position:absolute;top:0;left:0;right:0;height:0;background:linear-gradient(90deg,var(--g1),var(--g2),var(--g3));transition:height .25s;opacity:0}
.doc-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg);border-color:rgba(79,70,229,.2)}
.doc-card:hover::before{height:3px;opacity:1}
.doc-card.selected{border-color:var(--primary);box-shadow:0 0 0 3px rgba(79,70,229,.1)}
.doc-card.selected::before{height:3px;opacity:1}
.doc-card .num{font-size:28px;font-weight:700;color:var(--primary);margin-bottom:12px;opacity:.5}
.doc-card .title{font-size:17px;font-weight:700;color:var(--text);margin-bottom:4px}
.doc-card .desc{font-size:13px;color:var(--t3);font-weight:400}

/* Trust */
.trust-bar{display:flex;justify-content:center;gap:64px;padding:40px 0 80px;border-top:1px solid var(--border)}
.trust-item{text-align:center}.trust-item .num{font-size:28px;font-weight:700;color:var(--text)}.trust-item .label{font-size:14px;color:var(--t3);margin-top:4px}

/* Footer */
.footer{background:#F1F5F9;padding:40px 0;text-align:center;margin-top:80px}
.footer p{font-size:13px;color:var(--t3);line-height:2}
.footer-links{display:flex;justify-content:center;gap:32px;margin-bottom:12px}
.footer-links a{color:var(--t3);text-decoration:none;font-size:13px}
.footer-links a:hover{color:var(--text)}

/* Form */
.form-header{display:flex;align-items:center;padding:16px 24px;gap:12px;background:var(--card);border-bottom:1px solid var(--border)}
.form-header .back{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--card);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;color:var(--text);transition:all .2s}
.form-header .back:hover{background:#F1F5F9}.form-header .title{font-size:17px;font-weight:600}
.steps{display:flex;padding:16px;justify-content:center}
.step{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--t3);position:relative}
.step::after{content:'—';margin:0 8px;color:var(--border)}.step:last-child::after{display:none}
.step .num{width:24px;height:24px;border-radius:50%;background:#E5E7EB;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600}
.step.active .num{background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff}.step.active{color:var(--primary);font-weight:600}
.step.done .num{background:var(--success);color:#fff}
.form-body{padding:16px 16px 120px}.form-group{margin-bottom:18px}
.form-label{display:block;font-size:14px;font-weight:500;color:var(--text);margin-bottom:6px}
.form-label .required{color:var(--error);margin-left:2px}
.form-input,.form-select,.form-textarea{width:100%;height:52px;padding:0 14px;border:1.5px solid var(--border);border-radius:var(--rs);font-size:16px;font-family:var(--font);color:var(--text);background:var(--card);transition:border-color .2s,box-shadow .2s;outline:none;-webkit-appearance:none}
.form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(79,70,229,.08)}
.form-input.error,.form-textarea.error{border-color:var(--error)}
.form-hint{font-size:12px;color:var(--error);margin-top:4px;display:none}
.form-input.error+.form-hint{display:block}.form-textarea{height:120px;padding:12px 14px;resize:vertical}
.form-bottom-bar{position:sticky;bottom:0;background:var(--card);border-top:1px solid var(--border);padding:12px 16px 40px}

/* Preview */
.preview-bg{background:#E5E7EB;min-height:100vh;padding:16px 0 40px}.preview-header{display:flex;align-items:center;padding:12px 16px;gap:12px}.preview-header .back{cursor:pointer;font-size:18px;color:var(--text)}
.a4-paper h3{text-align:center;font-size:18pt;font-weight:700;margin-bottom:24pt}.a4-paper{background:#fff;margin:0 12px;padding:32px 24px;box-shadow:var(--shadow);border-radius:4px;font-size:15px;line-height:2;min-height:600px;user-select:none;-webkit-user-select:none;position:relative;overflow:hidden}
.a4-watermark{position:absolute;inset:0;pointer-events:none;z-index:1;background:repeating-linear-gradient(-30deg,transparent,transparent 80px,rgba(0,0,0,.03)80px,rgba(0,0,0,.03)82px)}
.a4-watermark::after{content:'预览版 · 付费后下载完整Word';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)rotate(-25deg);font-size:40px;color:rgba(0,0,0,.06);white-space:nowrap;font-weight:700;letter-spacing:4px}
.preview-banner{background:#FEF3C7;border:1px solid var(--accent3);border-radius:8px;padding:10px 16px;margin:0 12px 12px;text-align:center;font-size:13px;color:#92400E;display:flex;align-items:center;justify-content:center;gap:8px}
.preview-actions{display:flex;gap:12px;padding:20px 16px}

/* Modal */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}.modal-overlay.hidden{display:none}
.modal-card{background:var(--card);border-radius:var(--r);padding:32px 24px;width:100%;max-width:360px;text-align:center;box-shadow:var(--shadow-lg)}
.modal-card .price{font-size:36px;font-weight:700;background:linear-gradient(135deg,var(--g1),var(--g2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin:8px 0 4px}
.modal-card .price-label{font-size:14px;color:var(--t3)}.modal-card .qr-box{width:180px;height:180px;background:#F1F5F9;margin:20px auto;border-radius:var(--rs);display:flex;align-items:center;justify-content:center}
.modal-card .order-no{font-size:13px;color:var(--t3);margin:8px 0 12px}.modal-card .timer{font-size:14px;color:var(--accent3);font-weight:500}
.modal-card .modal-btns{display:flex;gap:12px;margin-top:20px}

/* Success */
.success-page{text-align:center;padding:80px 24px}.success-icon{width:72px;height:72px;border-radius:50%;background:rgba(16,185,129,.12);margin:0 auto 24px;display:flex;align-items:center;justify-content:center;font-size:36px;color:var(--success)}.success-page h2{font-size:22px;margin-bottom:8px}.success-page .sub{color:var(--t3);font-size:14px;margin-bottom:32px}
.btn-download{display:block;width:100%;max-width:320px;margin:0 auto 12px;height:52px;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;border:none;border-radius:var(--rs);font-size:16px;font-weight:500;cursor:pointer;transition:all .2s}
.btn-download:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(79,70,229,.3)}
.btn-secondary{display:block;width:100%;max-width:320px;margin:0 auto;height:48px;background:var(--card);color:var(--primary);border:1.5px solid var(--primary);border-radius:var(--rs);font-size:15px;cursor:pointer;transition:all .2s}.btn-secondary:hover{background:#EEF2FF}

.security-badge{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--t3);padding:10px 0;justify-content:center}
.disclaimer-bar{display:flex;align-items:flex-start;gap:8px;padding:12px 0;font-size:12px;color:var(--t3)}.disclaimer-bar input{margin-top:2px;width:16px;height:16px;accent-color:var(--primary)}
.why-section{display:none}.trust-section{display:none}

@media(max-width:1024px){.container{padding:0 40px}.doc-grid{grid-template-columns:repeat(2,1fr)}.hero h1{font-size:40px}}
@media(max-width:640px){.container{padding:0 20px}.doc-grid{grid-template-columns:repeat(2,1fr);gap:12px}.hero{padding:80px 0 40px}.hero h1{font-size:32px}.hero p{font-size:15px}.hero-visual{flex-wrap:wrap}.hero-card{max-width:140px}.trust-bar{gap:32px}}
@media(min-width:768px){.a4-paper h3{text-align:center;font-size:18pt;font-weight:700;margin-bottom:24pt}.a4-paper{max-width:640px;margin:0 auto}}</style>
</head>
<body>
<div class="print-bar">📄 ${title} <button onclick="window.print()">打印 / 另存为PDF</button></div>
${cleanBody}
</body>
</html>`;
  const blob = new Blob(['﻿' + htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, '_blank');
  if (!w) { alert('请允许弹出窗口以预览文档'); }
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ==================== NAVIGATION ====================
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function goHome() {
  showPage('page-home');
  window.scrollTo(0, 0);
}

function goBackToForm() {
  showPage('page-form');
  document.getElementById('step2').classList.remove('active');
  window.scrollTo(0, 0);
}

function resetAndGoHome() {
  selectedDoc = null;
  currentFormData = {};
  document.querySelectorAll('.doc-card').forEach(c => c.classList.remove('selected'));
  selectedDoc = null;
  showPage('page-home');
  window.scrollTo(0, 0);
}

function resetSteps() {
  ['step1','step2','step3','step4'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.remove('active', 'done');
  });
}

// ==================== START ====================
init();
updateActivationUI();


function numberToCNY(num) {
  if (!num || num === '' || isNaN(num)) return '';
  const digits = ['零','壹','贰','叁','肆','伍','陆','柒','捌','玖'];
  const units = ['','拾','佰','仟'];
  const bigUnits = ['','万','亿'];
  const n = Math.round(parseFloat(num) * 100) / 100;
  if (n === 0) return '零元整';
  const parts = n.toString().split('.');
  let intPart = parts[0];
  const decPart = parts[1] || '';
  let result = '';
  let groupIndex = 0;
  while (intPart.length > 0) {
    const group = intPart.slice(-4);
    intPart = intPart.slice(0, -4);
    let groupStr = '';
    let hasNonZero = false;
    for (let i = 0; i < group.length; i++) {
      const d = parseInt(group[group.length - 1 - i]);
      if (d !== 0) { hasNonZero = true; groupStr = digits[d] + units[i] + groupStr; }
      else if (groupStr && groupStr[0] !== '零') { groupStr = '零' + groupStr; }
    }
    if (hasNonZero) { result = groupStr + bigUnits[groupIndex] + result; }
    else if (result && result[0] !== '零') { result = '零' + result; }
    groupIndex++;
  }
  result += '元';
  if (decPart && decPart.length > 0) {
    const jiao = parseInt(decPart[0] || '0'), fen = parseInt(decPart[1] || '0');
    if (jiao > 0) result += digits[jiao] + '角';
    if (fen > 0) result += digits[fen] + '分';
    if (jiao === 0 && fen === 0) result += '整';
  } else { result += '整'; }
  return result;
}

function fmtDate(d) { if (!d) return ''; const parts = d.split('-'); if (parts.length !== 3) return d; return parseInt(parts[0]) + '年' + parseInt(parts[1]) + '月' + parseInt(parts[2]) + '日'; }
function toCN(n) { const cn = ['零','一','二','三','四','五','六','七','八','九','十']; return n <= 10 ? cn[n] : String(n); }




