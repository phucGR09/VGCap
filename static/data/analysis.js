/* =====================================================================
 * Optional analysis data — PROVIDE LATER.
 * Leave a value as null to show a placeholder (or the paper-figure fallback).
 * ===================================================================== */
window.VGCAP = window.VGCAP || {};

/* Per-caption entity gap histogram  (entities(VG-Cap) − entities(unfiltered)).
 * When null, the page shows the paper figure (entity_gap_distribution.svg).
 * Example:
 * window.VGCAP.entityGapBins = {
 *   bins:   [-14, -13, ..., 0, ..., 8],
 *   counts: [  1,   0, ..., 519, ..., 1]      // same length as bins, sums to 3000
 * };
 */
window.VGCAP.entityGapBins = null;
