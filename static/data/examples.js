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
  /* ---- ex01: Mark Webber, query_id f9a5d58265df2d89 (matches the paper's Fig. 4) ---- */
  {
    id: "ex01",
    category: "Sports",
    image: "static/images/examples/ex01_webber.jpg",
    article: {
      title: "Mark Webber reveals Formula One risks and rivalries",
      date: "2015-10-14",
      source: "CNN",
      url: "https://www.cnn.com/2015/10/14/motorsport/formula-one-mark-webber-qa-feature/index.html",
      snippet: "Webber won nine grands prix in his 14-year F1 career and finished third in the drivers' championship three times, fueled by a storied rivalry with Red Bull teammate Sebastian Vettel. He's now a race winner for Porsche in the World Endurance Championship."
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
      baseline: { text: "Australian former Formula One driver Mark Webber watches the women's singles quarter-final match between Carla Suarez Navarro of Spain and Maria Sharapova of Russia at the Brisbane International tennis tournament on January 8, 2015. The image captures a relaxed Webber, sporting a smile, as he takes in the action on the court. This rare glimpse into Webber's life outside of racing highlights his interest in tennis and his presence at a major sporting event. As a former F1 driver, Webber's career has been marked by a storied rivalry with Sebastian Vettel, and his new career racing Porsches in the World Endurance Championship. Red Bull." },
      vgcap:    { text: "Australian former Formula One driver Mark Webber, known for his nine grand prix wins and third-place finishes in the drivers' championship, is captured watching a tennis match at the Brisbane International tournament on January 8, 2015. The image shows Webber, with a smile and a casual demeanor, observing the women's singles quarter-final between Carla Suarez Navarro and Maria Sharapova. Set against a predominantly blue background, the image highlights Webber's interests beyond racing, such as his passion for sports like tennis. This snapshot underscores Webber's multifaceted life post-F1, where he now races Porsches in the World Endurance Championship and enjoys downtime at sporting events. Red." },
      reference: null       // PROVIDE: ground-truth caption
    },
    note: "The unfiltered caption pulls in Sebastian Vettel and Red Bull from the article's racing history. Groundedness filtering drops both and the Spain/Russia nationality tags, while keeping the two players' names — entity-level selection, not a blanket cut of the tennis context. Both the full baseline and full VG-Cap outputs still end in a stray one-word fragment (“Red Bull.” / “Red.”); the paper's own Fig. 4 quietly cropped these off for the printed figure, but the raw predictions keep them."
  },

  /* ---- ex02: Pratima Sherpa, query_id fdf552274e694b7e (matches the paper's Fig. 4) ---- */
  {
    id: "ex02",
    category: "Sports",
    image: "static/images/examples/ex02_sherpa.jpg",
    article: {
      title: "Pratima Sherpa: The meeting with Tiger Woods 'I'll never forget'",
      date: "2018-06-01",
      source: "CNN",
      url: "https://www.cnn.com/2018/06/01/golf/pratima-sherpa-golf-nepal-tiger-woods-spt-intl/index.html",
      snippet: "Sherpa, Nepal's No. 1 ranked female golfer, lives with her parents in a shed on the fourth hole of the Royal Nepal Golf Club in Kathmandu. She first played with wooden clubs her father whittled from a tree, and recently met her idol Tiger Woods in the US."
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
      baseline: { text: "In this intimate snapshot, Pratima Sherpa, Nepal's No. 1 ranked female golfer, is shown in her humble abode, a small shed on the fourth hole of the Royal Nepal Golf Club in Kathmandu. Her family, including her parents, who are greenkeepers at the club, are busy preparing dinner, with Pratima's mother peeling potatoes on the floor. The image offers a glimpse into the daily life of this remarkable teenager, who has overcome challenges to pursue her passion for golf, including meeting her idol Tiger Woods and competing in international tournaments. three or four hours the LPGA Tour The past few years Here is the." },
      vgcap:    { text: "This image captures Pratima Sherpa, Nepal's top-ranked female golfer, along with her family in their modest home, a shed located on the fourth hole of the Royal Nepal Golf Club in Kathmandu. Pratima, seated on the bed, wears casual attire, while her mother, dressed in an orange sweater and yellow pants, peels potatoes into a metal pan on the floor. The room is sparsely furnished, with a wooden cabinet dominating the background, and a single desk lamp providing the only illumination. This image underscores Sherpa's humble beginnings and her family's support, highlighting the challenges they face while nurturing her golfing dreams. the Tiger Woods." },
      reference: null
    },
    note: "The unfiltered caption ends in an incoherent run of article entities (“three or four hours the LPGA Tour The past few years Here is the.”) and even leaks the literal instruction artifact “Here is the.” The filtered caption instead describes the orange sweater and the sparse interior — though it too tacks on a stray “the Tiger Woods.” fragment at the very end, which the paper's printed figure cropped off."
  },

  /* ---- ex03..ex06: real VG-Cap predictions from static/submission.csv.
   * No baseline/reference caption available yet (submission.csv only has the
   * final VG-Cap output) — PROVIDE once the retrieved article is crawled
   * (see article_id columns in submission.csv for each query_id below). ---- */
  {
    id: "ex03",
    category: "Security",
    image: "static/images/examples/491d3ee2a718f335.jpg",
    article: {
      title: "Deadly attacks in Germany have targeted public life",
      date: "2016-12-20",
      source: "CNN",
      url: "https://www.cnn.com/2016/12/20/europe/germany-terror-attacks-2016/index.html",
      snippet: "SWAT officers secure a building in Munich following threats of suicide bombings at a train station."
    },
    entities: [
      { text: "Munich",                          type: "GPE",   status: "kept" },
      { text: "Germany",                          type: "GPE",   status: "kept" },
      { text: "Berlin",                           type: "GPE",   status: "introduced" },
      { text: "Christmas market truck assault",   type: "EVENT", status: "introduced" }
    ],
    captions: {
      baseline:  { text: "A group of SWAT officers in tactical gear stands guard outside a building, cordoned off by police tape, in an urban environment, possibly a train station, in Munich, Germany. The officers, equipped with helmets, vests, and various gear, appear to be monitoring the area, suggesting an active police operation. This image is connected to the news story about the foiled terror plot at a train station in Munich, where authorities received \"concrete information\" of potential terror attacks. The scene conveys a sense of caution, vigilance, and preparedness, highlighting the level of security measures taken to ensure public safety in the wake of multiple Germany." },
      vgcap:     { text: "SWAT officers in tactical gear stand guard outside a building with an open door, cordoned off by red and white police tape reading \"POLIZEI ABSPERRUNG,\" in an urban environment. Equipped with helmets, vests marked \"POLIZEI\" and \"GOLZ,\" and armed with weapons, the officers are monitoring the area, with one officer in a ready position. This scene reflects an active police operation following threats of suicide bombings at a train station in Munich earlier in the year. The heightened security measures underscore Germany's ongoing struggle against terrorism, including recent attacks like the Christmas market truck assault in Berlin that left 12 dead and dozens injured." },
      reference: null
    },
    note: "The unfiltered caption ends in an incomplete fragment (“...in the wake of multiple Germany.”). Berlin / Christmas market truck assault appear only in VG-Cap's post-generation enrichment — marked “introduced” rather than “kept” since they're not present in the unfiltered run at all; treat that status as approximate until the real article is crawled."
  },
  {
    id: "ex04",
    category: "Sports",
    image: "static/images/examples/6c4b34a839beed36.jpg",
    article: {
      title: "Tiger Woods' US team stages late rally in Presidents Cup",
      date: "2019-12-13",
      source: "CNN",
      url: "https://www.cnn.com/2019/12/13/golf/presidents-cup-tiger-woods-day-two-spt-intl/index.html",
      snippet: "Tiger Woods and Justin Thomas celebrate a Presidents Cup win over An Byeong-hun and Hideki Matsuyama."
    },
    entities: [
      { text: "Tiger Woods",       type: "PERSON", status: "kept" },
      { text: "Justin Thomas",     type: "PERSON", status: "kept" },
      { text: "An Byeong-hun",     type: "PERSON", status: "kept" },
      { text: "Hideki Matsuyama",  type: "PERSON", status: "kept" },
      { text: "South Korea",       type: "GPE",    status: "kept" },
      { text: "Japan",             type: "GPE",    status: "kept" },
      { text: "Presidents Cup",    type: "EVENT",  status: "kept" },
      { text: "Melbourne",         type: "GPE",    status: "kept" },
      { text: "Royal Melbourne",   type: "FAC",    status: "kept" },
      { text: "Ryder Cup",         type: "EVENT",  status: "removed" }
    ],
    captions: {
      baseline:  { text: "Tiger Woods and Justin Thomas share a moment of jubilation on the golf course at Royal Melbourne, Australia, after their win in the second match of the Presidents Cup. The duo's 1-up victory over South Korea's An Byeong-hun and Japan's Hideki Matsuyama marked a crucial turnaround for the United States team, narrowing the gap with the International side to 6½-3½. As captain, Woods praised his team's resilience, saying, \"At one point it looked pretty bleak, but the guys turned it around.\" The US team's momentum is now building, with eight more matches scheduled for Saturday before the singles matches on Sunday. the Ryder Cup." },
      vgcap:     { text: "Tiger Woods (right) and Justin Thomas celebrate their victory over South Korea's An Byeong-hun and Japan's Hideki Matsuyama in their second match at the Presidents Cup in Melbourne, Australia. The United States duo's triumph narrowed the gap between the U.S. and International teams to 6½-3½ after a strong showing by the International side earlier in the day. Surrounded by a cheering crowd at Royal Melbourne, the pair's joyful reaction underscores the turning point in the tournament, as the U.S. team began to rally from a significant deficit. Captain Tiger Woods praised his team's resilience, highlighting their determination and performance as pivotal in maintaining hopes." },
      reference: null
    },
    note: "The unfiltered caption tacks on a stray, wrong-tournament “the Ryder Cup” at the very end (this is a Presidents Cup match) — a clean example of the scorer correctly rejecting an irrelevant/hallucinated entity. VG-Cap's own ending (“...maintaining hopes.”) is still a bit vague; worth tightening once the source article is crawled."
  },
  {
    id: "ex05",
    category: "Sports",
    image: "static/images/examples/a13fb89528e3dc0d.jpg",
    article: {
      title: "Rio Olympics: Torch touches down in Brazil",
      date: "2016-05-03",
      source: "CNN",
      url: "https://www.cnn.com/2016/05/03/sport/rio-olympics-torch-arrival/index.html",
      snippet: "Brazilian sailor Felipe Rondina carries the Olympic flame across Lake Paranoa ahead of the Rio 2016 Games."
    },
    entities: [
      { text: "Felipe Rondina",         type: "PERSON", status: "kept" },
      { text: "Lake Paranoa",           type: "FAC",    status: "kept" },
      { text: "Brazil",                 type: "GPE",    status: "kept" },
      { text: "Rio 2016",               type: "EVENT",  status: "kept" },
      { text: "Greece",                 type: "GPE",    status: "introduced" },
      { text: "President Dilma Rousseff", type: "PERSON", status: "removed" },
      { text: "Hanan Khaled Daggah",    type: "PERSON", status: "removed" },
      { text: "Brasilia",               type: "GPE",    status: "removed" }
    ],
    captions: {
      baseline:  { text: "Brazilian sailor Felipe Rondina carries the Olympic flame on a speedboat at Lake Paranoa, as part of the torch's 95-day journey across Brazil. The flame, lit by President Dilma Rousseff, will be carried by 12,000 relay runners and visit over 300 towns and cities, giving 90% of Brazilians the opportunity to witness the historic tour. The Olympic torch's arrival in Brazil marks the beginning of a significant cultural and symbolic event, which aims to highlight the plight of refugees worldwide, including Hanan Khaled Daggah, a 12-year-old Syrian refugee who carried the torch in Brasilia. the countryThe Games The Rio 2016 Games the past couple." },
      vgcap:     { text: "Brazilian sailor Felipe Rondina carries the Olympic flame on a speedboat at Lake Paranoa, as part of the torch's 95-day journey across Brazil leading up to the Rio 2016 Games. Rondina, along with security personnel, navigates the calm waters, symbolizing Brazil's enthusiasm and readiness for the upcoming Olympics despite facing numerous challenges including economic recession and political instability. This leg of the torch relay highlights the scenic beauty of Brazil and showcases the country's commitment to hosting a memorable event. The Olympic flame, which began its journey in Greece, will visit over 300 towns and cities, giving millions of Brazilians the chance to participate." },
      reference: null
    },
    note: "The unfiltered caption pulls in a different torchbearer (Hanan Khaled Daggah, a Syrian refugee who carried the torch in Brasilia — not the person depicted in this image) and President Dilma Rousseff, then collapses into a garbled run-on (“...the countryThe Games The Rio 2016 Games the past couple.”). VG-Cap drops both ungrounded people and stays on the depicted subject, Rondina."
  },
  {
    id: "ex06",
    category: "Politics",
    image: "static/images/examples/feaf678be7c8aae1.jpg",
    article: {
      title: "Vice President Harris to travel to Poland and Romania",
      date: "2022-03-04",
      source: "CNN",
      url: "https://www.cnn.com/2022/03/04/politics/kamala-harris-romania-poland/index.html",
      snippet: "Vice President Kamala Harris addresses the 2022 Munich Security Conference on the U.S. and NATO response to Russia's invasion of Ukraine."
    },
    entities: [
      { text: "Kamala Harris",               type: "PERSON", status: "kept" },
      { text: "Munich Security Conference",  type: "EVENT",  status: "kept" },
      { text: "Munich",                      type: "GPE",    status: "kept" },
      { text: "Germany",                     type: "GPE",    status: "kept" },
      { text: "Ukraine",                     type: "GPE",    status: "kept" },
      { text: "NATO",                        type: "ORG",    status: "kept" },
      { text: "Amaury Lacroix",              type: "ORG",    status: "kept" },
      { text: "Russia",                      type: "GPE",    status: "introduced" },
      { text: "Poland",                      type: "GPE",    status: "introduced" },
      { text: "Romania",                     type: "GPE",    status: "introduced" },
      { text: "White House",                 type: "ORG",    status: "removed" },
      { text: "European Union",              type: "ORG",    status: "removed" }
    ],
    captions: {
      baseline:  { text: "Vice President Kamala Harris delivers a speech at the 2022 Munich Security Conference in Munich, Germany, on February 19, 2022. The event is a prominent international gathering where leaders discuss global security issues, and Harris' presence highlights the US' commitment to international cooperation and support for Ukraine. Her serious and attentive expression underscores the gravity of the topic, as she addresses the audience and speaks into microphones. The image's corporate or sponsored event background features the logos of Amaury Lacroix and msc, indicating a possible corporate or sponsored event. the Munich Security Conference the White House the NATO Alliance the European Union Here is." },
      vgcap:     { text: "Vice President Kamala Harris addresses the 2022 Munich Security Conference in Munich, Germany, on February 19, 2022, speaking into microphones while dressed in a professional dark suit with an elegant blouse. Her serious and attentive expression underscores the gravity of her remarks, which likely focused on the U.S. and NATO's response to Russia's invasion of Ukraine. The backdrop features the logos of the Amaury Lacroix and msc organizations, indicating a corporate-sponsored event. Following this conference, Harris will travel to Poland and Romania from March 8 to 11 to further demonstrate U.S. support for Ukraine and its allies in the face of ongoing Russian aggression." },
      reference: null
    },
    note: "“Amaury Lacroix” is in both versions, so it's a real extracted entity (likely a misread sponsor/backdrop logo, not necessarily wrong) rather than a VG-Cap hallucination — worth verifying against the real article. The unfiltered caption tacks on a bare list of rejected institutions (White House, NATO Alliance, European Union) and the literal leaked phrase “Here is.” at the very end; VG-Cap avoids that and instead adds concrete, verifiable detail (Harris's onward trip to Poland and Romania)."
  }
];

/* Teaser shown at the top of the page: ONE strong "many entities -> few grounded"
 * example, same schema as above (entities with status are the key part).
 * null -> placeholder. */
window.VGCAP.teaser = null;
