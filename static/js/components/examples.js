/* Example browser (gallery + long-caption viewer), teaser, and the Problem-card entity cloud.
 * Data: static/data/examples.js */
(function () {
  const V = (window.VGCAP = window.VGCAP || {});
  const { el, esc, wordCount, entKey, highlight, diffWords, placeholder, onVisible } = V.util;

  const showPh = () => V.showPlaceholders !== false;
  const STATUS_ORDER = { kept: 0, introduced: 1, removed: 2 };
  const CAP_LABEL = { vgcap: 'VG-Cap', baseline: 'Unfiltered', reference: 'Reference' };

  function chip(e, withScore) {
    return el('span', { class: 'chip ' + (e.status || ''), 'data-ent': entKey(e.text), title: e.type + (typeof e.score === 'number' ? ' · S(e) = ' + e.score.toFixed(1) : '') }, [
      e.text,
      e.type ? el('span', { class: 't', text: e.type }) : null,
      withScore && typeof e.score === 'number' ? el('span', { class: 's', text: e.score.toFixed(1) }) : null
    ]);
  }
  function sortEnts(ents) {
    return (ents || []).slice().sort((a, b) => (STATUS_ORDER[a.status] || 0) - (STATUS_ORDER[b.status] || 0));
  }
  function capText(x, key) { return x.captions && x.captions[key] && x.captions[key].text; }

  /* ================================================================ browser */
  function browser() {
    const root = document.getElementById('example-browser');
    if (!root) return;
    const all = (V.examples || []).filter(x => !x.placeholder || showPh());
    if (!all.length) { root.appendChild(placeholder('Add examples', 'static/data/examples.js')); return; }

    const st = { filter: 'All', idx: 0, tab: 'vgcap', mode: 'single', hl: true };
    const cats = ['All'].concat(Array.from(new Set(all.filter(x => !x.placeholder && x.category).map(x => x.category))));
    const visible = () => all.filter(x => st.filter === 'All' || x.category === st.filter);

    // --- bar: filters + nav
    const filters = el('div', { class: 'xb-filters' });
    cats.forEach(c => filters.appendChild(el('button', { text: c, class: c === st.filter ? 'is-on' : '', onclick: () => { st.filter = c; st.idx = 0; renderAll(); } })));
    const counter = el('span');
    const nav = el('div', { class: 'xb-nav' }, [
      el('button', { 'aria-label': 'Previous example', html: '<i class="fas fa-chevron-left"></i>', onclick: () => go(-1) }),
      counter,
      el('button', { 'aria-label': 'Next example', html: '<i class="fas fa-chevron-right"></i>', onclick: () => go(1) })
    ]);
    root.appendChild(el('div', { class: 'xb-bar' }, [filters, nav]));
    const strip = el('div', { class: 'xb-strip', role: 'tablist' });
    root.appendChild(strip);
    const view = el('div');
    root.appendChild(view);

    function go(d) { const n = visible().length; st.idx = (st.idx + d + n) % n; renderAll(); }

    document.addEventListener('keydown', e => {
      if (/input|select|textarea/i.test(e.target.tagName)) return;
      const r = root.getBoundingClientRect();
      if (r.top > window.innerHeight * 0.6 || r.bottom < window.innerHeight * 0.3) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    });

    function renderAll() {
      filters.querySelectorAll('button').forEach(b => b.classList.toggle('is-on', b.textContent === st.filter));
      const list = visible();
      counter.textContent = (st.idx + 1) + ' / ' + list.length;
      strip.innerHTML = '';
      list.forEach((x, i) => {
        let t;
        if (x.placeholder) {
          t = el('button', { class: 'xb-thumb ph' + (i === st.idx ? ' is-on' : ''), html: '<i class="fas fa-image"></i>' + esc(x.id) });
        } else {
          const nRemoved = (x.entities || []).filter(e => e.status === 'removed').length;
          t = el('button', { class: 'xb-thumb' + (i === st.idx ? ' is-on' : ''), title: (x.article && x.article.title) || x.id }, [
            x.image ? el('img', { src: x.image, alt: '', loading: 'lazy' }) : null,
            x.category ? el('span', { class: 'cat', text: x.category }) : null,
            nRemoved ? el('span', { class: 'badge', text: '−' + nRemoved }) : null
          ]);
        }
        t.addEventListener('click', () => { st.idx = i; renderAll(); });
        strip.appendChild(t);
      });
      const on = strip.children[st.idx];
      if (on) strip.scrollTo({ left: on.offsetLeft - strip.clientWidth / 2 + on.clientWidth / 2, behavior: 'smooth' });
      renderView(list[st.idx]);
    }

    // --- placeholder view
    function renderPlaceholder(x) {
      view.innerHTML = '';
      view.appendChild(el('div', { class: 'xb-view' }, el('div', { class: 'xb-ph-view' }, [
        placeholder('Example image (≥ 1200 px wide)', 'static/images/examples/' + x.id + '.jpg', { icon: 'fa-image', cls: 'tall' }),
        el('div', { class: 'xb-ph-stack' }, [
          placeholder('Article: title · date · source · 2–3 sentence snippet', 'examples.js → ' + x.id + '.article', { icon: 'fa-newspaper' }),
          placeholder('Candidate entities with status (kept / removed / introduced) and optional S(e)', 'examples.js → ' + x.id + '.entities[]', { icon: 'fa-tags' }),
          placeholder('Captions: Unfiltered · VG-Cap · Reference (~104 words each)', 'examples.js → ' + x.id + '.captions', { icon: 'fa-align-left' })
        ])
      ])));
    }

    // --- caption card
    function capCard(x, key, opts) {
      opts = opts || {};
      const text = capText(x, key);
      const card = el('div', { class: 'cap-card' + (key === 'vgcap' ? ' ours' : '') });
      const cfg = key === 'vgcap' ? 'VG-Cap · 0.6219' : key === 'baseline' ? 'All entities · 0.6166' : 'Ground truth';
      if (!text) {
        card.appendChild(el('div', { class: 'cap-head' }, el('span', { class: 'who', text: CAP_LABEL[key] })));
        card.appendChild(placeholder(CAP_LABEL[key] + ' caption', 'examples.js → ' + x.id + '.captions.' + key + '.text', { icon: 'fa-align-left' }));
        return card;
      }
      const h = highlight(text, x.entities);
      const words = x.captions[key].words || wordCount(text);
      card.appendChild(el('div', { class: 'cap-head' }, [
        el('span', { class: 'who', text: CAP_LABEL[key] }),
        el('span', { class: 'tag-cfg ' + (key === 'vgcap' ? 'ours' : 'base'), text: cfg })
      ]));
      const body = el('div', { class: 'cap-text' + (opts.open ? ' is-open' : ''), html: h.html });
      card.appendChild(body);
      if (!opts.open) {
        const more = el('button', { class: 'cap-more', text: 'Show full caption (' + words + ' words)' });
        more.addEventListener('click', () => {
          const open = body.classList.toggle('is-open');
          more.textContent = open ? 'Show less' : 'Show full caption (' + words + ' words)';
        });
        card.appendChild(more);
        requestAnimationFrame(() => { if (body.scrollHeight <= body.clientHeight + 2) more.remove(); });
      }
      const c = x.captions[key];
      card.appendChild(el('div', { class: 'cap-foot', html:
        '<span>words <b>' + words + (x.excerpt ? ' (excerpt)' : '') + '</b></span>' +
        '<span>entity mentions <b>' + h.count + '</b></span>' +
        (c.cider != null ? '<span>CIDEr <b>' + (+c.cider).toFixed(3) + '</b></span>' : '') +
        (c.clip != null ? '<span>CLIP <b>' + (+c.clip).toFixed(3) + '</b></span>' : '') }));
      return card;
    }

    // --- real example view
    function renderView(x) {
      if (!x) { view.innerHTML = ''; return; }
      if (x.placeholder) { renderPlaceholder(x); return; }
      view.innerHTML = '';
      const box = el('div', { class: 'xb-view' + (st.hl ? '' : ' no-hl') });

      // left: media
      const media = el('div', { class: 'xb-media' }, [
        x.image ? el('img', { src: x.image, class: 'zoomable', alt: (x.article && x.article.title) || 'Example image ' + x.id })
                : placeholder('Example image', 'static/images/examples/' + x.id + '.jpg', { icon: 'fa-image' }),
        el('div', { class: 'xb-meta' }, [
          x.category ? el('span', { class: 'cat', text: x.category }) : null,
          el('span', { text: '#' + x.id }),
          x.excerpt ? el('span', { class: 'xb-excerpt', text: 'Caption excerpts from paper figure', title: 'Replace with the full captions in examples.js' }) : null
        ])
      ]);

      // right: article + entities + captions
      const a = x.article || {};
      const art = el('div', { class: 'xb-article' });
      if (a.title) art.appendChild(el('h4', null, a.url ? el('a', { href: a.url, target: '_blank', rel: 'noopener', text: a.title }) : a.title));
      else if (showPh()) art.appendChild(placeholder('Article title', 'examples.js → ' + x.id + '.article.title', { icon: 'fa-newspaper', cls: 'tiny' }));
      const src = [a.source, a.date].filter(Boolean).join(' · ');
      if (src) art.appendChild(el('div', { class: 'src', text: src }));
      if (a.snippet) art.appendChild(el('p', { class: 'snip', text: a.snippet }));

      const ents = sortEnts(x.entities);
      const nk = ents.filter(e => e.status === 'kept').length, nr = ents.filter(e => e.status === 'removed').length, ni = ents.filter(e => e.status === 'introduced').length;
      const hlToggle = el('label', { class: 'toggle' }, [el('input', { type: 'checkbox', checked: st.hl ? true : null }), 'highlight']);
      hlToggle.firstChild.addEventListener('change', ev => { st.hl = ev.target.checked; box.classList.toggle('no-hl', !st.hl); });
      const entTitle = el('div', { class: 'xb-ents-title' }, [
        el('span', { html: 'Article entities · <span style="color:var(--kept)">' + nk + ' kept</span> · <span style="color:var(--removed)">' + nr + ' removed</span>' + (ni ? ' · <span style="color:var(--introduced)">' + ni + ' introduced</span>' : '') }),
        hlToggle
      ]);
      const chips = el('div', { class: 'xb-ents' }, ents.map(e => chip(e, true)));
      chips.addEventListener('mouseover', ev => pulse(ev.target.closest('.chip'), true));
      chips.addEventListener('mouseout', ev => pulse(ev.target.closest('.chip'), false));
      function pulse(c, on) {
        if (!c) return;
        box.querySelectorAll('.ent[data-ent="' + c.dataset.ent.replace(/"/g, '\\"') + '"]').forEach(s => s.classList.toggle('pulse', on));
      }

      // controls
      const hasRef = !!capText(x, 'reference');
      const capTabs = el('div', { class: 'tabs-pill', role: 'tablist' });
      ['vgcap', 'baseline', 'reference'].forEach(k => {
        if (k === 'reference' && !hasRef && !showPh()) return;
        capTabs.appendChild(el('button', { text: CAP_LABEL[k], class: st.tab === k ? 'is-on' : '', onclick: () => { st.tab = k; renderView(x); } }));
      });
      const modeTabs = el('div', { class: 'tabs-pill' }, [
        ['single', 'One at a time'], ['compare', 'Side by side'], ['diff', 'Word diff']
      ].map(([m, l]) => el('button', { text: l, class: st.mode === m ? 'is-on' : '', onclick: () => { st.mode = m; renderView(x); } })));
      const controls = el('div', { class: 'xb-controls' }, [st.mode === 'single' ? capTabs : el('span'), modeTabs]);

      const right = el('div', { class: 'xb-right' }, [art, entTitle, chips, controls]);
      if (st.mode === 'single') right.appendChild(capCard(x, st.tab));

      box.appendChild(el('div', { class: 'xb-top' }, [media, right]));

      if (st.mode === 'compare') {
        box.appendChild(el('div', { class: 'xb-compare' }, [capCard(x, 'baseline', { open: true }), capCard(x, 'vgcap', { open: true })]));
      } else if (st.mode === 'diff') {
        const b = capText(x, 'baseline'), g = capText(x, 'vgcap');
        const card = el('div', { class: 'cap-card', style: 'margin-top:18px' }, [
          el('div', { class: 'cap-head' }, [
            el('span', { class: 'who', text: 'Unfiltered → VG-Cap' }),
            el('span', { class: 'legend', html: '<span class="diff-del">&nbsp;only in unfiltered&nbsp;</span> <span class="diff-ins">&nbsp;only in VG-Cap&nbsp;</span>' })
          ]),
          b && g ? el('div', { class: 'cap-text is-open', html: diffWords(b, g) })
                 : placeholder('Both captions are needed for the diff', 'examples.js → captions.baseline / captions.vgcap')
        ]);
        box.appendChild(card);
      }
      if (x.note) box.appendChild(el('div', { class: 'xb-note', html: '<i class="fas fa-lightbulb"></i>' + esc(x.note) }));
      view.appendChild(box);
    }

    renderAll();
  }

  /* ================================================================ teaser */
  function teaser() {
    const host = document.getElementById('teaser');
    if (!host) return;
    const t = V.teaser;
    if (!t) {
      if (!showPh()) { host.remove(); return; }
      host.appendChild(el('div', { class: 'teaser-ph' }, [
        placeholder('Teaser image: one news photo', 'static/images/teaser.jpg', { icon: 'fa-image' }),
        placeholder('All article entities → only the grounded ones kept', 'examples.js → VGCAP.teaser.entities', { icon: 'fa-tags' }),
        placeholder('VG-Cap caption with grounded entities underlined', 'examples.js → VGCAP.teaser.captions.vgcap', { icon: 'fa-align-left' })
      ]));
      return;
    }
    const ents = sortEnts(t.entities);
    const cloud = el('div', { class: 'xb-ents' }, ents.map(e => chip(e)));
    const txt = capText(t, 'vgcap');
    const h = highlight(txt, (t.entities || []).filter(e => e.status !== 'removed'));
    const body = el('div', { class: 'cap-text', html: h.html });
    const more = el('button', { class: 'cap-more', text: 'Show full caption' });
    more.addEventListener('click', () => { const o = body.classList.toggle('is-open'); more.textContent = o ? 'Show less' : 'Show full caption'; });
    host.appendChild(el('div', { class: 'teaser-grid' }, [
      el('div', { class: 'teaser-col' }, [el('h4', { text: 'News image' }), t.image ? el('img', { src: t.image, class: 'zoomable', alt: (t.article && t.article.title) || 'Teaser image' }) : null]),
      el('div', { class: 'teaser-arrow', html: '<i class="fas fa-arrow-right"></i>' }),
      el('div', { class: 'teaser-col' }, [el('h4', { text: 'Article entities' }), cloud,
        el('div', { class: 'legend', html: '<span class="lg lg-kept"></span>grounded <span class="lg lg-removed"></span>rejected' })]),
      el('div', { class: 'teaser-arrow', html: '<i class="fas fa-arrow-right"></i>' }),
      el('div', { class: 'teaser-col' }, [el('h4', { text: 'VG-Cap caption' }), body, more])
    ]));
    requestAnimationFrame(() => { if (body.scrollHeight <= body.clientHeight + 2) more.remove(); });
  }

  V.examplesUI = { init() { teaser(); browser(); } };
})();
