<script setup>
import { ref } from 'vue'
import SuperAdminLayout from '../../Layouts/SuperAdminLayout.vue'
import StatsCard from '../../Components/StatsCard.vue'
import Badge from '../../Components/Badge.vue'
import { 
  Building2, 
  CreditCard, 
  ShieldAlert, 
  DollarSign, 
  UserPlus, 
  ArrowUpRight, 
  Activity,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-vue-next'

const stats = ref([
  { title: 'Total Registered Companies', value: '142', change: '+12%', isPositive: true, icon: Building2, color: 'indigo' },
  { title: 'Active Subscriptions', value: '128', change: '+8.4%', isPositive: true, icon: CreditCard, color: 'emerald' },
  { title: 'Restricted / Suspended', value: '14', change: '-2 companies', isPositive: false, icon: ShieldAlert, color: 'rose' },
  { title: 'Monthly Recurring Revenue (MRR)', value: '$48,920', change: '+18.2%', isPositive: true, icon: DollarSign, color: 'purple' },
])

const recentActivities = ref([
  { id: 1, company: 'Apex Retail Group', action: 'New Sign-up', tier: 'Enterprise Plan', status: 'Paid', date: '10 mins ago' },
  { id: 2, company: 'Urban Outfitters Co', action: 'Plan Upgrade', tier: 'Pro Multi-Branch', status: 'Paid', date: '45 mins ago' },
  { id: 3, company: 'Starlight Groceries', action: 'Payment Renewal Failed', tier: 'Starter Tier', status: 'Unpaid', date: '2 hours ago' },
  { id: 4, company: 'HyperMart Express', action: 'Account Suspended', tier: 'Enterprise Plan', status: 'Restricted', date: '5 hours ago' },
  { id: 5, company: 'Metro Electronics', action: 'Trial Started', tier: 'Pro Multi-Branch', status: 'Trial', date: '1 day ago' },
])
</script>

<template>
  <SuperAdminLayout>
    <div class="space-y-6">
      <!-- Title & Banner -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Global SaaS Analytics Overview</h2>
          <p class="text-slate-400 text-xs mt-1">Real-time tenant metrics, subscription revenue, and platform health.</p>
        </div>
        <div class="flex items-center gap-3">
          <a href="/admin/companies" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2">
            <UserPlus class="w-4 h-4" /> Add New Tenant
          </a>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          v-for="(card, i) in stats" 
          :key="i"
          :title="card.title"
          :value="card.value"
          :change="card.change"
          :isPositive="card.isPositive"
          :icon="card.icon"
          :color="card.color"
        />
      </div>

      <!-- Main Analytics Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- MRR Growth & Subscriptions Graph Card -->
        <div class="lg:col-span-2 bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-bold text-white">Monthly Recurring Revenue (MRR) Growth</h3>
              <p class="text-xs text-slate-400">Subscription revenue trajectory ($ USD)</p>
            </div>
            <div class="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              ARR: $587,040 / yr
            </div>
          </div>

          <!-- Custom Dark Chart -->
          <div class="h-64 flex items-end justify-between gap-3 pt-4 border-b border-slate-800 pb-4">
            <div 
              v-for="(m, idx) in [
                { month: 'Jan', val: 32000 },
                { month: 'Feb', val: 34500 },
                { month: 'Mar', val: 37000 },
                { month: 'Apr', val: 39800 },
                { month: 'May', val: 41200 },
                { month: 'Jun', val: 44000 },
                { month: 'Jul', val: 46200 },
                { month: 'Aug', val: 48920 }
              ]"
              :key="idx"
              class="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
            >
              <div class="text-[10px] text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                ${{ (m.val / 1000).toFixed(1) }}k
              </div>
              <div 
                class="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-lg transition-all duration-300 group-hover:from-indigo-600 group-hover:to-violet-400"
                :style="{ height: `${(m.val / 50000) * 100}%` }"
              ></div>
              <span class="text-[11px] text-slate-400 font-medium">{{ m.month }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Activity Feed -->
        <div class="bg-slate-950/60 border border-slate-800 rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <Activity class="w-4 h-4 text-indigo-400" /> Activity Feed
            </h3>
            <span class="text-[11px] text-slate-400">Live Updates</span>
          </div>

          <div class="space-y-4">
            <div 
              v-for="act in recentActivities" 
              :key="act.id"
              class="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <div class="font-bold text-slate-200">{{ act.company }}</div>
                <div class="text-[11px] text-slate-400 mt-0.5">{{ act.action }} • <span class="text-indigo-400">{{ act.tier }}</span></div>
              </div>
              <div class="text-right flex flex-col items-end gap-1">
                <Badge :variant="act.status" />
                <span class="text-[10px] text-slate-500">{{ act.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SuperAdminLayout>
</template>
