import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { fetchMetrics, type Metric } from '@/api/metrics'

export const useMetricsStore = defineStore('metrics', () => {
  const list = ref<Metric[]>([])
  const selectedId = ref<string>('')

  const load = async (): Promise<void> => {
    try {
      list.value = await fetchMetrics()
      if (list.value.length) selectedId.value = list.value[0].id
    } catch (e) {
      console.error(e)
    }
  }

  const select = (id: string): void => {
    selectedId.value = id
  }

  const selected = computed<Metric | undefined>(
    () => list.value.find((m) => m.id === selectedId.value)
  )

  return { list, selected, load, select }
})
