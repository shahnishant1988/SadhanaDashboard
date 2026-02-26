import './Summary.css'

function Summary({ activities, totals, weekTotals }) {
  return (
    <div className="summary">
      {activities.map(({ id, label, color }) => (
        <div key={id} className={`summary-card ${color}`}>
          <span className="summary-label">{label}</span>
          <div className="summary-values">
            <div className="summary-total">
              <span className="value">{totals[id].toFixed(1)}</span>
              <span className="unit">hrs total</span>
            </div>
            <div className="summary-week">
              <span className="value">{weekTotals[id].toFixed(1)}</span>
              <span className="unit">this week</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Summary
