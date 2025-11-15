import React, { useState } from 'react'
import { createSession } from '../api'

const initial = {
    date: '', sport: 'row', duration_min: 30, zone: 'Z1',
    avg_hr: '', distance_km: ''
}

export default function SessionForm({ onSaved }) {
    const [form, setForm] = useState(initial)
    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const onSubmit = async (e) => {
        e.preventDefault()
        // clean optional
        const payload = {
            date: form.date,
            sport: form.sport,
            duration_min: Number(form.duration_min),
            zone: form.zone,
            avg_hr: form.avg_hr ? Number(form.avg_hr) : undefined,
            distance_km: form.distance_km ? Number(form.distance_km) : undefined,
        }
        await createSession(payload)
        setForm(initial)
        if (onSaved) onSaved()
    }
    return (
        <form className="session-form" onSubmit={onSubmit}>
            <div className="form-grid">
                <div className="field"><label>Fecha</label><input type="date"
                    name="date" value={form.date} onChange={onChange} required /></div>
                <div className="field"><label>Deporte</label>
                    <select name="sport" value={form.sport} onChange={onChange}>
                        <option value="row">Row</option>
                        <option value="bike">Bike</option>
                        <option value="gym">Gym</option>
                        <option value="erg">Erg</option>
                    </select>
                </div>
                <div className="field"><label>Tiempo (min)</label><input
                    type="number" name="duration_min" value={form.duration_min}
                    onChange={onChange} required /></div>
                <div className="field"><label>Zona</label>
                    <select name="zone" value={form.zone} onChange={onChange}>
                        <option value="Z1">Z1</option>
                        <option value="Z2">Z2</option>
                        <option value="Z3">Z3</option>
                        <option value="Z4+Z5">Z4+Z5</option>
                    </select>
                </div>
                <div className="field"><label>Avg HR</label><input type="number"
                    name="avg_hr" value={form.avg_hr} onChange={onChange} /></div>
                <div className="field"><label>Distancia km</label><input step="0.01"
                    type="number" name="distance_km" value={form.distance_km}
                    onChange={onChange} /></div>
            </div>
            <button className="submit-btn" type="submit">Añadir sesión</button>
        </form>
    )

} ({ onSaved })=>{
    const [form, setForm] = useState(initial)
    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
    const onSubmit = async (e) => {
        e.preventDefault()
        // clean optional
        const payload = {
            date: form.date,
            sport: form.sport,
            duration_min: Number(form.duration_min),
            zone: form.zone,
            avg_hr: form.avg_hr ? Number(form.avg_hr) : undefined,
            distance_km: form.distance_km ? Number(form.distance_km) : undefined,
        }
        await createSession(payload)
        setForm(initial)
        if (onSaved) onSaved()
    }
    return (
        <form className="session-form" onSubmit={onSubmit}>
            <label>Fecha <input type="date" name="date" value={form.date}
                onChange={onChange} required /></label>
            <label>Deporte
                <select name="sport" value={form.sport} onChange={onChange}>
                    <option value="row">Row</option>
                    <option value="bike">Bike</option>
                    <option value="gym">Gym</option>
                    <option value="erg">Erg</option>
                </select>
            </label>
            <label>Tiempo (min) <input type="number" name="duration_min"
                value={form.duration_min} onChange={onChange} required /></label>
            <label>Zona
                <select name="zone" value={form.zone} onChange={onChange}>
                    <option value="1Z1">Z1</option>
                    <option value="2Z2">Z2</option>
                    <option value="3Z3">Z3</option>
                    <option value="4Z4+Z5">Z4+Z5</option>
                </select>
            </label>
            <label>Avg HR <input type="number" name="avg_hr" value={form.avg_hr}
                onChange={onChange} /></label>
            <label>Distancia km <input step="0.01" type="number"
                name="distance_km" value={form.distance_km} onChange={onChange} /></label>
            <button type="submit">Añadir sesión</button>
        </form>
    )
}