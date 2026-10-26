// Index of Chinese Marxism — shared code: header/footer, theme, data, bookmarks, article popup.

export const CATS = [
  null,
  { num: 1, en: 'Basic Principles of Marxism', zh: '马克思主义基本原理' },
  { num: 2, en: 'History of Marxism', zh: '马克思主义发展史' },
  { num: 3, en: 'Adapting Marxism to China and Our Times', zh: '马克思主义中国化时代化' },
  { num: 4, en: 'Foreign Marxism', zh: '国外马克思主义' },
  { num: 5, en: 'Ideological and Political Education', zh: '思想政治教育' },
  { num: 6, en: 'Modern Chinese History and Contemporary China', zh: '中国近现代史基本问题与当代中国' },
  { num: 7, en: 'Scientific Socialism and the International Communist Movement', zh: '科学社会主义与国际共产主义运动' },
  { num: 8, en: 'CPC History and Party Building', zh: '中共党史与党建' },
  { num: 9, en: 'Discipline Inspection, Supervision and Anti-Corruption Studies', zh: '纪检监察学和廉政学' },
  { num: 10, en: 'Science and Atheism', zh: '科学与无神论' },
  { num: 11, en: 'China Studies', zh: '中国学' },
  { num: 12, en: 'Interdisciplinary Studies', zh: '综合研究' },
];
const ZH_NUM = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
export const pad = (n) => String(n).padStart(2, '0');
export const zhNum = (n) => ZH_NUM[n] || '';
export const TYPES = { 'research article': 'Research article', commentary: 'Commentary', 'literature review': 'Literature review', 'conference report': 'Conference report', interview: 'Interview', speech: 'Speech', 'book review': 'Book review', other: 'Other' };

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const ICON = {
  x: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  mark: (on) => `<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5"><path d="M6 3h12v18l-6-5-6 5z"/></svg>`,
  left: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M20 12H4M11 5l-7 7 7 7"/></svg>',
  right: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square"><path d="M4 12h16M13 5l7 7-7 7"/></svg>',
  out: '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  theme: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/></svg>',
};
export { ICON };

/* ---------------- storage (never required: everything works without it) ---------------- */
function lsGet(k, fallback) { try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v); } catch (e) { return fallback; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode etc. */ } }

/* ---------------- theme ---------------- */
function isDark() { return document.documentElement.dataset.theme === 'dark'; }
function setTheme(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  try { localStorage.setItem('icm-theme', dark ? 'dark' : 'light'); } catch (e) {}
  const b = document.querySelector('.nav .theme');
  if (b) { b.setAttribute('aria-pressed', String(dark)); b.querySelector('.theme-label').textContent = dark ? 'Light' : 'Dark'; }
}

/* ---------------- header + footer ---------------- */
export function chrome(current, { footer = true } = {}) {
  const link = (href, label) => `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`;
  const header = document.createElement('header');
  header.className = 'nav';
  header.innerHTML = `<a class="logo" href="index.html"${current === 'index.html' ? ' aria-current="page"' : ''}>ICM <span lang="zh">索引</span></a><div class="sp"></div>`
    + link('browse.html', 'Browse') + link('search.html', 'Search') + link('saved.html', 'Saved') + link('about.html', 'About')
    + `<button type="button" class="theme" aria-pressed="${isDark()}" aria-label="Dark mode">${ICON.theme}<span class="theme-label">${isDark() ? 'Light' : 'Dark'}</span></button>`;
  document.body.prepend(header);
  header.querySelector('.theme').addEventListener('click', () => setTheme(!isDark()));
  slideAway(header);
  if (!footer) return;
  const foot = document.createElement('footer');
  foot.className = 'foot';
  foot.innerHTML = '<p><b>Unofficial index</b> · not affiliated with CASS · summaries are machine-generated and may contain errors</p><a href="about.html">About this project →</a>';
  document.body.append(foot);
}

// the header stays at the top of the screen, but slides out of the way while you scroll down
// and comes back as soon as you scroll up a little
function slideAway(header) {
  let lastY = window.scrollY, ticking = false;
  const update = () => {
    ticking = false;
    const y = Math.max(0, window.scrollY), d = y - lastY;
    if (Math.abs(d) < 6) return;
    header.classList.toggle('nav-away', d > 0 && y > header.offsetHeight);
    lastY = y;
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('nav-away'));
}

/* ---------------- data ---------------- */
let _index, _byId;
export async function loadIndex() {
  if (!_index) {
    _index = fetch('data/index.json', { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error('index ' + r.status); return r.json(); });
    _index.then((rows) => { _byId = new Map(rows.map((r, i) => [r.id, Object.assign(r, { i })])); });
  }
  await _index;
  return _index;
}
export function byId(id) { return _byId && _byId.get(String(id)); }
const _cats = {};
export function loadCat(n) {
  if (!_cats[n]) _cats[n] = fetch(`data/cat/${pad(n)}.json`, { cache: 'no-cache' }).then((r) => r.json()).then((rows) => new Map(rows.map((x) => [x.id, x])));
  return _cats[n];
}
export async function loadArticle(id) {
  await loadIndex();
  const meta = byId(id);
  if (!meta) return null;
  return (await loadCat(meta.cat)).get(String(id)) || null;
}
export function fmtDate(d) { return d || ''; }

/* ---------------- bookmarks: { items:[{id, folder, at}], folders:[{id, name}] } ---------------- */
const SKEY = 'icm-saved';
export const saved = {
  get() { const s = lsGet(SKEY, null); return s && Array.isArray(s.items) ? s : { items: [], folders: [] }; },
  set(s) { lsSet(SKEY, s); document.dispatchEvent(new CustomEvent('icm:saved')); },
  has(id) { return this.get().items.some((x) => x.id === String(id)); },
  toggle(id) {
    const s = this.get(); id = String(id);
    const i = s.items.findIndex((x) => x.id === id);
    if (i >= 0) s.items.splice(i, 1); else s.items.unshift({ id, folder: '', at: new Date().toISOString().slice(0, 10) });
    this.set(s); return i < 0;
  },
};

/* ---------------- article popup ---------------- */
let popState = null; // { ids, pos, label }

function cleanTerm(en) { return String(en || '').replace(/^(the|a|an)\s+/i, '').trim(); }

// split each paragraph into text and glossary-term pieces (first occurrence of each term only)
function linkTerms(paras, glossary) {
  const used = new Set();
  return paras.map((txt) => {
    let segs = [{ t: txt }];
    glossary.forEach((g, gi) => {
      const needle = cleanTerm(g.en).toLowerCase();
      if (!needle || used.has(gi)) return;
      const out = [];
      for (const sg of segs) {
        const at = sg.g != null || used.has(gi) ? -1 : sg.t.toLowerCase().indexOf(needle);
        if (at < 0) { out.push(sg); continue; }
        used.add(gi);
        if (at > 0) out.push({ t: sg.t.slice(0, at) });
        out.push({ t: sg.t.substr(at, needle.length), g: gi });
        if (at + needle.length < sg.t.length) out.push({ t: sg.t.slice(at + needle.length) });
      }
      segs = out;
    });
    return segs;
  });
}

function glossPanel(g, pi) {
  return `<section class="gloss" id="gl-${pi}" aria-label="Glossary: ${esc(g.en)}">
    <div class="l"><span class="k">GLOSSARY</span><span class="z" lang="zh">${esc(g.zh)}</span><span class="py">${esc(g.pinyin)}</span></div>
    <div class="r"><span class="en">${esc(g.en)}</span><span class="def">${esc(g.explanation)}</span>
    ${g.literal ? `<span class="lit"><b>LITERALLY · </b>${esc(g.literal)}</span>` : ''}</div>
    <button type="button" class="fx" aria-label="Fold away">${ICON.x}</button></section>`;
}

function renderArticle(dlgMain, a) {
  const by = [a.authors.join(', ') ? `<b>${esc(a.authors.join(', '))}</b>` : '', esc((a.date || '').slice(0, 4)),
    esc(TYPES[a.type] || 'Article') + (a.isTrans ? ', in Chinese translation' : '')].filter(Boolean).join(' · ');
  const pieces = linkTerms(a.paras || [], a.glossary || []);
  const paras = pieces.map((segs, pi) => `<div class="para" data-p="${pi}"><p>${segs.map((sg) => sg.g == null ? esc(sg.t)
    : `<span class="term" role="button" tabindex="0" data-g="${sg.g}" aria-expanded="false" aria-controls="gl-${pi}">${esc(sg.t)}</span>`).join('')}</p></div>`);
  // the quote sits between the first and second paragraph of the summary
  const quote = a.quoteEn ? `<figure class="quote"><blockquote>“${esc(a.quoteEn)}”</blockquote><p lang="zh">${esc(a.quoteZh)}</p></figure>` : '';
  const on = saved.has(a.id);
  dlgMain.querySelector('.dlg-body').innerHTML = `
    <h2 id="pop-title">${esc(a.t)}</h2>
    <p class="zh-t" lang="zh">${esc(a.zh)}</p>
    <p class="by">${by}</p>
    <div class="sum-head"><span>Machine-generated summary · may contain errors · <a href="about.html">How it’s made</a></span></div>
    ${paras.slice(0, 1).join('')}${quote}${paras.slice(1).join('')}`;
  const bar = dlgMain.querySelector('.dlg-bar');
  bar.querySelector('.save').outerHTML = `<button type="button" class="btn icon save" aria-pressed="${on}" aria-label="${on ? 'Remove bookmark' : 'Bookmark this article'}" title="${on ? 'Remove bookmark' : 'Bookmark this article'}">${ICON.mark(on)}</button>`;
  bar.querySelector('.orig').href = a.url;
  dlgMain.querySelector('.dlg-note a').href = a.archive;
  // glossary fold-outs
  const toggleTerm = (b) => {
    const para = b.closest('.para'); const open = b.getAttribute('aria-expanded') === 'true';
    dlgMain.querySelectorAll('.gloss').forEach((x) => x.remove());
    dlgMain.querySelectorAll('.term').forEach((x) => x.setAttribute('aria-expanded', 'false'));
    if (open) return;
    b.setAttribute('aria-expanded', 'true');
    para.insertAdjacentHTML('beforeend', glossPanel(a.glossary[+b.dataset.g], para.dataset.p));
    const gl = para.querySelector('.gloss');
    gl.querySelector('.fx').addEventListener('click', () => { gl.remove(); b.setAttribute('aria-expanded', 'false'); b.focus(); });
    // the explanation opens under the paragraph: bring it into view (on a phone it is often off screen)
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => gl.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' }));
  };
  dlgMain.querySelectorAll('.term').forEach((b) => {
    b.addEventListener('click', () => toggleTerm(b));
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTerm(b); } });
  });
}

async function showCurrent() {
  const pop = document.querySelector('.pop');
  const id = popState.ids[popState.pos];
  await loadIndex();
  const meta = byId(id);
  const c = CATS[meta?.cat] || { num: 0, en: '', zh: '' };
  pop.querySelector('.spine').innerHTML = `<span class="num">${pad(c.num)}</span><span class="zn" lang="zh">${zhNum(c.num)}</span><span class="bar"></span><span class="vt" lang="zh">${esc(c.zh)}</span>`;
  pop.querySelector('.dlg-top p').innerHTML = `<span class="c">${esc(c.en)}</span><span class="meta">${esc(popState.label ? `${popState.label} · ${popState.pos + 1} of ${popState.ids.length}` : '')}</span>`;
  const body = pop.querySelector('.dlg-body');
  body.innerHTML = '<div class="dlg-loading"><span class="spinner" aria-hidden="true"></span><span>Taking it off the shelf…</span></div>';
  const a = await loadArticle(id);
  if (popState && popState.ids[popState.pos] === id) {
    if (a) renderArticle(pop.querySelector('.dlg-main'), a);
    else body.innerHTML = '<p>This article could not be found.</p>';
    body.scrollTop = 0;
    const u = new URL(location.href); u.searchParams.set('a', id); history.replaceState(null, '', u);
  }
}

export function openArticle(ids, pos = 0, label = '') {
  ids = ids.map(String);
  popState = { ids, pos, label, opener: document.activeElement };
  let pop = document.querySelector('.pop');
  if (!pop) {
    pop = document.createElement('div');
    pop.className = 'pop';
    pop.innerHTML = `<button type="button" class="backdrop" aria-label="Put back on the shelf"></button>
      <div class="dlg" role="dialog" aria-modal="true" aria-labelledby="pop-title">
        <div class="spine" aria-hidden="true"></div>
        <div class="dlg-main">
          <div class="dlg-top"><p></p><button type="button" class="x" aria-label="Close and put back on the shelf">${ICON.x}</button></div>
          <div class="dlg-body"></div>
          <div class="dlg-bar">
            <button type="button" class="btn prev" aria-label="Previous article">${ICON.left}<span class="lbl">Previous</span></button>
            <button type="button" class="btn next" aria-label="Next article"><span class="lbl">Next</span>${ICON.right}</button>
            <button type="button" class="btn icon save"></button>
            <span class="sp"></span>
            <a class="orig" href="#" target="_blank" rel="noopener"><span class="rt">Read the </span>original <span lang="zh">阅读原文</span>${ICON.out}</a>
          </div>
          <details class="dlg-note"><summary>Can’t open it?</summary><p>The original is on marxism.cass.cn, which may load slowly or not at all outside China. <a href="#" target="_blank" rel="noopener">Try the archived copy (Wayback Machine) ↗</a></p></details>
        </div>
      </div>`;
    document.body.append(pop);
    pop.querySelector('.backdrop').addEventListener('click', closeArticle);
    pop.querySelector('.x').addEventListener('click', closeArticle);
    pop.querySelector('.prev').addEventListener('click', () => step(-1));
    pop.querySelector('.next').addEventListener('click', () => step(1));
    pop.querySelector('.dlg-bar').addEventListener('click', (e) => {
      const b = e.target.closest('.save'); if (!b) return;
      const on = saved.toggle(popState.ids[popState.pos]);
      b.setAttribute('aria-pressed', String(on)); b.innerHTML = ICON.mark(on);
      b.setAttribute('aria-label', on ? 'Remove bookmark' : 'Bookmark this article');
    });
  }
  const one = ids.length < 2;
  pop.querySelector('.prev').hidden = one; pop.querySelector('.next').hidden = one;
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onKey);
  showCurrent().then(() => pop.querySelector('.x').focus());
}
function step(d) { if (!popState) return; popState.pos = (popState.pos + d + popState.ids.length) % popState.ids.length; showCurrent(); }
function onKey(e) {
  if (!popState) return;
  if (e.key === 'Escape') closeArticle();
  else if (e.key === 'ArrowRight' && !e.target.closest('input,select,textarea')) step(1);
  else if (e.key === 'ArrowLeft' && !e.target.closest('input,select,textarea')) step(-1);
  else if (e.key === 'Tab') { // keep focus inside the dialog
    const f = [...document.querySelectorAll('.pop button:not([hidden]), .pop a[href], .pop summary, .pop [tabindex="0"]')];
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
}
export function closeArticle() {
  const pop = document.querySelector('.pop');
  if (pop) pop.remove();
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onKey);
  const opener = popState && popState.opener; popState = null;
  const u = new URL(location.href); u.searchParams.delete('a'); history.replaceState(null, '', u);
  document.dispatchEvent(new CustomEvent('icm:closed'));
  if (opener && opener.focus) opener.focus();
}
// a shared link (?a=5705086) opens that article directly, on any page
export async function openFromUrl() {
  const id = new URL(location.href).searchParams.get('a');
  if (!id) return;
  await loadIndex();
  if (byId(id)) openArticle([id], 0, '');
}
