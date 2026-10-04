/* =====================================================================
 * Numbers reported in the paper (mmm.tex). Edit only if the paper changes.
 * ===================================================================== */
window.VGCAP = window.VGCAP || {};

window.VGCAP.results = {
  /* Table 1 — OpenEvents-V1 public test.  est = Overall computed from the
   * official formula (not reported by the original authors). */
  sota: [
    { method: "VG-Cap (ours)", ours: true, overall: 0.6219, ap: 0.992, r1: 0.985, r10: 1.000, clip: 0.858, cider: 0.265 },
    { method: "ENRIC",         overall: 0.6097, ap: 0.992, r1: 0.985, r10: 1.000, clip: 0.833, cider: 0.257 },
    { method: "ReCap",         overall: 0.5987, ap: 0.995, r1: 0.992, r10: 0.999, clip: 0.872, cider: 0.243 },
    { method: "Beyond Vision", overall: 0.5182, ap: 0.994, r1: 0.990, r10: 1.000, clip: 0.748, cider: 0.195 },
    { method: "ZSE-Cap",       overall: 0.4585, est: true, ap: 0.994, r1: 0.990, r10: 0.999, clip: 0.842, cider: 0.151 },
    { method: "HMR",           overall: 0.4033, est: true, ap: 0.970, r1: 0.956, r10: 0.991, clip: 0.883, cider: 0.123 },
    { method: "CIAN",          overall: 0.3320, ap: 0.979, r1: 0.969, r10: 0.996, clip: 0.820, cider: 0.094 }
  ],

  /* Table 2 — ablation (retrieval + Llama-3-8B backbone fixed). */
  ablation: [
    { config: "ENRIC baseline (reproduced)", short: "Baseline",          overall: 0.6097, cider: 0.257, clip: 0.833, length: 136,
      note: "Reproduced ENRIC pipeline. Captions average 136 words, far above the reference distribution." },
    { config: "+ semantic normalizer",       short: "+ Normalizer",      overall: 0.6124, cider: 0.260, clip: 0.835, length: 104,
      note: "Semantic Gaussian Normalizer brings captions to the 104-word target." },
    { config: "+ entities, prompt band",     short: "+ Entities & band", overall: 0.6166, cider: 0.263, clip: 0.833, length: 104,
      note: "All article entities injected, plus the 100–120 word prompt band." },
    { config: "+ heuristic selector (ours)", short: "+ Selector (ours)", overall: 0.6219, cider: 0.265, clip: 0.858, length: 104, ours: true,
      note: "Only grounded entities (S(e) ≥ 3, top-10) reach the prompt and the enrichment step." }
  ]
};
