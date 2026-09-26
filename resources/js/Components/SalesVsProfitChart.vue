<script setup>
import { ref } from 'vue'

const props = defineProps({
  timeFilter: {
    type: String,
    default: 'This Month'
  }
})

// Sample dataset tailored to time filter
const datasets = {
  'Today': [
    { label: '08:00', revenue: 420, profit: 180 },
    { label: '10:00', revenue: 850, profit: 390 },
    { label: '12:00', revenue: 1420, profit: 620 },
    { label: '14:00', revenue: 1100, profit: 480 },
    { label: '16:00', revenue: 1680, profit: 750 },
    { label: '18:00', revenue: 950, profit: 410 },
  ],
  'This Week': [
    { label: 'Mon', revenue: 4200, profit: 1850 },
    { label: 'Tue', revenue: 5100, profit: 2200 },
    { label: 'Wed', revenue: 6400, profit: 2850 },
    { label: 'Thu', revenue: 5800, profit: 2500 },
    { label: 'Fri', revenue: 7900, profit: 3400 },
    { label: 'Sat', revenue: 9200, profit: 4100 },
    { label: 'Sun', revenue: 6800, profit: 2900 },
  ],
  'This Month': [
    { label: 'Week 1', revenue: 18400, profit: 8100 },
    { label: 'Week 2', revenue: 22100, profit: 9800 },
    { label: 'Week 3', revenue: 26500, profit: 11900 },
    { label: 'Week 4', revenue: 28400, profit: 12600 },
  ],
  'This Year': [
    { label: 'Q1', revenue: 68000, profit: 29500 },
    { label: 'Q2', revenue: 82000, profit: 36200 },
    { label: 'Q3', revenue: 95000, profit: 42100 },
    { label: 'Q4', revenue: 110000, profit: 49000 },
  ]
}

const activeIndex = ref(null)

const getChartData = () => {
  return datasets[props.timeFilter] || datasets['This Month']
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200/80 p-5 subtle-shadow">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h4 class="text-base font-bold text-slate-900">Revenue vs. Net Profit (FIFO)</h4>
        <p class="text-xs text-slate-500 mt-0.5">Real-time financial performance breakdown</p>
      </div>

      <div class="flex items-center gap-4 text-xs">
        <div class="flex items-center gap-1.5 font-medium text-slate-700">
          <span class="w-3 h-3 rounded bg-blue-600 inline-block"></span> Total Revenue ($)
        </div>
        <div class="flex items-center gap-1.5 font-medium text-slate-700">
          <span class="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Net Profit ($)
        </div>
      </div>
    </div>

    <!-- Chart Body -->
    <div class="h-64 w-full flex items-end gap-3 pt-6 pb-2 px-2 relative">
      <!-- Background Grid lines -->
      <div class="absolute inset-x-0 top-6 bottom-8 flex flex-col justify-between pointer-events-none opacity-30">
        <div class="border-b border-slate-200 w-full"></div>
        <div class="border-b border-slate-200 w-full"></div>
        <div class="border-b border-slate-200 w-full"></div>
        <div class="border-b border-slate-200 w-full"></div>
      </div>

      <div 
        v-for="(item, idx) in getChartData()" 
        :key="idx"
        class="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
        @mouseenter="activeIndex = idx"
        @mouseleave="activeIndex = null"
      >
        <!-- Tooltip -->
        <div 
          v-if="activeIndex === idx"
          class="absolute -top-14 z-20 bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-xl pointer-events-none flex flex-col gap-0.5 whitespace-nowrap"
        >
          <span class="font-semibold text-slate-300">{{ item.label }}</span>
          <span class="text-blue-300">Revenue: ${{ item.revenue.toLocaleString() }}</span>
          <span class="text-emerald-300">Net Profit: ${{ item.profit.toLocaleString() }}</span>
        </div>

        <!-- Bars Container -->
        <div class="w-full max-w-[60px] flex items-end justify-center gap-1.5 h-full z-10">
          <!-- Revenue Bar -->
          <div 
            class="w-1/2 bg-blue-600 rounded-t-md transition-all duration-300 group-hover:bg-blue-700"
            :style="{ height: `${Math.min(100, (item.revenue / (getChartData()[getChartData().length - 1].revenue * 1.2)) * 100)}%` }"
          ></div>

          <!-- Net Profit Bar -->
          <div 
            class="w-1/2 bg-emerald-500 rounded-t-md transition-all duration-300 group-hover:bg-emerald-600"
            :style="{ height: `${Math.min(100, (item.profit / (getChartData()[getChartData().length - 1].revenue * 1.2)) * 100)}%` }"
          ></div>
        </div>

        <!-- X Axis Label -->
        <span class="text-[11px] font-medium text-slate-500 mt-2">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
