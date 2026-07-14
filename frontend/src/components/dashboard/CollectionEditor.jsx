import { useState } from 'react'

const inputStyle = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: '0.5rem',
  border: '1px solid rgba(201,168,76,0.2)',
  background: 'var(--surface-5)',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
}

export default function CollectionEditor({ openKey, colData, colLoading, colSaving, onBack, onSave, onColDataChange }) {
  const [editingItem,    setEditingItem]    = useState(null)
  const [itemForm,       setItemForm]       = useState({ name: '', description: '' })
  const [addingSection,  setAddingSection]  = useState(false)
  const [newSectionName, setNewSectionName] = useState('')

  function renameSection(idx, name) {
    const sections = [...colData.sections]
    sections[idx] = { ...sections[idx], section: name }
    onColDataChange({ ...colData, sections })
  }

  function deleteSection(idx) {
    if (!confirm('Delete this section and all its items?')) return
    onColDataChange({ ...colData, sections: colData.sections.filter((_, i) => i !== idx) })
  }

  function addSection() {
    if (!newSectionName.trim()) return
    onColDataChange({ ...colData, sections: [...colData.sections, { section: newSectionName.trim(), items: [] }] })
    setNewSectionName('')
    setAddingSection(false)
  }

  function startEditItem(secIdx, itemIdx) {
    const item = colData.sections[secIdx].items[itemIdx]
    setEditingItem({ secIdx, itemIdx })
    setItemForm({ name: item.name, description: item.description })
  }

  function startAddItem(secIdx) {
    setEditingItem({ secIdx, itemIdx: -1 })
    setItemForm({ name: '', description: '' })
  }

  function saveItem() {
    if (!itemForm.name.trim()) return
    const { secIdx, itemIdx } = editingItem
    const sections = colData.sections.map((sec, si) => {
      if (si !== secIdx) return sec
      const items = [...sec.items]
      if (itemIdx === -1) items.push({ name: itemForm.name.trim(), description: itemForm.description.trim() })
      else items[itemIdx] = { name: itemForm.name.trim(), description: itemForm.description.trim() }
      return { ...sec, items }
    })
    onColDataChange({ ...colData, sections })
    setEditingItem(null)
  }

  function deleteItem(secIdx, itemIdx) {
    const sections = colData.sections.map((sec, si) =>
      si !== secIdx ? sec : { ...sec, items: sec.items.filter((_, ii) => ii !== itemIdx) },
    )
    onColDataChange({ ...colData, sections })
    if (editingItem?.secIdx === secIdx && editingItem?.itemIdx === itemIdx) setEditingItem(null)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button
          onClick={onBack}
          className="px-3 py-2 rounded-xl text-sm font-semibold transition"
          style={{
            background: 'var(--surface-4)',
            border: '1px solid var(--border-soft)',
            color: 'var(--text-secondary)',
            fontFamily: 'Inter, sans-serif',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-5)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-4)'}
        >
          ← Back
        </button>
        <h2 className="text-xl font-black flex-1" style={{ color: 'var(--text-primary)' }}>
          {colData?.label ?? openKey}
        </h2>
        <button
          onClick={onSave}
          disabled={colSaving || colLoading}
          className="btn-gold px-5 py-2.5 rounded-xl text-sm disabled:opacity-60 disabled:transform-none disabled:shadow-none"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {colSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {colLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl animate-pulse"
              style={{ background: 'var(--surface-3)' }}
            />
          ))}
        </div>
      ) : colData && (
        <div className="space-y-4">
          {colData.sections.map((sec, si) => (
            <div
              key={si}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--surface-3)', border: '1px solid var(--border-soft)' }}
            >
              {/* Section header */}
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ background: 'var(--surface-4)', borderBottom: '1px solid var(--border-soft)' }}
              >
                <input
                  value={sec.section}
                  onChange={e => renameSection(si, e.target.value)}
                  className="flex-1 bg-transparent text-sm font-black uppercase tracking-widest outline-none"
                  style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
                />
                <button
                  onClick={() => deleteSection(si)}
                  className="text-xs font-bold px-2 py-1 rounded-lg transition"
                  style={{ color: '#f87171', background: 'transparent', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  ✕ Delete section
                </button>
              </div>

              {/* Items */}
              <div>
                {sec.items.map((item, ii) => (
                  <div
                    key={ii}
                    className="px-5 py-3 flex items-start gap-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  >
                    {editingItem?.secIdx === si && editingItem?.itemIdx === ii ? (
                      <div className="flex-1 space-y-2">
                        <input
                          value={itemForm.name}
                          onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Item name"
                          style={inputStyle}
                        />
                        <input
                          value={itemForm.description}
                          onChange={e => setItemForm(p => ({ ...p, description: e.target.value }))}
                          placeholder="Description"
                          style={inputStyle}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveItem}
                            className="btn-gold px-3 py-1.5 rounded-lg text-xs"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
                            style={{
                              background: 'var(--surface-5)',
                              border: '1px solid rgba(255,255,255,0.07)',
                              color: 'var(--text-secondary)',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div
                          className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                          style={{ background: 'var(--gold-dim)' }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button
                            onClick={() => startEditItem(si, ii)}
                            className="px-2 py-1 rounded-lg text-xs font-bold transition"
                            style={{
                              background: 'var(--surface-5)',
                              border: '1px solid rgba(255,255,255,0.07)',
                              color: 'var(--text-secondary)',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteItem(si, ii)}
                            className="px-2 py-1 rounded-lg text-xs font-bold transition"
                            style={{
                              background: 'rgba(239,68,68,0.08)',
                              border: '1px solid rgba(239,68,68,0.2)',
                              color: '#f87171',
                              fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {editingItem?.secIdx === si && editingItem?.itemIdx === -1 ? (
                  <div className="px-5 py-3 space-y-2">
                    <input
                      value={itemForm.name}
                      onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Item name *"
                      autoFocus
                      style={{ ...inputStyle, borderColor: 'rgba(201,168,76,0.35)' }}
                    />
                    <input
                      value={itemForm.description}
                      onChange={e => setItemForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="Description (optional)"
                      style={inputStyle}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveItem}
                        className="btn-gold px-3 py-1.5 rounded-lg text-xs"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
                        style={{
                          background: 'var(--surface-5)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          color: 'var(--text-secondary)',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startAddItem(si)}
                    className="w-full px-5 py-2.5 text-xs font-bold text-left transition"
                    style={{ color: 'var(--gold)', fontFamily: 'Inter, sans-serif' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    + Add item
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Add new section */}
          {addingSection ? (
            <div
              className="rounded-2xl p-4 flex gap-2"
              style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}
            >
              <input
                value={newSectionName}
                onChange={e => setNewSectionName(e.target.value)}
                placeholder="Section name e.g. Salad Station"
                autoFocus
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                onClick={addSection}
                className="btn-gold px-4 py-2 rounded-lg text-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Add
              </button>
              <button
                onClick={() => { setAddingSection(false); setNewSectionName('') }}
                className="px-3 py-2 rounded-lg text-sm font-bold transition"
                style={{
                  background: 'var(--surface-5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingSection(true)}
              className="w-full py-3 rounded-2xl text-sm font-bold transition"
              style={{
                background: 'transparent',
                border: '1px dashed rgba(201,168,76,0.2)',
                color: 'var(--text-muted)',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
                e.currentTarget.style.color = 'var(--gold)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(201,168,76,0.2)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }}
            >
              + Add Section
            </button>
          )}
        </div>
      )}
    </div>
  )
}
