// ─── Design tokens ────────────────────────────────────────────────────────────

export const C = {
  // Ambria maroon palette (matches the physical menu)
  maroon:      '#7B1D1D',   // primary dark maroon
  maroonMid:   '#991B1B',   // slightly lighter maroon
  maroonLight: '#B91C1C',   // accent maroon

  // Warm cream background (matches parchment paper)
  cream:       '#FAF7F4',
  creamDark:   '#F0EBE3',
  creamBorder: '#E8E0D4',

  // Text
  white:       '#FFFFFF',
  heading:     '#5C0A0A',   // deep maroon for headings
  body:        '#3D1010',   // softer maroon for body text
  label:       '#7B1D1D',   // maroon for section labels
  muted:       '#A08080',   // muted maroon-gray
  faint:       '#C8B0B0',

  // Semantic
  red:         '#B91C1C',
  green:       '#15803D',
  amber:       '#B45309',
  gold:        '#B45309',
  goldBright:  '#D97706',

  // Structure
  border:      '#7B1D1D',   // maroon border
  borderLight: '#C9A0A0',   // light maroon border
  borderFrame: '#6B0E0E',   // deep frame border
}

export const PAGE_W   = 210
export const PAGE_H   = 297
export const M        = 14          // page margin mm
export const FRAME    = 8           // frame inset from page edge
export const CW       = PAGE_W - M * 2   // 182mm usable width

// ── Table column layout ───────────────────────────────────────────────────────
export const COL = {
  numX:      M + 1,
  nameX:     M + 9,
  nameMaxW:  94,
  qtyX:      M + 112,
  spiceX:    M + 128,
  spiceMaxW: 24,
  servingX:  M + 155,
  servingMaxW: 26,
  endX:      M + CW,
}
