import { C, PAGE_W, PAGE_H, M, FRAME, CW } from './tokens.js'
import { filled, hline, vline, roundRect, txt, wrap } from './helpers.js'

const cx = PAGE_W / 2

function rule(doc, y, indent = 14, color = C.borderLight, lw = 0.3) {
  hline(doc, FRAME + indent, PAGE_W - FRAME - indent, y, color, lw)
}

// ─── Page 1: Cover — exactly matching the reference image ────────────────────
// Layout (top to bottom):
//   • Contact info small at very top
//   • AMBRIA circular logo badge center-top
//   • "Order Summary" large italic white center
//   • "Prepared exclusively for" + client name + date
//   • Contact info at very bottom
export function drawCoverPage(doc, eventInfo, bgBase64, logoBase64) {

  // ── Full-bleed background photo ───────────────────────────────────────────
  if (bgBase64) {
    try {
      const fmt = bgBase64.startsWith('data:image/png') ? 'PNG'
                : bgBase64.startsWith('data:image/jpeg') || bgBase64.startsWith('data:image/jpg') ? 'JPEG'
                : 'JPEG'
      doc.addImage(bgBase64, fmt, 0, 0, PAGE_W, PAGE_H)
    } catch {
      filled(doc, 0, 0, PAGE_W, PAGE_H, '#1C1008')
    }
  } else {
    filled(doc, 0, 0, PAGE_W, PAGE_H, '#1C1008')
  }

  // ── Dark semi-transparent overlay so text is always readable ─────────────
  // jsPDF doesn't support true alpha fills, so we layer multiple dark rects
  // at reduced opacity by using GState if available, else a solid dark strip
  doc.setFillColor(10, 6, 4)
  doc.setGState && doc.setGState(new doc.GState({ opacity: 0.55 }))
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F')
  doc.setGState && doc.setGState(new doc.GState({ opacity: 1 }))

  // ── Dark gradient band at the bottom ─────────────────────────────────────
  filled(doc, 0, PAGE_H - 50, PAGE_W, 50, '#0A0604')

  // ── 1. Top contact line ───────────────────────────────────────────────────
  txt(doc, 'TO HOST YOU, CALL US: +91-8826399444 | +91-8800163444',
    cx, 10, { size: 6, color: '#CCCCCC', align: 'center' })
  txt(doc, 'CN13, SECTOR 27 DWARKA, NEW DELHI, DELHI 110061',
    cx, 15, { size: 5.5, color: '#AAAAAA', align: 'center' })

  // ── 2. AMBRIA logo badge ──────────────────────────────────────────────────
  const badgeY  = 52   // center Y
  const badgeR  = 16   // radius in mm

  if (logoBase64) {
    // Use the actual logo image — centered, proportional
    const logoW = 38
    const logoH = 16   // adjust based on logo aspect ratio
    try {
      doc.addImage(logoBase64, 'PNG', cx - logoW / 2, badgeY - logoH / 2, logoW, logoH)
    } catch {
      // fallback to drawn badge if image fails
      doc.setFillColor('#6B0E0E')
      doc.circle(cx, badgeY, badgeR, 'F')
      doc.setDrawColor('#A04040'); doc.setLineWidth(0.5)
      doc.circle(cx, badgeY, badgeR, 'S')
      txt(doc, 'AMBRIA', cx, badgeY - 1, { size: 10, font: 'bold', color: '#FFFFFF', align: 'center' })
      txt(doc, 'C U I S I N E S', cx, badgeY + 5.5, { size: 5, color: '#E8C8C0', align: 'center' })
    }
  } else {
    // Fallback: drawn dark maroon circle
    doc.setFillColor('#6B0E0E')
    doc.circle(cx, badgeY, badgeR, 'F')
    doc.setDrawColor('#A04040'); doc.setLineWidth(0.5)
    doc.circle(cx, badgeY, badgeR, 'S')
    txt(doc, 'AMBRIA', cx, badgeY - 1, { size: 10, font: 'bold', color: '#FFFFFF', align: 'center' })
    txt(doc, 'C U I S I N E S', cx, badgeY + 5.5, { size: 5, color: '#E8C8C0', align: 'center' })
  }

  // ── 3. "Order Summary" — large italic, center of page ────────────────────
  const summaryY = PAGE_H * 0.47
  txt(doc, 'Order Summary', cx, summaryY,
    { size: 32, font: 'bolditalic', color: '#FFFFFF', align: 'center' })

  // Thin decorative rule below
  hline(doc, cx - 38, cx + 38, summaryY + 6, '#C8A878', 0.4)

  // ── 4. "Prepared exclusively for" + client name + date ───────────────────
  txt(doc, 'Prepared exclusively for', cx, summaryY + 16,
    { size: 7.5, font: 'italic', color: '#D4C8B0', align: 'center' })

  const clientName = eventInfo.name ?? '—'
  txt(doc, clientName, cx, summaryY + 26,
    { size: 16, font: 'bolditalic', color: '#FFFFFF', align: 'center' })

  // Format date nicely: "13 July 2026"
  let dateStr = ''
  if (eventInfo.eventDate) {
    try {
      const d = new Date(eventInfo.eventDate)
      dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    } catch {
      dateStr = eventInfo.eventDate
    }
  }
  if (dateStr) {
    txt(doc, dateStr, cx, summaryY + 34,
      { size: 8, color: '#C8B898', align: 'center' })
  }

  // ── 5. Bottom contact ─────────────────────────────────────────────────────
  const bottomY = PAGE_H - 34
  hline(doc, 20, PAGE_W - 20, bottomY, '#7A5030', 0.4)
  txt(doc, 'TO HOST YOU, CALL US: +91-8826399444 | +91-8800163444',
    cx, bottomY + 8,
    { size: 7, font: 'bold', color: '#E8D0A0', align: 'center' })
  txt(doc, 'CN13, SECTOR 27 DWARKA, NEW DELHI, DELHI 110061',
    cx, bottomY + 15,
    { size: 6, color: '#B89060', align: 'center' })
}

// ─── Page 2: Info page — white paper texture + event details card + stats ─────
export function drawInfoPage(doc, eventInfo, totalDishes, totalQty, texBase64) {
  // Background: paper texture or cream fallback
  if (texBase64) {
    try {
      const fmt = texBase64.startsWith('data:image/png') ? 'PNG'
                : texBase64.startsWith('data:image/jpeg') || texBase64.startsWith('data:image/jpg') ? 'JPEG'
                : 'JPEG'
      doc.addImage(texBase64, fmt, 0, 0, PAGE_W, PAGE_H)
    } catch {
      filled(doc, 0, 0, PAGE_W, PAGE_H, C.cream)
    }
  } else {
    filled(doc, 0, 0, PAGE_W, PAGE_H, C.cream)
  }

  // Double maroon border frame
  doc.setDrawColor(C.borderFrame)
  doc.setLineWidth(1.2)
  doc.rect(FRAME, FRAME, PAGE_W - FRAME * 2, PAGE_H - FRAME * 2)
  doc.setDrawColor(C.border)
  doc.setLineWidth(0.4)
  doc.rect(FRAME + 2.5, FRAME + 2.5, PAGE_W - (FRAME + 2.5) * 2, PAGE_H - (FRAME + 2.5) * 2)

  // Brand header
  const topY = FRAME + 16
  txt(doc, 'AMBRIA', cx, topY, { size: 32, font: 'bold', color: C.heading, align: 'center' })
  txt(doc, 'C  U  I  S  I  N  E  S', cx, topY + 10, { size: 8, color: C.maroon, align: 'center' })
  hline(doc, FRAME + 26, PAGE_W - FRAME - 26, topY + 14, C.borderLight, 0.5)
  txt(doc, 'CURATED TO INDULGE , CRAFTED TO IMPRESS!', cx, topY + 19, { size: 6.5, color: C.muted, align: 'center' })

  // Occasion heading
  const occY = topY + 36
  txt(doc, (eventInfo.occasion ?? 'Event').toUpperCase(), cx, occY, { size: 22, font: 'bold', color: C.heading, align: 'center' })
  txt(doc, 'M E N U   O R D E R   C O N F I R M A T I O N', cx, occY + 10, { size: 7, color: C.maroon, align: 'center' })
  hline(doc, FRAME + 18, PAGE_W - FRAME - 18, occY + 14, C.borderLight, 0.35)

  // Event details card
  const cardX = FRAME + 8
  const cardW = PAGE_W - (FRAME + 8) * 2
  const cardY = occY + 20
  const ROW_H = 10

  const fields = [
    ['CLIENT',          eventInfo.name      ?? '—'],
    ['OCCASION',        eventInfo.occasion  ?? '—'],
    ['DATE',            eventInfo.eventDate ?? '—'],
    ['TIME',            eventInfo.eventTime || '—'],
    ['VENUE',           eventInfo.venue     ?? '—'],
    ['GUESTS',          String(eventInfo.guestCount ?? '—')],
    ['FOOD PREFERENCE', eventInfo.foodPref === 'nonveg' ? 'Non-Vegetarian' : 'Vegetarian'],
    ['CONTACT',         eventInfo.phone     ?? '—'],
    ['EMAIL',           eventInfo.email     ?? '—'],
  ]
  const cardH = fields.length * ROW_H + 10

  // White card on texture for readability
  filled(doc, cardX, cardY, cardW, cardH, '#FDFCFA')
  doc.setDrawColor(C.border)
  doc.setLineWidth(0.5)
  doc.rect(cardX, cardY, cardW, cardH)
  // Top accent strip
  filled(doc, cardX, cardY, cardW, 3, C.heading)

  const halfW  = cardW / 2
  const leftX  = cardX + 8
  const rightX = cardX + halfW + 8
  const labW   = 28

  fields.forEach(([label, value], i) => {
    const isLeft = i % 2 === 0
    const row    = Math.floor(i / 2)
    const ry     = cardY + 5 + row * ROW_H * 2 + 4
    const lx     = isLeft ? leftX : rightX
    if (row > 0 && isLeft) {
      hline(doc, cardX + 5, cardX + cardW - 5, ry - 2, C.creamBorder, 0.3)
    }
    txt(doc, label, lx,        ry,     { size: 5.5, font: 'bold', color: C.muted })
    txt(doc, value, lx + labW, ry + 6, { size: 8, font: 'bold', color: C.heading, maxW: halfW - labW - 10 })
  })
  vline(doc, cardX + halfW, cardY + 5, cardY + cardH - 5, C.creamBorder, 0.3)

  // Stats pills
  const statsY     = cardY + cardH + 14
  const pills      = [
    { n: String(totalDishes), label: 'Dish Types' },
    { n: String(totalQty),    label: 'Servings'   },
    { n: String(eventInfo.guestCount ?? 0), label: 'Guests' },
  ]
  const pillW      = 44
  const pillGap    = 10
  const pillTotalW = pills.length * pillW + (pills.length - 1) * pillGap
  const pillStartX = cx - pillTotalW / 2

  hline(doc, pillStartX - 4, pillStartX + pillTotalW + 4, statsY - 4, C.borderLight, 0.3)
  pills.forEach((p, i) => {
    const px = pillStartX + i * (pillW + pillGap)
    filled(doc, px, statsY, pillW, 16, '#FDFCFA')
    doc.setDrawColor(C.border)
    doc.setLineWidth(0.5)
    doc.rect(px, statsY, pillW, 16)
    filled(doc, px, statsY, pillW, 2.5, C.heading)
    txt(doc, p.n,     px + pillW / 2, statsY + 10,   { size: 14, font: 'bold', color: C.heading, align: 'center' })
    txt(doc, p.label, px + pillW / 2, statsY + 14.5, { size: 5,  color: C.muted,  align: 'center' })
  })
  hline(doc, pillStartX - 4, pillStartX + pillTotalW + 4, statsY + 20, C.borderLight, 0.3)

  // Bottom contact
  const bottomY = PAGE_H - FRAME - 20
  hline(doc, FRAME + 16, PAGE_W - FRAME - 16, bottomY, C.borderLight, 0.35)
  txt(doc, 'TO HOST YOU , CALL US : +91-8826399444  |  +91-8800163444', cx, bottomY + 7,  { size: 7, font: 'bold', color: C.heading, align: 'center' })
  txt(doc, 'F-20, Dwarka Link Road, Samalka, New Delhi 110061',         cx, bottomY + 13, { size: 6, color: C.muted, align: 'center' })
}

// ─── Menu pages header ────────────────────────────────────────────────────────
export function drawMenuPageHeader(doc, eventInfo) {
  const y = FRAME + 7
  txt(doc, 'AMBRIA CUISINES', cx, y + 3, { size: 8, font: 'bold', color: C.heading, align: 'center' })
  txt(doc,
    [(eventInfo.occasion ?? '').toUpperCase(), eventInfo.name ?? '', eventInfo.eventDate ?? ''].filter(Boolean).join('  ·  '),
    cx, y + 8, { size: 6, color: C.muted, align: 'center' })
  rule(doc, y + 11, 14, C.borderLight, 0.3)
  return y + 17
}

// ─── Page 2: Compact event info block (replaces full info page) ───────────────
// Draws a two-column info card + stat pills at the top of the first menu page
// Returns the Y position after the block so menu items can follow immediately.
export function drawCompactInfoBlock(doc, eventInfo, totalDishes, totalQty, addonCount = 0) {
  const cardX = FRAME + 8
  const cardW = PAGE_W - (FRAME + 8) * 2
  let y = FRAME + 20   // start below the page chrome header

  // ── Section title ───────────────────────────────────────────────────────────
  txt(doc, 'EVENT DETAILS', cx, y, { size: 7, font: 'bold', color: C.muted, align: 'center' })
  rule(doc, y + 3, 30, C.borderLight, 0.3)
  y += 8

  // ── Two-column info card ────────────────────────────────────────────────────
  const fields = [
    ['CLIENT',    eventInfo.name      ?? '—',   'OCCASION', eventInfo.occasion  ?? '—'],
    ['DATE',      eventInfo.eventDate ?? '—',   'TIME',     eventInfo.eventTime || '—'],
    ['VENUE',     eventInfo.venue     ?? '—',   'GUESTS',   String(eventInfo.guestCount ?? '—')],
    ['FOOD PREF', eventInfo.foodPref === 'nonveg' ? 'Non-Vegetarian' : 'Vegetarian',
                                                 'CONTACT',  eventInfo.phone ?? '—'],
  ]

  const ROW_H  = 9
  const cardH  = fields.length * ROW_H + 6
  const halfW  = cardW / 2
  const leftX  = cardX + 6
  const rightX = cardX + halfW + 6
  const labW   = 22

  filled(doc, cardX, y, cardW, cardH, '#FDFCFA')
  doc.setDrawColor(C.border); doc.setLineWidth(0.4)
  doc.rect(cardX, y, cardW, cardH)
  filled(doc, cardX, y, cardW, 2.5, C.heading)   // top accent strip
  vline(doc, cardX + halfW, y + 3, y + cardH - 3, C.creamBorder, 0.3)

  fields.forEach(([lbl1, val1, lbl2, val2], row) => {
    const ry = y + 4 + row * ROW_H
    if (row > 0) hline(doc, cardX + 4, cardX + cardW - 4, ry - 1, C.creamBorder, 0.2)
    txt(doc, lbl1, leftX,          ry + 1,   { size: 5, font: 'bold', color: C.muted })
    txt(doc, val1, leftX + labW,   ry + 5.5, { size: 7, font: 'bold', color: C.heading, maxW: halfW - labW - 10 })
    txt(doc, lbl2, rightX,         ry + 1,   { size: 5, font: 'bold', color: C.muted })
    txt(doc, val2, rightX + labW,  ry + 5.5, { size: 7, font: 'bold', color: C.heading, maxW: halfW - labW - 10 })
  })
  y += cardH + 6

  // ── Stat pills ──────────────────────────────────────────────────────────────
  const pills = [
    { n: String(totalDishes - addonCount), label: 'Menu Dishes' },
    { n: String(addonCount),               label: 'Extras'      },
    { n: String(totalQty),                 label: 'Servings'    },
    { n: String(eventInfo.guestCount ?? 0),label: 'Guests'      },
  ].filter(p => p.label !== 'Extras' || addonCount > 0)  // hide Extras pill if none
  const pillW      = 36
  const pillGap    = 6
  const pillStartX = cx - (pills.length * pillW + (pills.length - 1) * pillGap) / 2

  pills.forEach((p, i) => {
    const px = pillStartX + i * (pillW + pillGap)
    // Highlight the Extras pill in navy when present
    const isExtras = p.label === 'Extras'
    const accentColor = isExtras ? '#1D4E7B' : C.heading
    filled(doc, px, y, pillW, 13, '#FDFCFA')
    doc.setDrawColor(isExtras ? '#1D4E7B' : C.border); doc.setLineWidth(0.4)
    doc.rect(px, y, pillW, 13)
    filled(doc, px, y, pillW, 2, accentColor)
    txt(doc, p.n,     px + pillW / 2, y + 8.5,  { size: 11, font: 'bold', color: accentColor, align: 'center' })
    txt(doc, p.label, px + pillW / 2, y + 12,   { size: 4.5, color: C.muted, align: 'center' })
  })
  y += 18

  rule(doc, y, 14, C.borderLight, 0.3)
  return y + 6
}

// ─── Section heading ─────────────────────────────────────────────────────────
export function drawSectionHeading(doc, title, y) {
  const topY = y + 4
  txt(doc, title, cx, topY + 6, { size: 15, font: 'bolditalic', color: C.heading, align: 'center' })
  const titleW        = doc.getStringUnitWidth(title) * 15 / doc.internal.scaleFactor
  const gapFromCenter = titleW / 2 + 6
  hline(doc, FRAME + 14, cx - gapFromCenter, topY + 3.5, C.borderLight, 0.3)
  hline(doc, cx + gapFromCenter, PAGE_W - FRAME - 14, topY + 3.5, C.borderLight, 0.3)
  return topY + 14
}

// ─── Sub-heading ──────────────────────────────────────────────────────────────
export function drawSubHeading(doc, title, y) {
  txt(doc, title, cx, y + 4, { size: 7, font: 'bold', color: C.maroon, align: 'center' })
  return y + 9
}

// ─── Menu item ───────────────────────────────────────────────────────────────
export function drawMenuItem(doc, item, y) {
  const nameLines = wrap(doc, item.name, CW - 40)
  const descLines = item.description ? wrap(doc, item.description, CW - 50) : []
  const noteLines = item.notes       ? wrap(doc, `"${item.notes}"`, CW - 50) : []
  let rowY = y + 5

  doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(C.heading)
  doc.text(nameLines, cx, rowY, { align: 'center' })
  rowY += nameLines.length * 5.5

  if (descLines.length > 0) {
    doc.setFontSize(7); doc.setFont('helvetica', 'normal'); doc.setTextColor(C.muted)
    doc.text(descLines, cx, rowY, { align: 'center' })
    rowY += descLines.length * 4.2
  }
  if (noteLines.length > 0) {
    rowY += 1
    doc.setFontSize(6.5); doc.setFont('helvetica', 'italic'); doc.setTextColor(C.maroonMid)
    doc.text(noteLines, cx, rowY, { align: 'center' })
    rowY += noteLines.length * 4 + 1
  }
  const tags = []
  if (item.spiceLevel)          tags.push(`Spice: ${item.spiceLevel}`)
  if (item.servingSize)         tags.push(item.servingSize)
  if ((item.quantity ?? 1) > 1) tags.push(`x${item.quantity}`)
  if (item.priority === 1)      tags.push('High Priority')
  if (tags.length > 0) {
    rowY += 1
    txt(doc, tags.join('   ·   '), cx, rowY, { size: 6, color: C.maroon, align: 'center' })
    rowY += 5
  }
  return rowY + 4
}

// ─── Section end rule ────────────────────────────────────────────────────────
export function drawSectionRule(doc, y) {
  rule(doc, y, 14, C.borderLight, 0.25)
  return y + 8
}

// ─── Services & Charges ──────────────────────────────────────────────────────
export function drawServicesSection(doc, services, y) {
  y = drawSectionHeading(doc, 'Services & Charges', y)

  const OUTFITS = [
    { id: 'kurta-white',   label: 'White Kurta'    },
    { id: 'kurta-black',   label: 'Black Sherwani' },
    { id: 'vest-gold',     label: 'Gold Waistcoat' },
    { id: 'suit-navy',     label: 'Navy Suit'      },
    { id: 'pathani-beige', label: 'Beige Pathani'  },
    { id: 'indo-maroon',   label: 'Maroon Indo'    },
  ]
  const VENDORS = [
    { id: 'mcdonalds',   label: "McDonald's",  price: 5000 },
    { id: 'dominos',     label: "Domino's",    price: 4000 },
    { id: 'haldirams',   label: 'Haldirams',   price: 3500 },
    { id: 'bikanervala', label: 'Bikanervala', price: 3000 },
    { id: 'subway',      label: 'Subway',      price: 3500 },
    { id: 'kfc',         label: 'KFC',         price: 5500 },
  ]
  const PLATES = [
    { id: 'steel', price: 30 }, { id: 'ceramic', price: 60 },
    { id: 'bone-china', price: 100 }, { id: 'melamine', price: 45 }, { id: 'disposable', price: 0 },
  ]

  const waiterCharge   = Number(services.waiterCharge   || 0)
  const outfitCharge   = Number(services.outfitCharge   || 0)
  const crockeryCharge = Number(services.crockeryCharge || 0)
  const vendorCharge   = Number(services.vendorCharge   || 0)
  const total          = waiterCharge + outfitCharge + crockeryCharge + vendorCharge

  const selectedOutfits = (services.outfits || []).map(id => OUTFITS.find(o => o.id === id)?.label ?? id)
  const selectedVendors = (services.vendors || []).map(id => {
    const v = VENDORS.find(v => v.id === id); return v ? `${v.label} (Rs.${v.price.toLocaleString('en-IN')})` : id
  })
  const paidCrockerySections = Object.values(services.crockery || {})
    .filter(pid => (PLATES.find(p => p.id === pid)?.price ?? 0) > 0).length

  const chargeRows = [
    ['Waiter Charges',   `${services.waiters ?? 0} waiters (ratio ${services.ratio ?? '-'})`, `Rs.${waiterCharge.toLocaleString('en-IN')}`],
    ['Outfit Charges',   selectedOutfits.length > 0 ? selectedOutfits.join(', ') : 'None',    `Rs.${outfitCharge.toLocaleString('en-IN')}`],
    ['Crockery Charges', crockeryCharge > 0 ? `${paidCrockerySections} paid section(s)` : 'All free', `Rs.${crockeryCharge.toLocaleString('en-IN')}`],
    ['Vendor Charges',   selectedVendors.length > 0 ? selectedVendors.join(', ') : 'None',    `Rs.${vendorCharge.toLocaleString('en-IN')}`],
  ]

  const tableX = M + 12; const tableW = CW - 24; const ROW_H = 10
  const labelW = tableW * 0.35; const detailW = tableW * 0.40

  filled(doc, tableX, y, tableW, 8, C.heading)
  txt(doc, 'SERVICE', tableX + 4,          y + 5.5, { size: 6, font: 'bold', color: '#FFFFFF' })
  txt(doc, 'DETAILS', tableX + labelW + 4, y + 5.5, { size: 6, font: 'bold', color: '#FFFFFF' })
  txt(doc, 'CHARGE',  tableX + tableW - 4, y + 5.5, { size: 6, font: 'bold', color: '#FFFFFF', align: 'right' })
  y += 8

  chargeRows.forEach(([label, detail, amount], i) => {
    const bg = i % 2 === 0 ? '#FFFFFF' : C.creamDark
    filled(doc, tableX, y, tableW, ROW_H, bg)
    hline(doc, tableX, tableX + tableW, y + ROW_H, C.creamBorder, 0.2)
    txt(doc, label,  tableX + 4,           y + 6.5, { size: 7.5, font: 'bold', color: C.heading })
    txt(doc, detail, tableX + labelW + 4,  y + 6.5, { size: 6.5, color: C.muted, maxW: detailW - 8 })
    txt(doc, amount, tableX + tableW - 4,  y + 6.5, { size: 7.5, font: 'bold', color: C.heading, align: 'right' })
    y += ROW_H
  })

  filled(doc, tableX, y, tableW, 11, C.heading)
  txt(doc, 'TOTAL CHARGES', tableX + 4, y + 7, { size: 8, font: 'bold', color: '#FFFFFF' })
  txt(doc, `Rs.${total.toLocaleString('en-IN')}`, tableX + tableW - 4, y + 7, { size: 10, font: 'bold', color: '#FFD0D0', align: 'right' })
  y += 11

  doc.setDrawColor(C.borderLight); doc.setLineWidth(0.3)
  doc.rect(tableX, y - (chargeRows.length * ROW_H) - 19, tableW, chargeRows.length * ROW_H + 19)

  return y + 10
}

// ─── Extras / Add-on section heading ─────────────────────────────────────────
// Distinct from drawSectionHeading — uses a blue-tinted banner to signal extras
export function drawExtrasHeading(doc, y) {
  const BLUE = '#1D4E7B'   // dark navy — prints well on cream
  const headH = 9

  filled(doc, FRAME + 14, y, PAGE_W - (FRAME + 14) * 2, headH, BLUE)
  txt(doc, '✦  EXTRAS ADDED  ✦', cx, y + 6, { size: 7.5, font: 'bold', color: '#FFFFFF', align: 'center' })
  return y + headH + 4
}

// ─── Extras item — same layout as drawMenuItem but with a subtle blue left rule
export function drawExtrasItem(doc, item, y) {
  // Blue rule on the left margin
  const BLUE = '#1D4E7B'
  hline(doc, FRAME + 6, FRAME + 9, y + 1, BLUE, 1.0)   // tiny vertical hint (actually a thick hline acting as a left stripe)
  doc.setDrawColor(BLUE)
  doc.setLineWidth(1.2)
  doc.line(FRAME + 7.5, y + 1, FRAME + 7.5, y + 12)
  doc.setLineWidth(0.4)

  return drawMenuItem(doc, item, y)
}
// ─── Closing note ────────────────────────────────────────────────────────────
export function drawClosingNote(doc, y) {
  rule(doc, y, 28, C.borderLight, 0.3); y += 8
  txt(doc, 'Thank you for choosing Ambria Cuisines',                              cx, y,      { size: 9, font: 'bolditalic', color: C.heading, align: 'center' })
  txt(doc, 'Our team will be in touch to confirm the final details of your order.', cx, y + 6,  { size: 7, color: C.muted,    align: 'center' })
  txt(doc, 'Curated to Indulge, Crafted to Impress!',                             cx, y + 12, { size: 7, font: 'italic', color: C.maroon, align: 'center' })
  return y + 18
}
