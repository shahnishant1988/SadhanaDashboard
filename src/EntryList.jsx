import './EntryList.css'

function formatDate(iso) {
  const d = new Date(iso + 'T12:00:00')
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function getActivityStyle(id, activities) {
  const a = activities.find((x) => x.id === id)
  return a ? a.color : ''
}

function EntryList({ entries, onDelete, activities }) {
  if (entries.length === 0) {
    return (
      <div className="entry-list empty">
        <p>No entries yet. Log your first hour above.</p>
      </div>
    )
  }

  return (
    <ul className="entry-list">
      {entries.map((entry) => (
        <li key={entry.id} className={`entry-item ${getActivityStyle(entry.activity, activities)}`}>
          <div className="entry-main">
            <span className="entry-activity">
              {activities.find((a) => a.id === entry.activity)?.label ?? entry.activity}
            </span>
            <span className="entry-hours">{entry.hours} hr</span>
            <span className="entry-date">{formatDate(entry.date)}</span>
          </div>
          {entry.note && <div className="entry-note">{entry.note}</div>}
          <button
            type="button"
            className="entry-delete"
            onClick={() => onDelete(entry.id)}
            title="Remove entry"
            aria-label="Remove entry"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  )
}

export default EntryList
