import { useState } from 'react'
import './LogForm.css'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function LogForm({ activity, onSubmit }) {
  const [hours, setHours] = useState('')
  const [date, setDate] = useState(todayStr())
  const [note, setNote] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const h = parseFloat(hours)
    if (!Number.isFinite(h) || h <= 0) return
    onSubmit(activity, h, date, note)
    setHours('')
    setDate(todayStr())
    setNote('')
  }

  return (
    <form className="log-form" onSubmit={handleSubmit}>
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
