/* All Chart.js charts + result tables + analysis visuals. Data: static/data/results.js, analysis.js */
(function () {
  const V = (window.VGCAP = window.VGCAP || {});
  const { COLORS: C, el, esc, placeholder, onVisible } = V.util;

  const METRICS = {
    overall: { label: 'Overall Score', min: 0, max: 0.7, dec: 4 },
    cider:   { label: 'CIDEr',         min: 0, max: 0.3, dec: 3 },
    clip:    { label: 'CLIPScore',     min: 0.7, max: 0.9, dec: 3 },
    ap:      { label: 'AP',            min: 0.95, max: 1.0, dec: 3 },
    r1:      { label: 'R@1',           min: 0.95, max: 1.0, dec: 3 },
    r10:     { label: 'R@10',          min: 0.95, max: 1.0, dec: 3 }
  };

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

  /* ------------------------------------------------ SOTA ranked bars */
  function sotaChart() {
    const cv = document.getElementById('chart-sota');
    if (!cv) return;
    const rows = V.results.sota;
    const enric = rows.find(r => r.method === 'ENRIC');
    const ours = rows.find(r => r.ours);
    const notes = {
      overall: 'Best Overall Score. The gain comes entirely from the captioning stage.',
      cider: 'Highest CIDEr: captions match the references better at the same length.',
      clip: 'HMR and ReCap have higher CLIPScore but much lower CIDEr, which costs them Overall Score.',
      ap: 'Retrieval is identical to ENRIC by design. All methods sit between 0.970 and 0.995.',
      r1: 'Retrieval is identical to ENRIC by design. ReCap has the best R@1 but a lower Overall Score.',
      r10: 'Nearly every method reaches R@10 ≈ 1.0.'
    };
    let chart;
    function draw(m) {
      const spec = METRICS[m];
      const sorted = rows.slice().sort((a, b) => b[m] - a[m]);
      const data = {
        labels: sorted.map(r => r.method + (m === 'overall' && r.est ? ' *' : '')),
        datasets: [{
          data: sorted.map(r => r[m]),
          backgroundColor: sorted.map(r => r.ours ? C.ours : C.other),
          hoverBackgroundColor: sorted.map(r => r.ours ? '#6a3fc4' : '#9aa3b3'),
          borderRadius: 6, barThickness: 24
        }]
      };
      const options = {
        indexAxis: 'y',
        layout: { padding: { right: 56 } },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => spec.label + ': ' + c.raw.toFixed(spec.dec) } },
          valueLabels: {
            mode: 'right', formatter: v => v.toFixed(spec.dec),
            color: i => sorted[i].ours ? C.ours : C.ink2
          }
        },
        scales: {
          x: { min: spec.min, max: spec.max, grid: { color: C.grid }, ticks: { maxTicksLimit: 6 } },
          y: { grid: { display: false }, ticks: { color: C.ink, font: { weight: 600 } } }
        }
      };
      if (!chart) chart = new Chart(cv, { type: 'bar', data: data, options: options });
      else { chart.data = data; chart.options = options; chart.update(); }

      const rank = sorted.findIndex(r => r.ours) + 1;
      const d = ours[m] - enric[m];
      const dTxt = Math.abs(d) < 1e-9 ? 'same as ENRIC' : (d > 0 ? '+' : '−') + Math.abs(d).toFixed(spec.dec) + ' vs ENRIC';
      document.getElementById('sota-takeaway').innerHTML =
        '<b>VG-Cap: ' + ours[m].toFixed(spec.dec) + '</b> (rank ' + rank + ' of ' + rows.length + ', ' + dTxt + '). ' + esc(notes[m]);
    }
    document.querySelectorAll('#sota-tabs button').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('#sota-tabs button').forEach(x => x.classList.toggle('is-on', x === b));
        draw(b.dataset.m);
      });
    });
    draw('overall');
  }

  /* ------------------------------------------------ retrieval dot plot */
  function retrievalChart() {
    const cv = document.getElementById('chart-retrieval');
    if (!cv) return;
    const rows = V.results.sota;
    const names = rows.map(r => r.method);
    const mk = (key, label, color, style) => ({
      label: label, data: rows.map((r, i) => ({ x: r[key], y: i })),
      pointStyle: style, pointRadius: rows.map(r => r.ours ? 7 : 5.5), pointHoverRadius: 8,
      backgroundColor: color, borderColor: '#fff', borderWidth: 1.5
    });
    new Chart(cv, {
      type: 'scatter',
      data: { datasets: [mk('ap', 'AP', C.retrieval, 'circle'), mk('r1', 'R@1', C.scorer, 'triangle'), mk('r10', 'R@10', C.length, 'rectRounded')] },
      options: {
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { callbacks: { label: c => names[c.raw.y] + ' · ' + c.dataset.label + ': ' + c.raw.x.toFixed(3) } }
        },
        scales: {
          x: { min: 0.95, max: 1.001, ticks: { stepSize: 0.01, callback: v => v.toFixed(2) } },
          y: {
            reverse: true, min: -0.5, max: rows.length - 0.5, grid: { display: false },
            afterBuildTicks: axis => { axis.ticks = rows.map((_, i) => ({ value: i })); },
            ticks: {
              stepSize: 1, autoSkip: false, callback: v => names[v] || '',
              color: ctx => rows[ctx.tick.value] && rows[ctx.tick.value].ours ? C.ours : C.ink,
              font: { weight: 600 }
            }
          }
        }
      }
    });
  }

  /* ------------------------------------------------ CIDEr vs CLIP bubbles */
  function tradeoffChart() {
    const cv = document.getElementById('chart-tradeoff');
    if (!cv) return;
    const rows = V.results.sota;
    new Chart(cv, {
      type: 'bubble',
      data: {
        datasets: [{
          data: rows.map(r => ({ x: r.cider, y: r.clip, r: 4 + (r.overall - 0.3) * 38, m: r })),
          backgroundColor: rows.map(r => r.ours ? 'rgba(123,79,214,.85)' : 'rgba(150,160,180,.45)'),
          borderColor: rows.map(r => r.ours ? C.ours : '#8d96a8'), borderWidth: 1.5
        }]
      },
      options: {
        layout: { padding: { right: 70, top: 10 } },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: c => c.raw.m.method + ' · CIDEr ' + c.raw.x.toFixed(3) + ' · CLIP ' + c.raw.y.toFixed(3) + ' · Overall ' + c.raw.m.overall.toFixed(4) } },
          valueLabels: { mode: 'label', formatter: (v) => v.m.method.replace(' (ours)', ''), color: i => rows[i].ours ? C.ours : C.ink2 }
        },
        scales: {
          x: { min: 0.06, max: 0.3, title: { display: true, text: 'CIDEr →' } },
          y: { min: 0.72, max: 0.9, title: { display: true, text: 'CLIPScore →' } }
        }
      }
    });
  }

  /* ------------------------------------------------ ablation waterfall */
  function ablationChart() {
    const cv = document.getElementById('chart-ablation');
    const list = document.getElementById('abl-steps');
    if (!cv) return;
    const rows = V.results.ablation;
    const floor = 0.605;
    const bars = rows.map((r, i) => i === 0 ? [floor, r.overall] : [rows[i - 1].overall, r.overall]);
    const chart = new Chart(cv, {
      data: {
        labels: rows.map(r => r.short),
        datasets: [
          {
            type: 'bar', label: 'Overall Score', data: bars, yAxisID: 'y',
            backgroundColor: rows.map((r, i) => r.ours ? C.ours : i === 0 ? C.other : '#a99be0'),
            borderRadius: 6, barPercentage: .62
          },
          {
            type: 'line', label: 'CLIPScore', data: rows.map(r => r.clip), yAxisID: 'y1',
            borderColor: C.length, backgroundColor: C.length, borderWidth: 2, borderDash: [5, 4], pointRadius: 4, tension: 0
          }
        ]
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: c => c.dataset.type === 'line' || c.datasetIndex === 1
                ? 'CLIPScore: ' + rows[c.dataIndex].clip.toFixed(3)
                : 'Overall: ' + rows[c.dataIndex].overall.toFixed(4) + (c.dataIndex ? '  (+' + (rows[c.dataIndex].overall - rows[c.dataIndex - 1].overall).toFixed(4) + ')' : ''),
              afterBody: items => 'Caption length: ' + rows[items[0].dataIndex].length + ' words'
            }
          },
          valueLabels: {
            datasets: [0],
            formatter: (v, i) => i === 0 ? rows[0].overall.toFixed(4) : '+' + (rows[i].overall - rows[i - 1].overall).toFixed(4),
            color: i => rows[i].ours ? C.ours : C.ink2
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: C.ink, font: { weight: 600 } } },
          y: { min: floor, max: 0.625, title: { display: true, text: 'Overall Score' }, ticks: { callback: v => v.toFixed(3) } },
          y1: { position: 'right', min: 0.80, max: 0.87, grid: { display: false }, title: { display: true, text: 'CLIPScore' }, ticks: { callback: v => v.toFixed(2) } }
        },
        onHover: (e, items) => {
          const i = items.length ? items[0].index : -1;
          list.querySelectorAll('li').forEach((li, k) => li.classList.toggle('is-hot', k === i));
        }
      }
    });
    rows.forEach((r, i) => {
      const d = i ? '+' + (r.overall - rows[i - 1].overall).toFixed(4) : '';
      const li = el('li', { class: r.ours ? 'ours' : '' });
      li.innerHTML = '<span class="nm">' + esc(r.config) + '</span>' + (d ? '<span class="dl">' + d + '</span>' : '') +
        '<span class="len">' + r.length + ' w</span><br>' + esc(r.note);
      li.addEventListener('mouseenter', () => {
        chart.setActiveElements([{ datasetIndex: 0, index: i }, { datasetIndex: 1, index: i }]);
        chart.tooltip.setActiveElements([{ datasetIndex: 0, index: i }], { x: 0, y: 0 });
        chart.update();
      });
      li.addEventListener('mouseleave', () => { chart.setActiveElements([]); chart.tooltip.setActiveElements([], { x: 0, y: 0 }); chart.update(); });
      list.appendChild(li);
    });
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
      sotaChart();
      retrievalChart();
      tradeoffChart();
      ablationChart();
      typesChart();
      gapHist();
    }
  };
})();
