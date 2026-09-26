<script setup>
import { TrendingUp, TrendingDown, Info } from 'lucide-vue-next'

defineProps({
  title: String,
  value: [String, Number],
  change: String,
  isPositive: {
    type: Boolean,
    default: true
  },
  subtext: String,
  icon: Object,
  color: {
    type: String,
    default: 'blue' // blue, emerald, indigo, amber, rose, purple
  }
})

const colorStyles = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  purple: 'bg-purple-50 text-purple-600 border-purple-100',
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200/80 p-5 hover-card-rise subtle-shadow flex flex-col justify-between relative overflow-hidden">
    <div class="flex items-start justify-between gap-3">
      <div>
        <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">{{ title }}</span>
        <h3 class="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{{ value }}</h3>
      </div>
      <div v-if="icon" :class="['p-3 rounded-xl border', colorStyles[color] || colorStyles.blue]">
        <component :is="icon" class="w-5 h-5" />
      </div>
    </div>

    <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
      <div v-if="change" class="flex items-center gap-1 font-semibold">
        <span :class="isPositive ? 'text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded' : 'text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded'">
          <component :is="isPositive ? TrendingUp : TrendingDown" class="w-3.5 h-3.5 inline mr-0.5" />
          {{ change }}
        </span>
        <span class="text-slate-400 font-normal">vs last period</span>
      </div>
      <span v-if="subtext" class="text-slate-500 font-medium ml-auto">{{ subtext }}</span>
    </div>
  </div>
</template>
