import type { ClimateSummary, MonthlyClimate, Comparison, FarmInput, EvidenceSource, CropCatalog } from './types'
const base = import.meta.env.VITE_API_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(base + path, init)
  if (!response.ok) {
    let detail = 'API request failed'
    try { const data = await response.json(); detail = String(data.detail ?? detail) } catch { /* no body */ }
    throw new Error(detail)
  }
  return response.json() as Promise<T>
}
export const getClimate = (year: number) => request<ClimateSummary>(`/api/climate/${year}`)
export const getMonthly = (year: number) => request<MonthlyClimate>(`/api/climate/${year}/monthly`)
export const getEvidence = () => request<EvidenceSource[]>('/api/evidence')
export const getCrops = () => request<CropCatalog>('/api/crops')
export const getHealth = () => request<{status: string; records: number; source: string}>('/api/health')
export const compare = (data: FarmInput) => request<Comparison>('/api/compare', {
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)
})
