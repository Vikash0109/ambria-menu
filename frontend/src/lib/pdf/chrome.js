import { C, PAGE_W, PAGE_H, M, FRAME, CW } from './tokens.js'
import { filled, hline, txt } from './helpers.js'

// ─── Per-page chrome: white paper texture + maroon double border ──────────────
export function drawPageChrome(doc, texBase64) {
  if (texBase64) {
    // Texture image as full-bleed background
    try {
      const fmt = texBase64.startsWith('data:image/png') ? 'PNG'
                : texBase64.startsWith('data:image/jpeg') || texBase64.startsWith('data:image/jpg') ? 'JPEG'
                : 'JPEG'
      doc.addImage(texBase64, fmt, 0, 0, PAGE_W, PAGE_H)
    } catch {
      filled(doc, 0, 0, PAGE_W, PAGE_H, C.cream)
    }
  } else {
    // Fallback: plain cream fill
    filled(doc, 0, 0, PAGE_W, PAGE_H, C.cream)
  }

  // Outer maroon border
  doc.setDrawColor(C.borderFrame)
  doc.setLineWidth(1.2)
  doc.rect(FRAME, FRAME, PAGE_W - FRAME * 2, PAGE_H - FRAME * 2)

  // Inner thin border (double-frame effect)
  doc.setDrawColor(C.border)
  doc.setLineWidth(0.4)
  doc.rect(FRAME + 2.5, FRAME + 2.5, PAGE_W - (FRAME + 2.5) * 2, PAGE_H - (FRAME + 2.5) * 2)
}

// ─── Footer (on every page except cover) ─────────────────────────────────────
export function drawFooter(doc, page, total) {
  const y  = PAGE_H - FRAME - 3
  const cx = PAGE_W / 2

  hline(doc, FRAME + 6, PAGE_W - FRAME - 6, y - 5, C.borderLight, 0.3)

  txt(doc, 'AMBRIA CUISINES  ·  F-20, Dwarka Link Road, Samalka, New Delhi 110061', cx, y - 2,
    { size: 5.5, color: C.muted, align: 'center' })
  txt(doc, '+91-8826399444  |  +91-8800163444', cx, y + 2,
    { size: 5.5, color: C.muted, align: 'center' })

  txt(doc, `Page ${page} / ${total}`, PAGE_W - FRAME - 6, y,
    { size: 6, font: 'bold', color: C.maroon, align: 'right' })
}
