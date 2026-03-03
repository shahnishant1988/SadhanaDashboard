import './Summary.css'

function Summary({ activities, totals, weekTotals, topPerformers = {} }) {
  return (
    <div className="summary">
      {activities.map(({ id, label, color }) => {
        const top = topPerformers[id] || []
        return (
          <div key={id} className={`summary-card ${color}`}>
            <span className="summary-label">{label}</span>
            <div className="summary-card-inner">
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
              {top.length > 0 && (
                <div className="summary-top">
                  <span className="summary-top-label">Top 3</span>
                  <ol className="summary-top-list">
                    {top.map(({ name, hours }) => (
                      <li key={name}>
                        <span className="summary-top-name">{name}</span>
                        <span className="summary-top-hours">{hours.toFixed(1)} hr</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Summary
