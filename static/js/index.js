/* Page bootstrap: nav, KaTeX, method stepper, lightbox, BibTeX copy, components. */
(function () {
  const V = (window.VGCAP = window.VGCAP || {});

  /* Overview-figure regions for each method step, in % of the image (left, top, width, height). */
  const STEP_REGIONS = [
    [0.4, 1.0, 41.6, 87.6],   // 1 retrieval & re-ranking
    [42.2, 7.0, 33.0, 34.2],  // 2 context construction
    [77.8, 7.0, 21.7, 35.6],  // 3 entity heuristic scorer
    [77.8, 46.6, 21.7, 43.4], // 4 two-stage length control + final caption
    [42.2, 46.6, 34.6, 42.8]  // 5 caption generation + unified entity conditioning
  ];

  function nav() {
    const burger = document.getElementById('nav-burger');
    const links = document.getElementById('nav-links');
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('is-open')));

    const bar = document.getElementById('scroll-progress');
    const onScroll = () => {
      const h = document.documentElement;
      bar.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!('IntersectionObserver' in window)) return;
    const map = {};
    links.querySelectorAll('a').forEach(a => { map[a.getAttribute('href').slice(1)] = a; });
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        Object.values(map).forEach(a => a.classList.remove('is-current'));
        if (map[en.target.id]) map[en.target.id].classList.add('is-current');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(s => io.observe(s));
  }

  function math() {
    if (!window.renderMathInElement) { console.warn('[VG-Cap] KaTeX failed to load.'); return; }
    renderMathInElement(document.body, {
      delimiters: [{ left: '\\[', right: '\\]', display: true }, { left: '\\(', right: '\\)', display: false }],
      throwOnError: false
    });
  }

  function stepper() {
    const fig = document.getElementById('overview-fig');
    const hl = document.getElementById('fig-highlight');
    const steps = document.querySelectorAll('#stepper .step');
    const panels = document.querySelectorAll('.step-panel');
    function show(i) {
      steps.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-selected', k === i); });
      panels.forEach((p, k) => p.classList.toggle('is-active', k === i));
      const r = STEP_REGIONS[i];
      Object.assign(hl.style, { left: r[0] + '%', top: r[1] + '%', width: r[2] + '%', height: r[3] + '%' });
      fig.classList.remove('show-all');
    }
    steps.forEach((s, i) => s.addEventListener('click', () => show(i)));
    document.getElementById('fig-all').addEventListener('click', () => fig.classList.toggle('show-all'));
    show(0);
  }

  function lightbox() {
    const lb = document.getElementById('lightbox');
    const img = lb.querySelector('img');
    const close = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); };
    document.addEventListener('click', e => {
      const t = e.target.closest('img.zoomable');
      if (!t) return;
      img.src = t.currentSrc || t.src; img.alt = t.alt;
      lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
    });
    lb.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  function bibtex() {
    const btn = document.getElementById('copy-bib');
    const label = btn.querySelector('span');
    btn.addEventListener('click', async () => {
      const text = document.getElementById('bibtex-code').textContent;
      try { await navigator.clipboard.writeText(text); }
      catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (_) { /* ignore */ }
        ta.remove();
      }
      label.textContent = 'Copied';
      setTimeout(() => { label.textContent = 'Copy'; }, 1600);
    });
  }

  function init() {
    if (V.showPlaceholders === false) document.body.classList.add('hide-placeholders');
    nav();
    math();
    stepper();
    lightbox();
    bibtex();
    const run = (name, fn) => { try { fn(); } catch (e) { console.error('[VG-Cap] ' + name + ' failed:', e); } };
    // Draw charts once web fonts are ready so axis labels are measured with Inter.
    const fontsReady = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve();
    fontsReady.then(() => run('charts', () => V.charts.init()));
    run('examples', () => V.examplesUI.init());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
