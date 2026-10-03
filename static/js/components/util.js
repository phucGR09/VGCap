/* Shared helpers: DOM building, entity highlighting, word diff, placeholders. */
(function () {
  const V = (window.VGCAP = window.VGCAP || {});

  const COLORS = {
    ink: '#1b2130', ink2: '#3d4556', muted: '#6b7385', line: '#e3e6ee', grid: '#eef0f5',
    retrieval: '#2f6fde', context: '#2e9d5b', scorer: '#7b4fd6', length: '#0e8f9c', gen: '#d0781e',
    kept: '#1f9d55', removed: '#d64545', introduced: '#c27c00',
    ours: '#7b4fd6', other: '#b9c0cd'
  };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* el('div', {class: 'x', onclick: fn}, [children | 'text']) */
  function el(tag, attrs, children) {
    const n = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'html') n.innerHTML = v;
        else if (k === 'text') n.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v === true ? '' : v);
      }
    }
    (Array.isArray(children) ? children : children != null ? [children] : []).forEach(c => {
      if (c == null || c === false) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function wordCount(text) {
    return String(text || '').replace(/…/g, ' ').trim().split(/\s+/).filter(w => /\w/.test(w)).length;
  }

  function entKey(text) { return String(text).toLowerCase().replace(/\s+/g, ' ').trim(); }

  function reEscape(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  /* Wrap entity mentions in <span class="ent ent-{status}">. Returns {html, count}. */
  function highlight(text, entities) {
    const src = String(text || '');
    const ents = (entities || []).filter(e => e && e.text);
    if (!ents.length) return { html: esc(src), count: 0 };
    const byKey = {};
    ents.forEach(e => { byKey[entKey(e.text)] = e; });
    const alts = Object.keys(byKey).sort((a, b) => b.length - a.length).map(k => reEscape(k).replace(/ /g, '\\s+'));
    const re = new RegExp('(?<![\\w])(' + alts.join('|') + ')(?![\\w])', 'gi');
    let out = '', last = 0, count = 0, m;
    while ((m = re.exec(src))) {
      const e = byKey[entKey(m[1])];
      out += esc(src.slice(last, m.index));
      out += '<span class="ent ent-' + esc(e ? e.status : 'kept') + '" data-ent="' + esc(entKey(m[1])) + '">' + esc(m[1]) + '</span>';
      last = m.index + m[0].length;
      count++;
    }
    out += esc(src.slice(last));
    return { html: out, count: count };
  }

  /* Word-level LCS diff of a -> b. Returns HTML with .diff-del / .diff-ins spans. */
  function diffWords(a, b) {
    const A = String(a || '').split(/\s+/).filter(Boolean);
    const B = String(b || '').split(/\s+/).filter(Boolean);
    const n = A.length, m = B.length;
    const norm = w => w.toLowerCase().replace(/[^\w]/g, '');
    const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        dp[i][j] = norm(A[i]) === norm(B[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const parts = [];
    let i = 0, j = 0;
    const push = (cls, w) => {
      const p = parts[parts.length - 1];
      if (p && p.cls === cls) p.words.push(w); else parts.push({ cls: cls, words: [w] });
    };
    while (i < n && j < m) {
      if (norm(A[i]) === norm(B[j])) { push('', B[j]); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { push('diff-del', A[i]); i++; }
      else { push('diff-ins', B[j]); j++; }
    }
    while (i < n) push('diff-del', A[i++]);
    while (j < m) push('diff-ins', B[j++]);
    return parts.map(p => p.cls ? '<span class="' + p.cls + '">' + esc(p.words.join(' ')) + '</span>' : esc(p.words.join(' '))).join(' ');
  }

  /* Dashed "provide this" card. Hidden when VGCAP.showPlaceholders === false. */
  function placeholder(title, path, opts) {
    opts = opts || {};
    return el('div', { class: 'ph ph-only ' + (opts.cls || '') }, [
      el('i', { class: 'fas ' + (opts.icon || 'fa-plus-circle') }),
      el('span', { text: title }),
      path ? el('small', { text: path }) : null
    ]);
  }

  /* Run fn once when node scrolls into view. */
  function onVisible(node, fn, threshold) {
    if (!node) return;
    if (!('IntersectionObserver' in window)) { fn(); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold: threshold == null ? 0.35 : threshold });
    io.observe(node);
  }

  V.util = { COLORS, esc, el, wordCount, entKey, highlight, diffWords, placeholder, onVisible };
})();
