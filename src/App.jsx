import { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import { supabase, TABLE } from './supabase'
import './App.css'

const STORAGE_KEY = 'sadhana-dashboard-entries'

function fromDb(row) {
  return {
    id: row.id,
    name: row.name || '',
    activity: row.activity,
    hours: Number(row.hours),
    date: row.date,
    note: row.note || '',
    createdAt: row.created_at,
  }
}

export function loadEntriesLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveEntriesLocal(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function App() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(!!supabase)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (supabase) {
      setLoading(true)
      setError(null)
      supabase
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data, error: e }) => {
          setLoading(false)
          if (e) {
            setError(e.message)
            setEntries(loadEntriesLocal())
            return
          }
          setEntries((data || []).map(fromDb))
        })
    } else {
      setEntries(loadEntriesLocal())
    }
  }, [])

  const addEntry = (activity, hours, date, note = '', name = '') => {
    const hoursNum = Math.max(0, Math.min(24, Number(hours) || 0))
    const dateStr = date || new Date().toISOString().slice(0, 10)
    const noteStr = (note || '').trim()
    const nameStr = (name || '').trim()

    if (supabase) {
      supabase
        .from(TABLE)
        .insert({ name: nameStr, activity, hours: hoursNum, date: dateStr, note: noteStr })
        .select('*')
        .single()
        .then(({ data, error: e }) => {
          if (e) {
            setError(e.message)
            return
          }
          setError(null)
          setEntries((prev) => [fromDb(data), ...prev])
        })
    } else {
      const newEntry = {
        id: crypto.randomUUID(),
        name: nameStr,
        activity,
        hours: hoursNum,
        date: dateStr,
        note: noteStr,
        createdAt: new Date().toISOString(),
      }
      const next = [newEntry, ...entries]
      setEntries(next)
      saveEntriesLocal(next)
    }
  }

  const deleteEntry = (id) => {
    if (supabase) {
      supabase
        .from(TABLE)
        .delete()
        .eq('id', id)
        .then(({ error: e }) => {
          if (e) {
            setError(e.message)
            return
          }
          setError(null)
          setEntries((prev) => prev.filter((e) => e.id !== id))
        })
    } else {
      const next = entries.filter((e) => e.id !== id)
      setEntries(next)
      saveEntriesLocal(next)
    }
  }

  const usingCloud = !!supabase

  return (
    <div className="app">
      <header className="header">
        <h1>Sadhana Dashboard</h1>
        <p className="tagline">Log your Satsang and Sadhana hours</p>
      </header>
      {error && (
        <div className="banner error" role="alert">
          {error}
        </div>
      )}
      {loading && (
        <div className="banner loading">Loading entries…</div>
      )}
      <main className="main">
        <Dashboard
          entries={entries}
          onAddEntry={addEntry}
          onDeleteEntry={deleteEntry}
        />
      </main>
      <footer className="footer">
        <p>
          {usingCloud
            ? 'Data is stored in a shared database. Everyone sees the same entries.'
            : 'Data is stored locally in your browser. Add Supabase for a shared dashboard (see README).'}
        </p>
      </footer>
    </div>
  )
}

export default App
