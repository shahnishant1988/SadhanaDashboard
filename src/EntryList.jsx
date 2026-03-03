import './EntryList.css'
import { formatDateDisplay } from './dateUtils'

function getActivityStyle(id, activities) {
  const a = activities.find((x) => x.id === id)
  return a ? a.color : ''
}

function EntryList({ entries, activities }) {
  if (entries.length === 0) {
    return (
      <div className="entry-list empty">
        <p>No entries yet. Log your first hour above, or change the filter.</p>
      </div>
    )
  }

  return (
    <ul className="entry-list">
      {entries.map((entry) => (
        <li key={entry.id} className={`entry-item ${getActivityStyle(entry.activity, activities)}`}>
          <div className="entry-row">
            <div className="entry-left">
              {entry.name && <span className="entry-name">{entry.name}</span>}
              <span className="entry-activity">
                {activities.find((a) => a.id === entry.activity)?.label ?? entry.activity}
              </span>
              {entry.note && <span className="entry-note">{entry.note}</span>}
            </div>
            <div className="entry-right">
              <span className="entry-hours">{entry.hours} hr</span>
              <span className="entry-date">{formatDateDisplay(entry.date)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default EntryList
