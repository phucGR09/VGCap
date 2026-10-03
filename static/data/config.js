/* =====================================================================
 * VG-Cap project page — global config
 * ---------------------------------------------------------------------
 * All page content that is NOT fixed paper text lives in static/data/*.js.
 * Files are plain JS (not .json) so the page also works when index.html
 * is opened directly from disk (browsers block fetch() of local JSON).
 * ===================================================================== */
window.VGCAP = window.VGCAP || {};

/* true  -> empty slots render as dashed cards telling you what to provide.
 * false -> empty slots are hidden (use this when publishing). */
window.VGCAP.showPlaceholders = true;
