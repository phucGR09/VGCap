# VG-Cap — project page

Project page for **Grounding What Matters: Selective Entity Conditioning for Event-Enriched News Image Captioning** (MMM 2027).

## Preview locally

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000   # then open http://localhost:8000
```

## Where the content lives

| File | What it holds |
|---|---|
| `index.html` | Fixed paper text, authors, equations, section layout |
| `static/data/config.js` | `showPlaceholders`: set to `false` to hide every empty "provide this" slot |
| `static/data/results.js` | Paper numbers: SOTA table, ablation, entity statistics |
| `static/data/examples.js` | Qualitative examples and the teaser (schema documented at the top of the file) |
| `static/data/analysis.js` | Optional chart data: entity-gap histogram bins, caption-length histogram |
| `static/images/examples/` | Example images |
| `static/images/figures/` | Overview figure and paper figures |

The data files are plain `.js` (not `.json`), so the page also works when opened straight from disk.

### Link buttons

The Paper / arXiv / Code buttons in `index.html` have no `href` yet and show a "soon" badge.
Add `href="..."` to an `<a class="link-btn" data-link="...">` and the badge disappears.

## Deploy

Push to GitHub and enable **Settings → Pages → Deploy from branch** on the default branch (root folder).

## Credits

Adapted from the [Nerfies](https://github.com/nerfies/nerfies.github.io) project page template.
This website is licensed under a
[Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).
