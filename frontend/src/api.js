import axios from 'axios'
const API = axios.create({ baseURL: 'http://localhost:8000' })
export const fetchSessions = () => API.get('/sessions')
export const createSession = (data) => API.post('/sessions', data)
export const updateSession = (id, data) => API.put(`/sessions/${id}`, data)
export const deleteSession = (id) => API.delete(`/sessions/${id}`)
export const statsBySport = () => API.get('/stats/by_sport')
export const statsByZone = () => API.get('/stats/by_zone')
export const statsDistanceBySport = () => API.get('/stats/distance_by_sport')
export const timeSeries = (period = 'all') => API.get('/stats/time_series', {
    params: { period }
})

export const getDistanceBySportPeriod = () =>
    API.get('/stats/distance-by-sport-period-week-eight')

export const getMetricBySportPeriod = (metric = 'None') =>
    API.get('/stats/metric-by-sport-period-week-eight', {
        params: { metric }
    })

export const getMetricBySportPeriodMonth = (metric = 'None') =>
    API.get('/stats/metric-by-sport-period-month-six', {
        params: { metric }
    })

export const getMetricByPeriod = (metric = 'None', period = 'None') =>
    API.get('/stats/metric-by-period', {
        params: { metric, period }
    })
