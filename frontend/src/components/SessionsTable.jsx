import React from 'react'
import { deleteSession } from '../api'

export default function SessionsTable({ sessions, onChanged }) {
    const onDelete = async (id) => {
        if (!confirm('Eliminar sesión?')) return
        await deleteSession(id)
        if (onChanged) onChanged()
    }
    return (
        <div className="sessions-table-parent">
            <h2>Sesiones</h2>
            <div className="sessions-table">
                <table>
                    <thead>
                        <tr><th>Fecha</th><th>Deporte</th><th>Min</th><th>Zona</th><th>HR</
                        th><th>Km</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {sessions.map(s => (
                            <tr key={s.id}>
                                <td>{s.date}</td>
                                <td>{s.sport}</td>
                                <td>{s.duration_min}</td>
                                <td>{s.zone}</td>
                                <td>{s.avg_hr ?? '-'}</td>
                                <td>{s.distance_km ?? '-'}</td>
                                <td><button onClick={() => onDelete(s.id)}>Eliminar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    </div>
    )
}
