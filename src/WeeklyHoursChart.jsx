import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import './WeeklyHoursChart.css'

/** Get Sunday of the week for a given date string (YYYY-MM-DD), as YYYY-MM-DD */
function getWeekKey(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const day = d.getDay()
  const diff = d.getDate() - day
  d.setDate(diff)
  return d.toISOString().slice(0, 10)
}

/** Format week key as short label e.g. "2/17" */
function formatWeekLabel(weekKey) {
  const [y, m, d] = weekKey.split('-')
  return `${Number(m)}/${Number(d)}`
}

const WEEKS_TO_SHOW = 10

function WeeklyHoursChart({ entries }) {
  const byWeek = {}

  entries.forEach((e) => {
    const key = getWeekKey(e.date)
    if (!byWeek[key]) {
      byWeek[key] = { weekKey: key, weekLabel: formatWeekLabel(key), satsang: 0, sadhana: 0, total: 0 }
    }
    byWeek[key][e.activity] = (byWeek[key][e.activity] || 0) + e.hours
    byWeek[key].total += e.hours
  })

  const sortedKeys = Object.keys(byWeek).sort()
  const weeks = sortedKeys.slice(-WEEKS_TO_SHOW).map((k) => byWeek[k])

  if (weeks.length === 0) {
    return (
      <section className="chart-section">
        <h2>Weekly hours</h2>
        <div className="chart-placeholder">No data yet. Log hours to see the chart.</div>
      </section>
    )
  }

  return (
    <section className="chart-section">
      <h2>Weekly hours</h2>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={weeks}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="weekLabel"
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v} hr`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
              }}
              labelStyle={{ color: 'var(--muted)' }}
              labelFormatter={(label) => `Week of ${label}`}
              formatter={(value) => [`${Number(value).toFixed(1)} hr`, null]}
            />
            <Legend
              wrapperStyle={{ fontSize: '0.8125rem' }}
              formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <Bar dataKey="satsang" name="satsang" fill="var(--accent-satsang)" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="sadhana" name="sadhana" fill="var(--accent-sadhana)" radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default WeeklyHoursChart
