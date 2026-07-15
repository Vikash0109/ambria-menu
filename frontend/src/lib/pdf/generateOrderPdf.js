import { jsPDF } from 'jspdf'
import { C, M, CW, PAGE_W, PAGE_H, FRAME } from './tokens.js'
import { filled, hline, txt, wrap, guard } from './helpers.js'
import { drawPageChrome, drawFooter } from './chrome.js'
import {
  drawCoverPage,
  drawInfoPage,
  drawMenuPageHeader,
  drawCompactInfoBlock,
  drawSectionHeading,
  drawSubHeading,
  drawMenuItem,
  drawExtrasHeading,
  drawExtrasItem,
  drawSectionRule,
  drawServicesSection,
  drawClosingNote,
} from './sections.js'

// ─── Load image as base64 via fetch ──────────────────────────────────────────
async function loadImageAsBase64(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.startsWith('image/')) return null
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror  = reject
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────
export async function generateOrderPdf({ eventInfo, selectedItems, services }) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  // Normalise inputs — callers may omit these
  const items = Array.isArray(selectedItems) ? selectedItems : []
  const svc   = (services && typeof services === 'object') ? services : {}

  // Load background + logo + texture images in parallel
  const [bgBase64, texBase64, logoBase64] = await Promise.all([
    loadImageAsBase64('/cover-bg.png'),
    loadImageAsBase64('/texture.jpeg'),
    loadImageAsBase64('/logo.png'),
  ])

  // ── Page 1: Dark food-photo cover ─────────────────────────────────────────
  const primaryCount = items.filter(it => !it.isAddon).length
  const addonCount   = items.filter(it =>  it.isAddon).length
  const totalDishes  = items.length
  const totalQty     = items.reduce((s, it) => s + (it.quantity ?? 1), 0)
  drawCoverPage(doc, eventInfo, bgBase64, logoBase64)

  // ── Page 2: Full event summary page ──────────────────────────────────────
  doc.addPage()
  drawInfoPage(doc, eventInfo, totalDishes, totalQty, texBase64)

  // ── Page 3: Menu page — starts fresh ─────────────────────────────────────
  doc.addPage()
  drawPageChrome(doc, texBase64)
  let y = drawMenuPageHeader(doc, eventInfo)
  y = drawSectionHeading(doc, 'Selected Menu', y)

  // Split items into primary and addon (extra) groups
  const primaryItems = items.filter(it => !it.isAddon)
  const addonItems   = items.filter(it =>  it.isAddon)

  // ── Helper: render a group list ──────────────────────────────────────────
  function renderGroups(groupItems, drawItemFn) {
    const sorted = [...groupItems].sort((a, b) => (a.servingOrder ?? 0) - (b.servingOrder ?? 0))
    const groups = []
    const seen   = new Map()
    for (const item of sorted) {
      const cat = item.category || 'Other'
      if (!seen.has(cat)) { seen.set(cat, groups.length); groups.push({ category: cat, items: [] }) }
      groups[seen.get(cat)].items.push(item)
    }

    for (const group of groups) {
      if (y + 28 > PAGE_H - FRAME - 20) {
        doc.addPage(); drawPageChrome(doc, texBase64)
        y = drawMenuPageHeader(doc, eventInfo)
      }
      y = drawSectionHeading(doc, group.category, y)

      for (let i = 0; i < group.items.length; i++) {
        const item      = group.items[i]
        const nameLines = wrap(doc, item.name, CW - 40)
        const descLines = item.description ? wrap(doc, item.description, CW - 50) : []
        const noteLines = item.notes       ? wrap(doc, item.notes, CW - 50)       : []
        const tags      = [item.spiceLevel, item.servingSize, (item.quantity ?? 1) > 1 ? `x${item.quantity}` : ''].filter(Boolean)
        const itemH     = nameLines.length * 5.5
          + (descLines.length > 0 ? descLines.length * 4.2 + 2 : 0)
          + (noteLines.length > 0 ? noteLines.length * 4   + 2 : 0)
          + (tags.length      > 0 ? 6 : 0) + 10

        if (y + itemH > PAGE_H - FRAME - 20) {
          doc.addPage(); drawPageChrome(doc, texBase64)
          y = drawMenuPageHeader(doc, eventInfo)
          y = drawSectionHeading(doc, group.category + ' (cont.)', y)
        }

        y = drawItemFn(doc, item, y)

        if (i < group.items.length - 1) {
          hline(doc, PAGE_W / 2 - 20, PAGE_W / 2 + 20, y - 3, C.creamBorder, 0.2)
        }
      }
      y = drawSectionRule(doc, y)
    }
  }

  // ── 1. Primary menu items ────────────────────────────────────────────────
  renderGroups(primaryItems, drawMenuItem)

  // ── 2. Extras / add-on items (only if any exist) ─────────────────────────
  if (addonItems.length > 0) {
    if (y + 36 > PAGE_H - FRAME - 20) {
      doc.addPage(); drawPageChrome(doc, texBase64)
      y = drawMenuPageHeader(doc, eventInfo)
    }
    y = drawExtrasHeading(doc, y)
    renderGroups(addonItems, drawExtrasItem)
  }

  // ── Services & Charges ────────────────────────────────────────────────────
  const hasServices = Object.keys(svc).length > 0
  if (hasServices) {
    if (y + 100 > PAGE_H - FRAME - 20) {
      doc.addPage(); drawPageChrome(doc, texBase64)
      y = drawMenuPageHeader(doc, eventInfo)
    }
    y = drawServicesSection(doc, svc, y)
  }

  // ── Closing note ──────────────────────────────────────────────────────────
  if (y + 40 > PAGE_H - FRAME - 20) {
    doc.addPage(); drawPageChrome(doc, texBase64)
    y = drawMenuPageHeader(doc, eventInfo)
  }
  drawClosingNote(doc, y)

  // ── Footer on every page except cover (page 1) ────────────────────────────
  const totalPages = doc.getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    if (p > 1) drawFooter(doc, p, totalPages)
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const safe = s => (s ?? '').trim().replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase()
  const fileName = [
    'ambria_order',
    safe(eventInfo.name).slice(0, 20),
    safe(eventInfo.occasion).slice(0, 15),
    (eventInfo.eventDate ?? '').replace(/[^0-9\-]/g, '').slice(0, 10),
  ].filter(Boolean).join('_').replace(/_+/g, '_')

  doc.save(`${fileName}.pdf`)
}
