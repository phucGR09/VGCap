/* All Chart.js charts + result tables + analysis visuals. Data: static/data/results.js, analysis.js */
(function () {
  const V = (window.VGCAP = window.VGCAP || {});
  const { COLORS: C, el, esc, placeholder, onVisible } = V.util;

  /* Draws value labels at the end of bars / next to points. */
  const valueLabels = {
    id: 'valueLabels',
    afterDatasetsDraw(chart, args, opts) {
      if (!opts || !opts.formatter) return;
      const ctx = chart.ctx;
      ctx.save();
      ctx.font = (opts.weight || '600') + ' 11px Inter, system-ui, sans-serif';
      chart.data.datasets.forEach((ds, di) => {
        if (opts.datasets && opts.datasets.indexOf(di) < 0) return;
        const meta = chart.getDatasetMeta(di);
        if (meta.hidden) return;
        meta.data.forEach((elem, i) => {
          const txt = opts.formatter(ds.data[i], i, di);
          if (txt == null) return;
          const p = elem.tooltipPosition();
          ctx.fillStyle = (opts.color && opts.color(i, di)) || C.ink2;
          if (opts.mode === 'right') { ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, elem.x + 6, elem.y); }
          else if (opts.mode === 'label') { ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(txt, p.x + (elem.options.radius || 6) + 5, p.y); }
          else { ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'; ctx.fillText(txt, p.x, Math.min(elem.y, elem.base) - 5); }
        });
      });
      ctx.restore();
    }
  };

  function setup() {
    if (!window.Chart) return false;
    Chart.register(valueLabels);
    Chart.defaults.font.family = "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = C.muted;
    Chart.defaults.borderColor = C.grid;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.plugins.legend.labels.boxWidth = 10;
    Chart.defaults.plugins.legend.labels.boxHeight = 10;
    Chart.defaults.plugins.tooltip.backgroundColor = C.ink;
    Chart.defaults.plugins.tooltip.padding = 10;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    return true;
  }

  /* ------------------------------------------------ removed by type */
  function typesChart() {
    const cv = document.getElementById('chart-types');
    if (!cv) return;
    const rows = V.results.removedByType;
    const max = rows[0][1];
    new Chart(cv, {
      type: 'bar',
      data: {
        labels: rows.map(r => r[0]),
        datasets: [{
          data: rows.map(r => r[1]),
          backgroundColor: rows.map(r => 'rgba(214,69,69,' + (0.35 + 0.6 * r[1] / max).toFixed(2) + ')'),
          borderRadius: 5, barThickness: 16
        }]
      },
      options: {
        indexAxis: 'y',
        layout: { padding: { right: 44 } },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => c.raw.toLocaleString() + ' mentions removed' } },
          valueLabels: { mode: 'right', formatter: v => v.toLocaleString() }
        },
        scales: {
          x: { min: 0, max: 2200, ticks: { maxTicksLimit: 5 } },
          y: { grid: { display: false }, ticks: { color: C.ink, font: { family: "'JetBrains Mono', monospace", size: 11 } } }
        }
      }
    });
  }

  /* ------------------------------------------------ fewer / same / more */
  function splitBar() {
    const host = document.getElementById('split-bar');
    if (!host) return;
    const s = V.results.entityStats;
        const segs = [
      { v: s.fewer, c: C.scorer, t: 'fewer entities', k: s.fewerN },
      { v: s.same, c: '#9aa3b3', t: 'same', k: s.sameN },
      { v: s.more, c: C.introduced, t: 'more entities', k: s.moreN }
    ];
    segs.forEach(g => {
      const d = el('div', { style: 'background:' + g.c + ';flex:1 1 0', title: g.v + '% of queries: ' + g.t });
      d.innerHTML = g.v + '%<small>' + g.t + '</small>';
      host.appendChild(d);
      g.node = d;
    });
    const legend = el('div', { class: 'split-legend' }, segs.map(g =>
      el('span', { html: '<span class="lg" style="background:' + g.c + '"></span> ' + g.t + ': ' + g.k.toLocaleString() + ' queries' })));
    host.after(legend);
    onVisible(host, () => segs.forEach(g => { g.node.style.flexGrow = g.v; }));
  }

  /* ------------------------------------------------ entity-gap histogram */
  function gapHist() {
    const host = document.getElementById('gap-hist');
    if (!host) return;
    const d = V.entityGapBins;
    const s = V.results.entityStats;
    if (d && d.bins && d.counts) {
      const box = el('div', { class: 'chart-box tall' }, el('canvas', { 'aria-label': 'Entity gap histogram' }));
      host.appendChild(box);
      const total = d.counts.reduce((a, b) => a + b, 0);
      const pdf = x => total * Math.exp(-((x - s.gapMean) ** 2) / (2 * s.gapStd ** 2)) / (s.gapStd * Math.sqrt(2 * Math.PI));
      new Chart(box.firstChild, {
        data: {
          labels: d.bins,
          datasets: [
            { type: 'bar', label: 'queries', data: d.counts, backgroundColor: d.bins.map(b => b < 0 ? C.scorer : b === 0 ? '#9aa3b3' : C.introduced), borderRadius: 3, categoryPercentage: .92, barPercentage: 1 },
            { type: 'line', label: 'normal fit (μ ' + s.gapMean + ', σ ' + s.gapStd + ')', data: d.bins.map(pdf), borderColor: C.ink, borderWidth: 2, pointRadius: 0, tension: .35 }
          ]
        },
        options: {
          plugins: { legend: { position: 'bottom' } },
          scales: { x: { grid: { display: false }, title: { display: true, text: 'entities(VG-Cap) − entities(unfiltered)' } }, y: { title: { display: true, text: 'queries' } } }
        }
      });
    } else {
      host.appendChild(el('div', { class: 'fig-fallback' }, [
        el('img', { src: './static/images/figures/entity_gap_distribution.svg', class: 'zoomable', alt: 'Per-caption entity gap distribution from the paper.' }),
        placeholder('Provide bin counts for an interactive version', 'static/data/analysis.js → VGCAP.entityGapBins', { icon: 'fa-chart-bar', cls: 'tiny' })
      ]));
    }
  }

  /* ------------------------------------------------ tables */
  function tables() {
    const sota = V.results.sota, abl = V.results.ablation;
    const keys = ['overall', 'ap', 'r1', 'r10', 'clip', 'cider'];
    const best = {};
    keys.forEach(k => { best[k] = Math.max.apply(null, sota.map(r => r[k])); });
    let h = '<table class="rtable"><thead><tr><th>Method</th><th>Overall ↑</th><th>AP ↑</th><th>R@1 ↑</th><th>R@10 ↑</th><th>CLIP ↑</th><th>CIDEr ↑</th></tr></thead><tbody>';
    sota.forEach(r => {
      h += '<tr class="' + (r.ours ? 'ours' : '') + '"><td>' + esc(r.method) + '</td>' + keys.map(k => {
        const v = k === 'overall' ? r[k].toFixed(4) + (r.est ? '*' : '') : r[k].toFixed(3);
        return '<td class="' + (r[k] === best[k] ? 'best' : '') + '">' + v + '</td>';
      }).join('') + '</tr>';
    });
    document.getElementById('table-sota').innerHTML = h + '</tbody></table>';

    let a = '<table class="rtable"><thead><tr><th>Configuration</th><th>Overall ↑</th><th>CIDEr ↑</th><th>CLIP ↑</th><th>Length</th></tr></thead><tbody>';
    abl.forEach(r => {
      a += '<tr class="' + (r.ours ? 'ours' : '') + '"><td>' + esc(r.config) + '</td><td>' + r.overall.toFixed(4) + '</td><td>' +
        r.cider.toFixed(3) + '</td><td>' + r.clip.toFixed(3) + '</td><td>' + r.length + '</td></tr>';
    });
    document.getElementById('table-ablation').innerHTML = a + '</tbody></table>';
  }

  V.charts = {
    init() {
      tables();
      splitBar();
      if (!setup()) { console.warn('[VG-Cap] Chart.js failed to load; charts skipped.'); return; }
      typesChart();
      gapHist();
    }
  };
})();
