const PACIFIC = 'America/Los_Angeles'

/** Today's date as YYYY-MM-DD in Pacific (for date inputs) */
export function todayPacific() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: PACIFIC,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = formatter.formatToParts(new Date())
  const get = (type) => parts.find((p) => p.type === type)?.value ?? ''
  const year = get('year')
  const month = get('month')
  const day = get('day')
  return `${year}-${month}-${day}`
}

/** Format YYYY-MM-DD as US date (MM/DD/YYYY) */
export function formatDateUS(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  if (!y || !m || !d) return dateStr
  return `${m}/${d}/${y}`
}

/** Return 'Today', 'Yesterday', or US format (MM/DD/YYYY); uses Pacific for today/yesterday */
export function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  const today = todayPacific()
  const yesterday = new Date(today + 'T12:00:00')
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)
  if (dateStr === today) return 'Today'
  if (dateStr === yesterdayStr) return 'Yesterday'
  return formatDateUS(dateStr)
}
