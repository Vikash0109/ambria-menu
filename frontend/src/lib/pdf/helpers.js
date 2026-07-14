import { PAGE_H, PAGE_W, M, FRAME } from './tokens.js'

// ─── Primitives ───────────────────────────────────────────────────────────────

export function filled(doc, x, y, w, h, color) {
  // jsPDF setFillColor only accepts hex '#RRGGBB' or r,g,b numbers — never rgba
  if (typeof color === 'string' && color.startsWith('#')) {
    doc.setFillColor(color)
  } else {
    doc.setFillColor(color) // pass-through for r,g,b usage
  }
  doc.rect(x, y, w, h, 'F')
}

export function hline(doc, x1, x2, y, color, lw = 0.2) {
  doc.setDrawColor(color)
  doc.setLineWidth(lw)
  doc.line(x1, y, x2, y)
}

export function vline(doc, x, y1, y2, color, lw = 0.25) {
  doc.setDrawColor(color)
  doc.setLineWidth(lw)
  doc.line(x, y1, x, y2)
}

export function roundRect(doc, x, y, w, h, r, fillColor, strokeColor, lw = 0.3) {
  doc.setFillColor(fillColor)
  if (strokeColor) {
    doc.setDrawColor(strokeColor)
    doc.setLineWidth(lw)
    doc.roundedRect(x, y, w, h, r, r, strokeColor ? 'FD' : 'F')
  } else {
    doc.roundedRect(x, y, w, h, r, r, 'F')
  }
}

/**
 * Draw text with full options.
 * Returns number of lines printed.
 */
export function txt(doc, text, x, y, opts = {}) {
  const { size = 9, font = 'normal', color = '#292524', align = 'left', maxW } = opts
  doc.setFontSize(size)
  doc.setFont('helvetica', font)
  doc.setTextColor(color)
  if (maxW) {
    const lines = doc.splitTextToSize(String(text ?? ''), maxW)
    doc.text(lines, x, y, { align })
    return lines.length
  }
  doc.text(String(text ?? ''), x, y, { align })
  return 1
}

/** Split text to lines without drawing */
export function wrap(doc, text, maxW) {
  return doc.splitTextToSize(String(text ?? ''), maxW)
}

// ─── Page-overflow guard ──────────────────────────────────────────────────────
export function guard(doc, y, needed, onNewPage) {
  if (y + needed > PAGE_H - FRAME - 20) {
    doc.addPage()
    const newY = M + 4
    if (typeof onNewPage === 'function') onNewPage(doc, newY)
    return newY
  }
  return y
}
