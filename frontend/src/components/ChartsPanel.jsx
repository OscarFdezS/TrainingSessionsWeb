import React, { useEffect, useState } from 'react'
import {
    statsBySport, statsByZone, statsDistanceBySport, timeSeries, getMetricByPeriod
} from '../api'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, Title, Tooltip, Legend)

export default function ChartsPanel({ sessions }) {
    const [bySport, setBySport] = useState({})
    const [byZone, setByZone] = useState({})
    const [distanceBySport, setDistanceBySport] = useState({})
    const [ts, setTs] = useState({})
    const [period, setPeriod] = useState('all')

    const [metricTimePeriodDays, setMetricTimePeriodDays] = useState({})
    const [metricTimePeriodWeek, setMetricTimePeriodWeek] = useState({})
    const [metricTimePeriodMonth, setMetricTimePeriodMonth] = useState({})
    const [metricDistancePeriodDays, setMetricDistancePeriodDays] = useState({})
    const [metricDistancePeriodWeek, setMetricDistancePeriodWeek] = useState({})
    const [metricDistancePeriodMonth, setMetricDistancePeriodMonth] = useState({})
    const [metricZonesPeriodDays, setMetricZonesPeriodDays] = useState({})
    const [metricZonesPeriodWeek, setMetricZonesPeriodWeek] = useState({})
    const [metricZonesPeriodMonth, setMetricZonesPeriodMonth] = useState({})

    useEffect(() => { loadAll() }, [period, sessions])

    async function loadAll() {
        const s = await statsBySport(); setBySport(s.data)
        const z = await statsByZone(); setByZone(z.data)
        const d = await statsDistanceBySport(); setDistanceBySport(d.data)
        const t = await timeSeries(period); setTs(t.data)

        // Time 
        const metricTimePeriodDaysRsp = await getMetricByPeriod("time", "days");
        setMetricTimePeriodDays(metricTimePeriodDaysRsp?.data || {})
        const metricTimePeriodWeekRsp = await getMetricByPeriod("time", "weeks");
        setMetricTimePeriodWeek(metricTimePeriodWeekRsp?.data || {})
        const metricTimePeriodMonthRsp = await getMetricByPeriod("time", "months");
        setMetricTimePeriodMonth(metricTimePeriodMonthRsp?.data || {})
        // Distance
        const metricDistancePeriodDaysRsp = await getMetricByPeriod("distance", "days");
        setMetricDistancePeriodDays(metricDistancePeriodDaysRsp?.data || {})
        const metricDistancePeriodWeekRsp = await getMetricByPeriod("distance", "weeks");
        setMetricDistancePeriodWeek(metricDistancePeriodWeekRsp?.data || {})
        const metricDistancePeriodMonthRsp = await getMetricByPeriod("distance", "months");
        setMetricDistancePeriodMonth(metricDistancePeriodMonthRsp?.data || {})
        // Zones
        const metricZonesPeriodDaysRsp = await getMetricByPeriod("zones", "days");
        setMetricZonesPeriodDays(metricZonesPeriodDaysRsp?.data || {})
        const metricZonesPeriodWeekRsp = await getMetricByPeriod("zones", "weeks");
        setMetricZonesPeriodWeek(metricZonesPeriodWeekRsp?.data || {})
        const metricZonesPeriodMonthRsp = await getMetricByPeriod("zones", "months");
        setMetricZonesPeriodMonth(metricZonesPeriodMonthRsp?.data || {})
    }


    const barData = (obj, label) => {
        // Disable legend globally for Chart.js
        ChartJS.defaults.plugins = ChartJS.defaults.plugins || {};
        ChartJS.defaults.plugins.legend = ChartJS.defaults.plugins.legend || {};
        ChartJS.defaults.plugins.legend.display = false;

        const keys = Object.keys(obj).sort();
        return {
            labels: keys,
            datasets: [{
                label,
                data: keys.map(k => obj[k]),
                backgroundColor: keys.map(k => ({
                    bike: 'rgba(253, 71, 110, 0.8)',
                    erg: 'rgba(58, 61, 67, 0.8)',
                    gym: 'rgba(204, 248, 9, 0.8)',
                    row: 'rgba(30, 124, 187, 0.8)',
                    'Z1': 'rgba(136, 252, 73, 0.8)',
                    'Z2': 'rgba(245, 242, 75, 0.8)',
                    'Z3': 'rgba(255, 132, 0, 0.79)',
                    'Z4+Z5': 'rgb(255, 135, 102)',
                }[k] || 'rgba(0, 0, 0, 0.6)'))
            }]
        }
    }


    const lineData = (obj) => ({
        labels: Object.keys(obj), datasets: [{
            label:
                'Minutos', data: Object.values(obj), borderColor: 'rgba(54,162,235,1)',
            backgroundColor: 'rgba(54,162,235,0.4)'
        }], tension: 0.2
    })

    return (
        <div className="charts-panel" >
            <h2>Gráficos</h2>

            <div className="charts">
                <div className="SportTime">
                    <h3>Tiempo por deporte (min)</h3>
                    <Bar data={barData(bySport, "min")} />
                </div>
                <div className="DistanceSport">
                    <h3>Distancia por deporte (km)</h3>
                    <Bar data={barData(distanceBySport, "Km")} />
                </div>
                <div className="ZoneTime">
                    <h3>Tiempo por zona (min)</h3>
                    <Bar data={barData(byZone, "Min")} />
                </div>
            </div>
            <h3>Estadísticas agregadas por dias</h3>
            <div className="charts">
                <div className="DaysSportTime">
                    <h3>Tiempo por deporte (min) </h3>
                    <Bar data={buildBarData(metricTimePeriodDays || {})} />
                </div>
                <div className="DaysDistanceSport">
                    <h3>Distancia por deporte (km) </h3>
                    <Bar data={buildBarData(metricDistancePeriodDays || {})} />
                </div>
                <div className="DaysZoneTime">
                    <h3>Tiempo por zona (min) </h3>
                    <Bar data={buildBarData(metricZonesPeriodDays || {})} />
                </div>
            </div>

            <h3>Estadísticas agregadas por semanas</h3>
            <div className="charts">
                <div className="WeeksSportTime">
                    <h3>Tiempo por deporte (min) </h3>
                    <Bar data={buildBarData(metricTimePeriodWeek || {})} />
                </div>
                <div className="WeeksDistanceSport">
                    <h3>Distancia por deporte (km) </h3>
                    <Bar data={buildBarData(metricDistancePeriodWeek || {})} />
                </div>
                <div className="WeeksZoneTime">
                    <h3>Tiempo por zona (min) </h3>
                    <Bar data={buildBarData(metricZonesPeriodWeek || {})} />
                </div>
            </div>
            <h3>Estadísticas agregadas por meses</h3>
            <div className="charts">
                <div className="MonthsSportTime">
                    <h3>Tiempo por deporte (min) </h3>
                    <Bar data={buildBarData(metricTimePeriodMonth || {})} />
                </div>
                <div className="MonthsDistanceSport">
                    <h3>Distancia por deporte (km) </h3>
                    <Bar data={buildBarData(metricDistancePeriodMonth || {})} />
                </div>
                <div className="MonthsZoneTime">
                    <h3>Tiempo por zona (min) </h3>
                    <Bar data={buildBarData(metricZonesPeriodMonth || {})} />
                </div>
            </div>

            <div className="controls">
                <label>Periodo:
                    <select value={period} onChange={e => setPeriod(e.target.value)}>
                        <option value="all">Todo</option>
                        <option value="week">Semana</option>
                        <option value="month">Mes</option>
                        <option value="year">Año</option>
                    </select>
                </label>
            </div>

            <div className="chart">
                <h3>Serie temporal ({period}) — minutos</h3>
                <Line data={lineData(ts)} />
            </div>
        </div >
    )
}

// <Bar data={barData(buildBarData(dw8 || {}))} />
function buildBarData(weeklyData) {
    const sports = new Set();
    const labels = Object.keys(weeklyData).sort((a, b) => a - b);

    // Primero detectamos todos los deportes presentes
    labels.forEach(week => {
        Object.keys(weeklyData[week]).forEach(sport => sports.add(sport));
    });

    const sportsArr = Array.from(sports).sort();

    // Creamos un dataset por cada deporte
    const datasets = sportsArr.map(sport => ({
        label: sport,
        data: labels.map(week => weeklyData[week][sport] || 0),
        backgroundColor: {
            row: 'rgba(54,162,235,0.6)',
            bike: 'rgba(255,99,132,0.6)',
            erg: 'rgba(58, 61, 67, 0.6)',
            gym: 'rgba(255,206,86,0.6)',
            'Z1': 'rgba(136, 252, 73, 0.8)',
            'Z2': 'rgba(245, 242, 75, 0.8)',
            'Z3': 'rgba(255, 132, 0, 0.79)',
            'Z4+Z5': 'rgb(255, 135, 102)',
        }[sport] || 'rgba(75,192,192,0.6)'
    }));

    return { labels, datasets };
}
