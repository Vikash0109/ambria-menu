import { useMemo, useRef } from 'react'
import { cx } from '../../lib/utils.js'
import { sectionIcon, priorityMeta } from '../../constants/menuConfig.js'

export default function GroupedOrderList({ orderList, onReorder, onRemove, opts, sections, selected }) {
  const dragItem    = useRef(null)
  const dragSection = useRef(null)
  const overSection = useRef(null)

  const groups = useMemo(() => {
    const map = new Map()
    for (const key of orderList) {
      const [si]  = key.split('__').map(Number)
      const name  = sections[si]?.section ?? '—'
      if (!map.has(name)) map.set(name, { sectionName: name, icon: sectionIcon(name), keys: [] })
      map.get(name).keys.push(key)
    }
    return [...map.values()]
  }, [orderList, sections])

  function flattenGroups(grps) { return grps.flatMap(g => g.keys) }

  function itemName(key) {
    const [si, ii] = key.split('__').map(Number)
    return sections[si]?.items[ii]?.name ?? key
  }

  function onItemDragStart(e, gi, ii) {
    dragItem.current = { gi, ii }
    e.dataTransfer.effectAllowed = 'move'
    e.stopPropagation()
    e.currentTarget.style.opacity = '0.4'
  }
  function onItemDragEnd(e) {
    e.currentTarget.style.opacity = '1'
    dragItem.current = null
  }
  function onItemDragOver(e, gi, ii) {
    e.preventDefault(); e.stopPropagation()
    if (!dragItem.current || dragItem.current.gi !== gi || dragItem.current.ii === ii) return
    const newGroups = groups.map((g, idx) => {
      if (idx !== gi) return g
      const keys = [...g.keys]
      const [moved] = keys.splice(dragItem.current.ii, 1)
      keys.splice(ii, 0, moved)
      dragItem.current = { gi, ii }
      return { ...g, keys }
    })
    onReorder(flattenGroups(newGroups))
  }

  function onSectionDragStart(e, gi) {
    dragSection.current = gi
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.style.opacity = '0.5'
  }
  function onSectionDragEnd(e) {
    e.currentTarget.style.opacity = '1'
    dragSection.current = null
    overSection.current = null
  }
  function onSectionDragOver(e, gi) { e.preventDefault(); overSection.current = gi }
  function onSectionDrop(e, gi) {
    e.preventDefault()
    if (dragSection.current === null || dragSection.current === gi) return
    const ng = [...groups]
    const [m] = ng.splice(dragSection.current, 1)
    ng.splice(gi, 0, m)
    onReorder(flattenGroups(ng))
  }

  if (!orderList.length) {
    return (
      <div className="py-10 px-4 text-center">
        <svg className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--text-dim)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>No extras selected</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}>Browse the ADD-ON sections to add extras</p>
      </div>
    )
  }

  let globalIdx = 0

  return (
    <div className="py-1">
      {groups.map((group, gi) => (
        <div
          key={group.sectionName}
          draggable
          onDragStart={e => onSectionDragStart(e, gi)}
          onDragEnd={onSectionDragEnd}
          onDragOver={e => onSectionDragOver(e, gi)}
          onDrop={e => onSectionDrop(e, gi)}
          className="mb-0.5 last:mb-0"
        >
          {/* Section header */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 cursor-grab active:cursor-grabbing select-none"
            style={{
              background: 'var(--surface-4)',
              borderTop: '1px solid rgba(201,168,76,0.08)',
              borderBottom: '1px solid rgba(201,168,76,0.08)',
            }}
          >
            <svg className="w-3 h-3 shrink-0" style={{ color: 'var(--text-dim)' }} viewBox="0 0 12 12" fill="currentColor">
              <circle cx="4" cy="3" r="1"/><circle cx="8" cy="3" r="1"/>
              <circle cx="4" cy="6" r="1"/><circle cx="8" cy="6" r="1"/>
              <circle cx="4" cy="9" r="1"/><circle cx="8" cy="9" r="1"/>
            </svg>
            <span
              style={{
                width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, display: 'inline-block',
                background: group.icon,
                boxShadow: `0 0 6px ${group.icon}55`,
              }}
            />
            <span
              className="text-[11px] font-bold uppercase tracking-wider flex-1 truncate"
              style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
            >
              {group.sectionName}
            </span>
            <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
              {group.keys.length} dish{group.keys.length !== 1 ? 'es' : ''}
            </span>
          </div>

          {/* Items */}
          <div>
            {group.keys.map((key, ii) => {
              const o   = opts[key] ?? {}
              const pm  = o.priority ? priorityMeta(o.priority) : null
              const num = ++globalIdx
              return (
                <div
                  key={key}
                  draggable
                  onDragStart={e => onItemDragStart(e, gi, ii)}
                  onDragEnd={onItemDragEnd}
                  onDragOver={e => onItemDragOver(e, gi, ii)}
                  className="flex items-start gap-2 px-3 py-2.5 cursor-grab active:cursor-grabbing transition group"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                >
                  <svg className="w-3 h-3 shrink-0 mt-0.5" style={{ color: 'var(--text-dim)' }} viewBox="0 0 12 12" fill="currentColor">
                    <circle cx="4" cy="3" r="1"/><circle cx="8" cy="3" r="1"/>
                    <circle cx="4" cy="6" r="1"/><circle cx="8" cy="6" r="1"/>
                    <circle cx="4" cy="9" r="1"/><circle cx="8" cy="9" r="1"/>
                  </svg>
                  <span
                    className="text-[10px] font-bold w-4 shrink-0 mt-0.5"
                    style={{ color: 'var(--text-dim)', fontFamily: 'Inter, sans-serif' }}
                  >{num}.</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p
                        className="text-xs font-semibold leading-snug truncate"
                        style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}
                      >
                        {itemName(key)}
                      </p>
                      {(selected?.[key] ?? 1) > 1 && (
                        <span
                          className="shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none"
                          style={{ background: 'var(--gold)', color: '#0a0a0a' }}
                        >
                          ×{selected[key]}
                        </span>
                      )}
                    </div>
                    {(pm || o.spiceLevel || o.servingSize || o.notes) && (
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {pm && (
                          <span className={cx('text-[10px] font-bold px-1.5 py-0.5 rounded-full border', pm.color)}>
                            {pm.label}
                          </span>
                        )}
                        {o.spiceLevel  && <span className="text-[10px]" style={{ color: '#f87171' }}>{o.spiceLevel}</span>}
                        {o.servingSize && <span className="text-[10px]" style={{ color: 'var(--gold)' }}>{o.servingSize}</span>}
                        {o.notes       && <span className="text-[10px] truncate max-w-[8rem]" style={{ color: 'var(--text-muted)' }}>{o.notes}</span>}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onRemove(key)}
                    className="w-4 h-4 flex items-center justify-center rounded-full transition flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--text-dim)' }}
                    aria-label="Remove"
                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.background = 'transparent' }}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
