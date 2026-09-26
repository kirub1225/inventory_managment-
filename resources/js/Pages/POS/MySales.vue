<script setup>
import { ref, computed } from 'vue'
import PosLayout from '../../Layouts/PosLayout.vue'
import StatsCard from '../../Components/StatsCard.vue'
import Badge from '../../Components/Badge.vue'
import ReceiptModal from '../../Components/ReceiptModal.vue'
import { useCartStore } from '../../Stores/cartStore'
import { 
  Receipt, 
  ShoppingBag, 
  Boxes, 
  DollarSign, 
  Printer, 
  Calendar, 
  Search,
  CheckCircle2
} from 'lucide-vue-next'

const cartStore = useCartStore()

const dateFilter = ref('Today')
const searchQuery = ref('')

const selectedReceiptForModal = ref(null)
const showReceiptModal = ref(false)

const filteredSales = computed(() => {
  return cartStore.personalSales.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          s.paymentMethod.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSearch
  })
})

const openReceipt = (receipt) => {
  selectedReceiptForModal.value = receipt
  showReceiptModal.value = true
}
</script>

<template>
  <PosLayout>
    <div class="p-6 space-y-6 max-w-7xl mx-auto w-full">
      <!-- Title & Date Filter Bar -->
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 subtle-shadow flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">My Personal Sales Shift Log</h2>
          <p class="text-xs text-slate-500 mt-0.5">Cashier terminal activity and personal transaction log for <span class="font-bold text-emerald-600">Sarah Jenkins</span>.</p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-xs font-bold text-slate-600">Date Filter:</span>
          <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button 
              v-for="df in ['Today', 'Yesterday', 'This Week', 'All']" 
              :key="df"
              @click="dateFilter = df"
              :class="['px-3 py-1 rounded-lg transition-all', dateFilter === df ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600']"
            >
              {{ df }}
            </button>
          </div>
        </div>
      </div>

      <!-- Cashier KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Shift Orders"
          :value="cartStore.sellerTodayOrdersCount"
          subtext="Completed checkouts"
          :icon="Receipt"
          color="emerald"
        />

        <StatsCard 
          title="Total Units Sold"
          :value="cartStore.sellerTodayUnitsSold"
          subtext="Items scanned"
          :icon="Boxes"
          color="blue"
        />

        <StatsCard 
          title="Total Revenue Generated"
          :value="`$${cartStore.sellerTodayRevenue.toFixed(2)}`"
          subtext="Shift sales total"
          :icon="DollarSign"
          color="indigo"
        />

        <StatsCard 
          title="Uncollected Cash on Hand"
          :value="`$${cartStore.sellerMoneyOnHand.toFixed(2)}`"
          subtext="Pending drawer collection"
          :icon="DollarSign"
          color="amber"
        />
      </div>

      <!-- Personal Sales History Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden subtle-shadow">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <Receipt class="w-4.5 h-4.5 text-emerald-600" /> Personal Transaction History
          </h3>

          <div class="relative w-64">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search receipt ID..."
              class="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th class="py-3.5 px-4">Receipt #</th>
                <th class="py-3.5 px-4">Time</th>
                <th class="py-3.5 px-4">Branch Store</th>
                <th class="py-3.5 px-4 text-center">Items Count</th>
                <th class="py-3.5 px-4 text-right">Total Amount</th>
                <th class="py-3.5 px-4 text-center">Payment Method</th>
                <th class="py-3.5 px-4 text-center">Status</th>
                <th class="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-slate-50/80 transition-colors">
                <!-- Receipt ID -->
                <td class="py-3.5 px-4 font-mono font-bold text-emerald-600 text-sm">
                  {{ sale.id }}
                </td>

                <!-- Time -->
                <td class="py-3.5 px-4 text-slate-600 font-mono">
                  {{ sale.time }}
                </td>

                <!-- Branch -->
                <td class="py-3.5 px-4 font-bold text-slate-800">
                  {{ sale.branch }}
                </td>

                <!-- Items Count -->
                <td class="py-3.5 px-4 text-center font-bold text-slate-800">
                  {{ sale.itemsCount }} pcs
                </td>

                <!-- Total Amount -->
                <td class="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono text-sm">
                  ${{ Number(sale.total).toFixed(2) }}
                </td>

                <!-- Payment Method -->
                <td class="py-3.5 px-4 text-center">
                  <Badge :variant="sale.paymentMethod" />
                </td>

                <!-- Status -->
                <td class="py-3.5 px-4 text-center">
                  <Badge :variant="sale.status" />
                </td>

                <!-- Print Receipt Action -->
                <td class="py-3.5 px-4 text-right">
                  <button 
                    @click="openReceipt(sale)"
                    class="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                  >
                    <Printer class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Printable Receipt Modal -->
    <ReceiptModal 
      :show="showReceiptModal"
      :receipt="selectedReceiptForModal"
      @close="showReceiptModal = false"
    />
  </PosLayout>
</template>
