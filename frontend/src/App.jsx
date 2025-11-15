import React, { useEffect, useState } from 'react'
import SessionForm from './components/SessionForm'
import SessionsTable from './components/SessionsTable'
import ChartsPanel from './components/ChartsPanel'
import { fetchSessions } from './api'

export default function App() {
    const [sessions, setSessions] = useState([])
    const refresh = async () => {
        const res = await fetchSessions()
        setSessions(res.data)
    }
    useEffect(() => { refresh() }, [])
    return (
        <div className="container">
            <h1>Estadísticas de Entrenamiento</h1>
            <SessionForm onSaved={refresh} />
            <SessionsTable sessions={sessions} onChanged={refresh} />
            <ChartsPanel sessions={sessions} />
        </div>
    )
}