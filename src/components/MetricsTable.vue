<template>
  <div class="container">
    <table class="table">
      <thead>
        <tr>
          <th>Показатель</th>
          <th class="bg-current">Текущий день</th>
          <th>Вчера</th>
          <th>Этот день недели</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="m in list" :key="m.id">
          <!-- Основная строка метрики -->
          <tr :class="{ active: expandedId === m.id }" @click="toggle(m.id)">
            <td>{{ m.name }}</td>
            <td class="bg-current">{{ format(m.current) }}</td>
            <td :class="deltaBg(m.yesterday, m.current)">
              <div class="flex justify-between items-center">
                <span>{{ format(m.yesterday) }}</span>
                <span :class="percentClass(m.yesterday, m.current)">
                  {{ percent(m.yesterday, m.current) }}
                </span>
              </div>
            </td>
            <td>{{ format(m.week) }}</td>
          </tr>

          <!-- Раскрывающийся контент: график + разбивка или одиночный график -->
          <tr v-if="expandedId === m.id" class="spoiler-row">
            <td colspan="4" class="spoiler-content">
              <div class="chart-and-table">
                <!-- Разбивка есть — строим несколько линий + таблицу -->
                <template v-if="m.breakdown">
                  <MetricsChart :breakdown="m.breakdown" :title="m.name" />
                  <table class="table sub-table">
                    <tbody>
                      <tr v-for="b in m.breakdown" :key="b.id" class="sub-row">
                        <td>{{ b.name }}</td>
                        <td>{{ format(b.current) }}</td>
                        <td :class="deltaBg(b.yesterday, b.current)">
                          {{ format(b.yesterday) }}
                        </td>
                        <td>{{ format(b.week) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </template>

                <!-- Иначе — одна линия по метрике -->
                <template v-else>
                  <MetricsChart
                    :data="[m.yesterday, m.current, m.week]"
                    :title="m.name"
                  />
                </template>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMetricsStore } from '@/stores/metrics'
import { storeToRefs } from 'pinia'
import MetricsChart from './MetricsChart.vue'

interface Breakdown {
  id: string
  name: string
  current: number
  yesterday: number
  week: number
}

interface Metric {
  id: string
  name: string
  current: number
  yesterday: number
  week: number
  breakdown?: Breakdown[]
}

const store = useMetricsStore()
const { list } = storeToRefs(store)
const expandedId = ref<string>('')

const toggle = (id: string) => {
  expandedId.value = expandedId.value === id ? '' : id
}

onMounted(store.load)

const percent = (prev: number, cur: number): string =>
  prev === 0 ? '0%' : `${Math.round(((cur - prev) / prev) * 100)}%`

const deltaBg = (prev: number, cur: number): string => {
  if (cur > prev) return 'bg-positive'
  if (cur < prev) return 'bg-negative'
  return 'bg-neutral'
}

const percentClass = (prev: number, cur: number): string =>
  cur > prev ? 'text-success' : cur < prev ? 'text-error' : 'text-neutral'

const formatter = new Intl.NumberFormat('ru-RU')
const format = (value: number | string): string =>
  typeof value === 'number' ? formatter.format(value) : String(value)
</script>
