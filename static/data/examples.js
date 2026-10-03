/* =====================================================================
 * Qualitative examples + teaser — PROVIDE LATER.
 * ---------------------------------------------------------------------
 * One object per example. Put images in static/images/examples/.
 *
 * {
 *   id:        "ex03",                         // unique id
 *   category:  "Politics",                     // used for the filter chips
 *   image:     "static/images/examples/ex03.jpg",   // >= 1200 px wide recommended
 *   article:   { title: "...", date: "2024-05-01", source: "CNN", url: "https://...",
 *                snippet: "First 2-3 sentences of the retrieved article." },
 *   entities: [                                // candidate entities from the article
 *     { text: "Joe Biden", type: "PERSON", status: "kept",       // kept | removed | introduced
 *       score: 15.0,                           // optional: S(e) from the scorer
 *       features: {                            // optional: shown in the scoring trace
 *         editorial: "exact",                  //   "exact" | "partial" | null
 *         generated: "partial",                //   "exact" | "partial" | null
 *         qa: true, summary: false,
 *         position: "first20",                 //   "first20" | "20to50" | "later"
 *         words: 2
 *       } },
 *     { text: "Kamala Harris", type: "PERSON", status: "removed", score: 2.5 }
 *   ],
 *   captions: {
 *     baseline:  { text: "Caption with ALL entities (unfiltered) ..." },
 *     vgcap:     { text: "Caption from VG-Cap ..." },
 *     reference: { text: "Ground-truth caption ..." }        // optional
 *   },
 *   note: "Optional 1-2 sentence commentary shown under the captions."
 * }
 *
 * Word counts are computed automatically. Set  excerpt: true  if the caption
 * text is shortened.  Use  { id: "...", placeholder: true }  for an empty slot.
 * ===================================================================== */
window.VGCAP = window.VGCAP || {};

window.VGCAP.examples = [
  /* ---- Starter example 1 (from the paper's Fig. 4; replace with full data) ---- */
  {
    id: "ex01",
    category: "Sports",
    image: "static/images/examples/ex01_webber.jpg",
    excerpt: true,
    article: {
      title: null,          // PROVIDE: retrieved article title
      date: null,
      source: null,
      url: null,
      snippet: "Former Formula One driver Mark Webber watching a tennis match. The article also covers his racing career."
    },
    entities: [
      { text: "Mark Webber",      type: "PERSON", status: "kept" },
      { text: "Formula One",      type: "ORG",    status: "kept" },
      { text: "Australian",       type: "NORP",   status: "kept" },
      { text: "Sebastian Vettel", type: "PERSON", status: "removed" },
      { text: "Red Bull",         type: "ORG",    status: "removed" },
      { text: "Spain",            type: "GPE",    status: "removed" },
      { text: "Russia",           type: "GPE",    status: "removed" }
    ],
    captions: {
      baseline: { text: "Australian former Formula One driver Mark Webber watches the women's singles quarter-final match between … The image captures a relaxed Webber, sporting a smile … As a former F1 driver, Webber's career has been marked by a storied rivalry with Sebastian Vettel, and his new career racing Porsches in the World Endurance Championship. Red Bull." },
      vgcap:    { text: "Australian former Formula One driver Mark Webber, known for his nine grand prix wins … with a smile and a casual demeanor … Set against a predominantly blue background, the image highlights Webber's interests beyond racing … and enjoys downtime at sporting events." },
      reference: null       // PROVIDE: ground-truth caption
    },
    note: "The unfiltered caption pulls in Sebastian Vettel and Red Bull from the article's racing history and ends on the fragment “Red Bull.” With groundedness filtering, the caption describes what is visible: his expression and the blue background of the tennis court."
  },

  /* ---- Starter example 2 (from the paper's Fig. 4; replace with full data) ---- */
  {
    id: "ex02",
    category: "Sports",
    image: "static/images/examples/ex02_sherpa.jpg",
    excerpt: true,
    article: {
      title: null,
      date: null,
      source: null,
      url: null,
      snippet: "Nepali golfer Pratima Sherpa at home with her family."
    },
    entities: [
      { text: "Pratima Sherpa",      type: "PERSON", status: "kept" },
      { text: "Nepal",               type: "GPE",    status: "kept" },
      { text: "Tiger Woods",         type: "PERSON", status: "kept" },
      { text: "LPGA Tour",           type: "ORG",    status: "removed" },
      { text: "three or four hours", type: "TIME",   status: "removed" },
      { text: "The past few years",  type: "DATE",   status: "removed" }
    ],
    captions: {
      baseline: { text: "In this intimate snapshot, Pratima Sherpa, Nepal's No. 1 ranked female golfer, is shown in her humble abode … are busy preparing dinner, with Pratima's mother peeling potatoes on the floor … including meeting her idol Tiger Woods and competing in international tournaments. three or four hours the LPGA Tour The past few years Here is the." },
      vgcap:    { text: "This image captures Pratima Sherpa, Nepal's top-ranked female golfer, along with her family in their modest home … Pratima, seated on the bed, wears casual attire, while her mother, dressed in an orange sweater … This image underscores Sherpa's humble beginnings and her family's support, highlighting the challenges they face while nurturing her golfing dreams. the Tiger Woods." },
      reference: null
    },
    note: "The unfiltered caption ends in an incoherent run of article entities (“three or four hours the LPGA Tour The past few years Here is the.”). The filtered caption instead describes the orange sweater and the sparse interior."
  },

  /* ---- Empty slots: replace each with a full example object ---- */
  { id: "ex03", placeholder: true },
  { id: "ex04", placeholder: true },
  { id: "ex05", placeholder: true },
  { id: "ex06", placeholder: true }
];

/* Teaser shown at the top of the page: ONE strong "many entities -> few grounded"
 * example, same schema as above (entities with status are the key part).
 * null -> placeholder. */
window.VGCAP.teaser = null;
