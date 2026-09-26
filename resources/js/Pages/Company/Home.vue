<script setup>
import { ref, inject, computed } from 'vue'
import AppLayout from '../../Layouts/AppLayout.vue'
import StatsCard from '../../Components/StatsCard.vue'
import SalesVsProfitChart from '../../Components/SalesVsProfitChart.vue'
import Badge from '../../Components/Badge.vue'
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Calculator, 
  AlertTriangle, 
  PackageX, 
  Award, 
  ArrowUpRight,
  TrendingDown,
  ChevronRight
} from 'lucide-vue-next'

const selectedBranch = inject('selectedBranch', ref('All Branches'))
const selectedTimeFilter = inject('selectedTimeFilter', ref('This Month'))

// Metrics reactive data calculated based on selected branch and time filter
const metrics = computed(() => {
  const isToday = selectedTimeFilter.value === 'Today'
  const isWeek = selectedTimeFilter.value === 'This Week'
  
  const mult = isToday ? 0.08 : (isWeek ? 0.35 : 1.0)
  
  return {
    revenue: `$${(84920 * mult).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    netProfit: `$${(38450 * mult).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    salesCount: Math.round(1480 * mult),
    aov: `$${(57.38 * (isToday ? 1.05 : 1.0)).toFixed(2)}`
  }
})

const stockAlerts = ref([
  { id: 101, name: 'USB-C Fast Charger 65W', sku: 'CHG-65W-BLK', stock: 3, minStock: 10, branch: 'Downtown Store', status: 'Low Stock' },
  { id: 102, name: 'Ergonomic Standing Desk', sku: 'DSK-STD-WHT', stock: 0, minStock: 5, branch: 'Northside Hub', status: 'Out of Stock' },
  { id: 103, name: 'HDMI 2.1 Cable 3m', sku: 'CBL-HDMI-21', stock: 4, minStock: 15, branch: 'Downtown Store', status: 'Low Stock' },
  { id: 104, name: 'Wireless Bluetooth Earbuds', sku: 'AUD-EAR-WLS', stock: 0, minStock: 8, branch: 'Airport Kiosk', status: 'Out of Stock' },
])

const topSellingProductsFilter = ref('units') // 'units' or 'profit'

const topProducts = ref([
  { rank: 1, name: 'UltraHD Monitor 27"', sku: 'MON-27-UHD', unitsSold: 142, totalProfit: 18460, revenue: 42600 },
  { rank: 2, name: 'Mechanical Keyboard RGB', sku: 'KBD-MECH-RGB', unitsSold: 289, totalProfit: 12420, revenue: 25950 },
  { rank: 3, name: 'Wireless Ergonomic Mouse', sku: 'MOU-WLS-ERG', unitsSold: 412, totalProfit: 9880, revenue: 18540 },
  { rank: 4, name: 'USB-C Fast Charger 65W', sku: 'CHG-65W-BLK', unitsSold: 380, totalProfit: 5700, revenue: 13300 },
  { rank: 5, name: 'HDMI 2.1 Cable 3m', sku: 'CBL-HDMI-21', unitsSold: 290, totalProfit: 3625, revenue: 7250 },
])

const sortedTopProducts = computed(() => {
  return [...topProducts.value].sort((a, b) => {
    return topSellingProductsFilter.value === 'units' 
      ? b.unitsSold - a.unitsSold 
      : b.totalProfit - a.totalProfit
  })
})

const leaderboard = ref([
  { rank: 1, name: 'Sarah Jenkins', branch: 'Downtown Store', ordersCount: 284, revenue: 28400, cashOnHand: 480.00, badge: '🔥 Top Performer' },
  { rank: 2, name: 'David Ross', branch: 'Northside Hub', ordersCount: 245, revenue: 23100, cashOnHand: 120.00, badge: '⭐ High Conversion' },
  { rank: 3, name: 'Elena Gomez', branch: 'Airport Kiosk', ordersCount: 198, revenue: 19500, cashOnHand: 0.00, badge: '⚡ Fast Checkout' },
  { rank: 4, name: 'Marcus Vance', branch: 'Downtown Store', ordersCount: 176, revenue: 13920, cashOnHand: 340.50, badge: '' },
])
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 subtle-shadow">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Executive Store Dashboard</h2>
          <p class="text-xs text-slate-500 mt-0.5">
            Showing performance for <span class="font-bold text-blue-600">{{ selectedBranch }}</span> during <span class="font-bold text-blue-600">{{ selectedTimeFilter }}</span>.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <a href="/company/products" class="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold border border-blue-200 transition-colors">
            View Inventory Matrix
          </a>
        </div>
      </div>

      <!-- 4 Metric Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue ($)"
          :value="metrics.revenue"
          change="+14.2%"
          :isPositive="true"
          :icon="DollarSign"
          color="blue"
        />

        <StatsCard 
          title="Net Profit (FIFO Cost)"
          :value="metrics.netProfit"
          change="+18.6%"
          :isPositive="true"
          :icon="TrendingUp"
          color="emerald"
        />

        <StatsCard 
          title="Total Orders / Sales"
          :value="metrics.salesCount"
          change="+9.5%"
          :isPositive="true"
          :icon="ShoppingBag"
          color="indigo"
        />

        <StatsCard 
          title="Average Order Value (AOV)"
          :value="metrics.aov"
          change="+3.8%"
          :isPositive="true"
          :icon="Calculator"
          color="purple"
        />
      </div>

      <!-- Charts & Stock Alerts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Revenue vs Profit Chart (2 Cols) -->
        <div class="lg:col-span-2">
          <SalesVsProfitChart :timeFilter="selectedTimeFilter" />
        </div>

        <!-- Inventory Low Stock & Out of Stock Widgets -->
        <div class="bg-white rounded-xl border border-slate-200/80 p-5 subtle-shadow flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle class="w-4.5 h-4.5 text-amber-500" /> Critical Stock Alerts
                </h3>
                <p class="text-xs text-slate-500">Items requiring immediate reorder</p>
              </div>
              <a href="/company/products" class="text-xs font-bold text-blue-600 hover:underline">View All</a>
            </div>

            <div class="space-y-3">
              <div 
                v-for="alert in stockAlerts" 
                :key="alert.id"
                class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div>
                  <div class="font-bold text-slate-800">{{ alert.name }}</div>
                  <div class="text-[11px] text-slate-400 mt-0.5">
                    SKU: <span class="font-mono text-slate-600">{{ alert.sku }}</span> • {{ alert.branch }}
                  </div>
                </div>

                <div class="text-right">
                  <Badge :variant="alert.status" />
                  <div class="text-[10px] text-slate-500 mt-1">
                    Qty: <span class="font-bold text-slate-900">{{ alert.stock }}</span> / Min: {{ alert.minStock }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Tables: Top Products & Staff Leaderboard -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Selling Products -->
        <div class="bg-white rounded-xl border border-slate-200/80 p-5 subtle-shadow">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900">Top Selling Products</h3>
              <p class="text-xs text-slate-500">Highest grossing inventory catalog items</p>
            </div>

            <!-- Toggle units vs profit -->
            <div class="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button 
                @click="topSellingProductsFilter = 'units'"
                :class="['px-2.5 py-1 rounded-md transition-all', topSellingProductsFilter === 'units' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600']"
              >
                By Units
              </button>
              <button 
                @click="topSellingProductsFilter = 'profit'"
                :class="['px-2.5 py-1 rounded-md transition-all', topSellingProductsFilter === 'profit' ? 'bg-white text-blue-600 shadow-xs font-bold' : 'text-slate-600']"
              >
                By Profit
              </button>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th class="py-2.5 px-3"># Rank</th>
                  <th class="py-2.5 px-3">Product Name</th>
                  <th class="py-2.5 px-3 text-right">Units Sold</th>
                  <th class="py-2.5 px-3 text-right">Net Profit</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="prod in sortedTopProducts" :key="prod.rank" class="hover:bg-slate-50/80 transition-colors">
                  <td class="py-2.5 px-3 font-bold text-slate-500">#{{ prod.rank }}</td>
                  <td class="py-2.5 px-3">
                    <div class="font-bold text-slate-900">{{ prod.name }}</div>
                    <div class="text-[10px] text-slate-400 font-mono">{{ prod.sku }}</div>
                  </td>
                  <td class="py-2.5 px-3 text-right font-bold text-slate-800">{{ prod.unitsSold }} pcs</td>
                  <td class="py-2.5 px-3 text-right font-extrabold text-emerald-600">${{ prod.totalProfit.toLocaleString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sales Staff Productivity Leaderboard -->
        <div class="bg-white rounded-xl border border-slate-200/80 p-5 subtle-shadow">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award class="w-4.5 h-4.5 text-amber-500" /> Staff Productivity Leaderboard
              </h3>
              <p class="text-xs text-slate-500">Cashier sales generated & cash on hand status</p>
            </div>
            <a href="/company/sellers" class="text-xs font-bold text-blue-600 hover:underline">Manage Sellers</a>
          </div>

          <div class="space-y-3">
            <div 
              v-for="seller in leaderboard" 
              :key="seller.rank"
              class="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors"
            >
              <div class="flex items-center gap-3">
                <div 
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center font-black text-xs',
                    seller.rank === 1 ? 'bg-amber-400 text-amber-950 shadow-sm' :
                    seller.rank === 2 ? 'bg-slate-300 text-slate-800' : 'bg-amber-700/20 text-amber-800'
                  ]"
                >
                  #{{ seller.rank }}
                </div>

                <div>
                  <div class="font-bold text-slate-900 flex items-center gap-2">
                    {{ seller.name }}
                    <span v-if="seller.badge" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {{ seller.badge }}
                    </span>
                  </div>
                  <div class="text-[11px] text-slate-500">{{ seller.branch }} • {{ seller.ordersCount }} Orders</div>
                </div>
              </div>

              <div class="text-right">
                <div class="font-extrabold text-sm text-slate-900">${{ seller.revenue.toLocaleString() }}</div>
                <div class="text-[10px] text-slate-500 mt-0.5">
                  Cash on Hand: <span class="font-bold text-emerald-600">${{ seller.cashOnHand.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
