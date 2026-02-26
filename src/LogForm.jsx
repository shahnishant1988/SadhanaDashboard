import { useState, useRef, useEffect } from 'react'
import './LogForm.css'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function LogForm({ activity, onSubmit, existingNames = [] }) {
  const [name, setName] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [hours, setHours] = useState('')
  const [date, setDate] = useState(todayStr())
  const [note, setNote] = useState('')
  const nameInputRef = useRef(null)
  const listRef = useRef(null)

  const nameLower = name.trim().toLowerCase()
  const suggestions = existingNames.filter((n) =>
    n.toLowerCase().includes(nameLower)
  )

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
    const h = parseFloat(hours)
    if (!Number.isFinite(h) || h <= 0) return
    onSubmit(activity, h, date, note, name.trim())
    setName('')
    setHours('')
    setDate(todayStr())
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
      <div className="form-row">
        <label className="field">
          <span>Hours</span>
          <input
            type="number"
            step="0.25"
            min="0.25"
            max="24"
            placeholder="e.g. 1.5"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            required
          />
        </label>
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
      <button type="submit" className="submit-btn">
        Add entry
      </button>
    </form>
  )
}

export default LogForm
