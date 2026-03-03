import { useState, useRef, useEffect } from 'react'
import './LogForm.css'
import { todayPacific } from './dateUtils'

function LogForm({ onSubmit, existingNames = [] }) {
  const [name, setName] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [satsangHours, setSatsangHours] = useState('')
  const [sadhanaHours, setSadhanaHours] = useState('')
  const [date, setDate] = useState(todayPacific())
  const [note, setNote] = useState('')
  const nameInputRef = useRef(null)
  const listRef = useRef(null)

  const nameLower = name.trim().toLowerCase()
  const suggestions = existingNames.filter((n) =>
    n.toLowerCase().includes(nameLower)
  )

  const satsangVal = parseFloat(satsangHours)
  const sadhanaVal = parseFloat(sadhanaHours)
  const hasValidHours =
    (Number.isFinite(satsangVal) && satsangVal > 0) ||
    (Number.isFinite(sadhanaVal) && sadhanaVal > 0)

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        listRef.current?.contains(e.target) ||
        nameInputRef.current?.contains(e.target)
      )
        return
      setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const satsang = parseFloat(satsangHours)
    const sadhana = parseFloat(sadhanaHours)
    const satsangValid = Number.isFinite(satsang) && satsang > 0
    const sadhanaValid = Number.isFinite(sadhana) && sadhana > 0
    if (!satsangValid && !sadhanaValid) return

    const nameStr = name.trim()
    const dateStr = date || todayPacific()
    const noteStr = note.trim()

    if (satsangValid) onSubmit('satsang', Math.min(24, satsang), dateStr, noteStr, nameStr)
    if (sadhanaValid) onSubmit('sadhana', Math.min(24, sadhana), dateStr, noteStr, nameStr)

    setSatsangHours('')
    setSadhanaHours('')
    setDate(todayPacific())
    setNote('')
    setShowSuggestions(false)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
    setShowSuggestions(true)
    setActiveIndex(-1)
  }

  const handleNameFocus = () => {
    if (existingNames.length > 0) setShowSuggestions(true)
  }

  const handleSelectName = (selectedName) => {
    setName(selectedName)
    setShowSuggestions(false)
    setActiveIndex(-1)
    nameInputRef.current?.querySelector('input')?.focus()
  }

  const handleNameKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : i))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i > 0 ? i - 1 : -1))
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault()
      handleSelectName(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  return (
    <form className="log-form" onSubmit={handleSubmit}>
      <label className="field field-name" ref={nameInputRef}>
        <span>Your name</span>
        <input
          type="text"
          placeholder="e.g. Raj Doshi"
          value={name}
          onChange={handleNameChange}
          onFocus={handleNameFocus}
          onKeyDown={handleNameKeyDown}
          required
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul
            ref={listRef}
            className="name-suggestions"
            role="listbox"
            aria-label="Previous names"
          >
            {suggestions.map((n, i) => (
              <li
                key={n}
                role="option"
                aria-selected={i === activeIndex}
                className={i === activeIndex ? 'active' : ''}
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleSelectName(n)
                }}
              >
                {n}
              </li>
            ))}
          </ul>
        )}
      </label>
      <div className="form-row form-row-hours">
        <label className="field field-satsang">
          <span>Satsang hours</span>
          <input
            type="number"
            step="0.25"
            min="0"
            max="24"
            placeholder="0"
            value={satsangHours}
            onChange={(e) => setSatsangHours(e.target.value)}
          />
        </label>
        <label className="field field-sadhana">
          <span>Sadhana hours</span>
          <input
            type="number"
            step="0.25"
            min="0"
            max="24"
            placeholder="0"
            value={sadhanaHours}
            onChange={(e) => setSadhanaHours(e.target.value)}
          />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
      </div>
      <label className="field field-note">
        <span>Note (optional)</span>
        <input
          type="text"
          placeholder="e.g. morning session"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </label>
      <p className="form-hint">Enter at least one of Satsang or Sadhana hours.</p>
      <button type="submit" className="submit-btn" disabled={!hasValidHours}>
        Add entry
      </button>
    </form>
  )
}

export default LogForm
