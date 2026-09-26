<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default' // paid, unpaid, trial, active, restricted, in_stock, low_stock, out_of_stock, cash, card, mobile
  },
  label: String
})

const badgeStyle = computed(() => {
  const v = (props.variant || props.label || '').toLowerCase().replace(/\s+/g, '_')

  switch (v) {
    case 'paid':
    case 'active':
    case 'in_stock':
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-600/20'
    case 'unpaid':
    case 'restricted':
    case 'out_of_stock':
    case 'suspended':
    case 'inactive':
      return 'bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-600/20'
    case 'trial':
    case 'low_stock':
    case 'warning':
      return 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-600/20'
    case 'cash':
      return 'bg-green-50 text-green-700 border-green-200/80 ring-green-600/20'
    case 'card':
      return 'bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-600/20'
    case 'mobile':
      return 'bg-purple-50 text-purple-700 border-purple-200/80 ring-purple-600/20'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10'
  }
})
</script>

<template>
  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ring-1 ring-inset', badgeStyle]">
    <span class="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
    <slot>{{ label || variant }}</slot>
  </span>
</template>
