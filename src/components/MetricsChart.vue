<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import type { Breakdown } from '@/api/metrics'

const props = defineProps<{
  breakdown?: Breakdown[]
  data?: number[]
  title: string
}>()

const chartRef = ref<HTMLCanvasElement>()
let chartInstance: Chart | null = null

const renderChart = () => {
  if (!chartRef.value) return

  const labels = ['Вчера', 'Сегодня', 'За неделю']
  let datasets

  if (props.breakdown) {
    datasets = props.breakdown.map((b) => ({
      label: b.name,
      data: [b.yesterday, b.current, b.week],
      fill: false,
      tension: 0.3,
    }))
  } else if (props.data) {
    datasets = [
      {
        label: props.title,
        data: props.data,
        fill: false,
        tension: 0.3,
      },
    ]
  } else {
    return
  }

  const ctx = chartRef.value.getContext('2d')!
  if (chartInstance) {
    chartInstance.destroy()
  }
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: props.title,
        },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  })
}

onMounted(renderChart)
watch(() => [props.breakdown, props.data], renderChart, { deep: true })
</script>

<style scoped lang="scss">
.chart-container {
  position: relative;
  width: 100%;
  height: 300px;
}

.chart-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
