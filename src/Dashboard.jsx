import { useState } from 'react'
import LogForm from './LogForm'
import Summary from './Summary'
import EntryList from './EntryList'
import './Dashboard.css'

const ACTIVITIES = [
  { id: 'satsang', label: 'Satsang', color: 'satsang' },
  { id: 'sadhana', label: 'Sadhana', color: 'sadhana' },
]

function Dashboard({ entries, onAddEntry, onDeleteEntry }) {
  const [selectedActivity, setSelectedActivity] = useState('satsang')

  const totals = ACTIVITIES.reduce((acc, { id }) => {
    acc[id] = entries
      .filter((e) => e.activity === id)
      .reduce((sum, e) => sum + e.hours, 0)
    return acc
  }, {})

  const thisWeek = entries.filter((e) => {
    const d = new Date(e.date)
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - now.getDay())
    start.setHours(0, 0, 0, 0)
    return d >= start
  })

  const weekTotals = ACTIVITIES.reduce((acc, { id }) => {
    acc[id] = thisWeek
      .filter((e) => e.activity === id)
      .reduce((sum, e) => sum + e.hours, 0)
    return acc
  }, {})

  return (
    <div className="dashboard">
      <section className="summary-section">
        <Summary
          activities={ACTIVITIES}
          totals={totals}
          weekTotals={weekTotals}
        />
      </section>

      <section className="log-section">
        <h2>Log hours</h2>
        <div className="activity-tabs">
          {ACTIVITIES.map(({ id, label, color }) => (
            <button
              key={id}
              type="button"
              className={`tab ${color} ${selectedActivity === id ? 'active' : ''}`}
              onClick={() => setSelectedActivity(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <LogForm
          activity={selectedActivity}
          onSubmit={onAddEntry}
        />
      </section>

      <section className="entries-section">
        <h2>Recent entries</h2>
        <EntryList
          entries={entries}
          onDelete={onDeleteEntry}
          activities={ACTIVITIES}
        />
      </section>
    </div>
  )
}

export default Dashboard
