/* Result tables. Data: static/data/results.js */
(function () {
  const V = (window.VGCAP = window.VGCAP || {});
  const { esc } = V.util;

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
    }
  };
})();
