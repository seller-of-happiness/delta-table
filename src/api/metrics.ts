export interface Breakdown {
  id: string
  name: string
  current: number
  yesterday: number
  week: number
}

export interface Metric {
  id: string
  name: string
  current: number
  yesterday: number
  week: number
  breakdown?: Breakdown[]
}

export const fetchMetrics = async (): Promise<Metric[]> => {
  const res = await fetch('/metrics.json')
  if (!res.ok) throw new Error(`Error fetching metrics: ${res.statusText}`)
  return res.json()
}
