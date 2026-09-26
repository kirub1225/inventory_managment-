<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../../Layouts/AppLayout.vue'
import Badge from '../../Components/Badge.vue'
import ReceiptModal from '../../Components/ReceiptModal.vue'
import { 
  Receipt, 
  Download, 
  Filter, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Calendar, 
  Store, 
  User, 
  Printer,
  FileSpreadsheet
} from 'lucide-vue-next'

const sales = ref([
  {
    id: 'REC-9082',
    dateTime: '2025-08-26 14:32',
    branch: 'Downtown Store',
    seller: 'Sarah Jenkins',
    itemsCount: 3,
    totalAmount: 145.00,
    cogs: 67.00,
    netProfit: 78.00,
    paymentMethod: 'Cash',
    status: 'Completed',
    lineItems: [
      { name: 'Wireless Ergonomic Mouse', qty: 2, price: 45.00, cost: 22.00 },
      { name: 'USB-C Fast Charger 65W', qty: 1, price: 55.00, cost: 23.00 }
    ]
  },
  {
    id: 'REC-9081',
    dateTime: '2025-08-26 13:15',
    branch: 'Northside Hub',
    seller: 'David Ross',
    itemsCount: 1,
    totalAmount: 499.00,
    cogs: 280.00,
    netProfit: 219.00,
    paymentMethod: 'Card',
    status: 'Completed',
    lineItems: [
      { name: 'UltraHD Monitor 27"', qty: 1, price: 499.00, cost: 280.00 }
    ]
  },
  {
    id: 'REC-9080',
    dateTime: '2025-08-26 11:40',
    branch: 'Airport Kiosk',
    seller: 'Elena Gomez',
    itemsCount: 2,
    totalAmount: 180.00,
    cogs: 90.00,
    netProfit: 90.00,
    paymentMethod: 'Mobile',
    status: 'Completed',
    lineItems: [
      { name: 'Mechanical Keyboard RGB', qty: 2, price: 90.00, cost: 45.00 }
    ]
  },
  {
    id: 'REC-9079',
    dateTime: '2025-08-25 16:50',
    branch: 'Downtown Store',
    seller: 'Sarah Jenkins',
    itemsCount: 4,
    totalAmount: 235.00,
    cogs: 110.00,
    netProfit: 125.00,
    paymentMethod: 'Cash',
    status: 'Completed',
    lineItems: [
      { name: 'Wireless Ergonomic Mouse', qty: 3, price: 45.00, cost: 22.00 },
      { name: 'HDMI 2.1 Cable 3m', qty: 1, price: 100.00, cost: 44.00 }
    ]
  },
  {
    id: 'REC-9078',
    dateTime: '2025-08-25 10:20',
    branch: 'Downtown Store',
    seller: 'Marcus Vance',
    itemsCount: 1,
    totalAmount: 35.00,
    cogs: 15.00,
    netProfit: 20.00,
    paymentMethod: 'Card',
    status: 'Completed',
    lineItems: [
      { name: 'USB-C Fast Charger 65W', qty: 1, price: 35.00, cost: 15.00 }
    ]
  }
])

const filterBranch = ref('All')
const filterSeller = ref('All')
const filterPayment = ref('All')
const searchQuery = ref('')

const expandedRows = ref(new Set())
const selectedReceiptForModal = ref(null)
const showReceiptModal = ref(false)

const filteredSales = computed(() => {
  return sales.value.filter(s => {
    const matchesBranch = filterBranch.value === 'All' || s.branch === filterBranch.value
    const matchesSeller = filterSeller.value === 'All' || s.seller === filterSeller.value
    const matchesPayment = filterPayment.value === 'All' || s.paymentMethod === filterPayment.value
    const matchesSearch = s.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          s.seller.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          s.branch.toLowerCase().includes(searchQuery.value.toLowerCase())

    return matchesBranch && matchesSeller && matchesPayment && matchesSearch
  })
})

// Financial Totals Bar
const totals = computed(() => {
  const rev = filteredSales.value.reduce((acc, s) => acc + s.totalAmount, 0)
  const cost = filteredSales.value.reduce((acc, s) => acc + s.cogs, 0)
  const profit = filteredSales.value.reduce((acc, s) => acc + s.netProfit, 0)

  return {
    revenue: rev,
    cogs: cost,
    netProfit: profit,
    margin: rev > 0 ? ((profit / rev) * 100).toFixed(1) : '0.0'
  }
})

const toggleRow = (id) => {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
}

const openReceipt = (sale) => {
  selectedReceiptForModal.value = sale
  showReceiptModal.value = true
}

const downloadCSV = () => {
  const headers = ['Receipt #', 'Date Time', 'Branch', 'Seller', 'Items Count', 'Total Amount ($)', 'COGS ($)', 'Net Profit ($)', 'Payment Method']
  const csvRows = [headers.join(',')]

  filteredSales.value.forEach(s => {
    csvRows.push([
      s.id,
      `"${s.dateTime}"`,
      `"${s.branch}"`,
      `"${s.seller}"`,
      s.itemsCount,
      s.totalAmount.toFixed(2),
      s.cogs.toFixed(2),
      s.netProfit.toFixed(2),
      s.paymentMethod
    ].join(','))
  })

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sales_audit_report_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Title & Download CSV Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 subtle-shadow">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Sales & Financial Transaction Audit</h2>
          <p class="text-xs text-slate-500 mt-0.5">Audit itemized receipt sales, cost of goods sold (COGS), and FIFO net profitability.</p>
        </div>

        <button 
          @click="downloadCSV"
          class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Download class="w-4 h-4" /> Download CSV Export
        </button>
      </div>

      <!-- Financial Totals Summary Bar -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div class="bg-blue-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <span class="text-[11px] uppercase tracking-wider opacity-80 font-bold">Filtered Revenue</span>
            <div class="text-2xl font-black font-mono mt-0.5">${{ totals.revenue.toFixed(2) }}</div>
          </div>
          <DollarSign class="w-7 h-7 opacity-75" />
        </div>

        <div class="bg-slate-800 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold">COGS (Product Cost)</span>
            <div class="text-2xl font-black font-mono mt-0.5 text-slate-200">${{ totals.cogs.toFixed(2) }}</div>
          </div>
          <ShoppingBag class="w-7 h-7 text-slate-400" />
        </div>

        <div class="bg-emerald-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <span class="text-[11px] uppercase tracking-wider opacity-80 font-bold">Filtered Net Profit</span>
            <div class="text-2xl font-black font-mono mt-0.5">${{ totals.netProfit.toFixed(2) }}</div>
          </div>
          <TrendingUp class="w-7 h-7 opacity-75" />
        </div>

        <div class="bg-purple-600 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
          <div>
            <span class="text-[11px] uppercase tracking-wider opacity-80 font-bold">Profit Margin</span>
            <div class="text-2xl font-black font-mono mt-0.5">{{ totals.margin }}%</div>
          </div>
          <span class="text-xl font-bold">FIFO</span>
        </div>
      </div>

      <!-- Multi-Filter Bar -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 subtle-shadow flex flex-wrap items-center justify-between gap-4">
        <div class="relative flex-1 min-w-[200px]">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search receipt #, seller, branch..."
            class="bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 w-full outline-none"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-1 text-xs text-slate-600">
            <Store class="w-3.5 h-3.5 text-blue-600" />
            <span>Branch:</span>
            <select v-model="filterBranch" class="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold outline-none">
              <option value="All">All Branches</option>
              <option value="Downtown Store">Downtown Store</option>
              <option value="Northside Hub">Northside Hub</option>
              <option value="Airport Kiosk">Airport Kiosk</option>
            </select>
          </div>

          <div class="flex items-center gap-1 text-xs text-slate-600">
            <User class="w-3.5 h-3.5 text-blue-600" />
            <span>Seller:</span>
            <select v-model="filterSeller" class="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold outline-none">
              <option value="All">All Sellers</option>
              <option value="Sarah Jenkins">Sarah Jenkins</option>
              <option value="David Ross">David Ross</option>
              <option value="Elena Gomez">Elena Gomez</option>
              <option value="Marcus Vance">Marcus Vance</option>
            </select>
          </div>

          <div class="flex items-center gap-1 text-xs text-slate-600">
            <span>Payment:</span>
            <select v-model="filterPayment" class="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold outline-none">
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Mobile">Mobile</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Expandable Receipt Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden subtle-shadow">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th class="w-10"></th>
                <th class="py-3.5 px-4">Receipt #</th>
                <th class="py-3.5 px-4">Date / Time</th>
                <th class="py-3.5 px-4">Branch</th>
                <th class="py-3.5 px-4">Sales Cashier</th>
                <th class="py-3.5 px-4 text-center">Items</th>
                <th class="py-3.5 px-4 text-right">Total Amount</th>
                <th class="py-3.5 px-4 text-right">Net Profit</th>
                <th class="py-3.5 px-4 text-center">Payment</th>
                <th class="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <template v-for="sale in filteredSales" :key="sale.id">
                <!-- Main Row -->
                <tr class="hover:bg-slate-50/80 transition-colors cursor-pointer" @click="toggleRow(sale.id)">
                  <td class="py-3.5 px-3 text-center">
                    <button class="p-1 rounded text-slate-400 hover:bg-slate-200">
                      <ChevronDown v-if="!expandedRows.has(sale.id)" class="w-4 h-4" />
                      <ChevronUp v-else class="w-4 h-4 text-blue-600" />
                    </button>
                  </td>

                  <td class="py-3.5 px-4 font-mono font-bold text-blue-600 text-sm">
                    {{ sale.id }}
                  </td>

                  <td class="py-3.5 px-4 text-slate-600 font-mono">
                    {{ sale.dateTime }}
                  </td>

                  <td class="py-3.5 px-4 font-bold text-slate-800">
                    {{ sale.branch }}
                  </td>

                  <td class="py-3.5 px-4 font-semibold text-slate-700">
                    {{ sale.seller }}
                  </td>

                  <td class="py-3.5 px-4 text-center font-bold text-slate-800">
                    {{ sale.itemsCount }} pcs
                  </td>

                  <td class="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono text-sm">
                    ${{ sale.totalAmount.toFixed(2) }}
                  </td>

                  <td class="py-3.5 px-4 text-right font-extrabold text-emerald-600 font-mono text-sm">
                    +${{ sale.netProfit.toFixed(2) }}
                  </td>

                  <td class="py-3.5 px-4 text-center">
                    <Badge :variant="sale.paymentMethod" />
                  </td>

                  <td class="py-3.5 px-4 text-right" @click.stop>
                    <button 
                      @click="openReceipt(sale)"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                    >
                      <Printer class="w-4 h-4" />
                    </button>
                  </td>
                </tr>

                <!-- Expanded Line Items Row -->
                <tr v-if="expandedRows.has(sale.id)" class="bg-slate-50/90 border-y border-slate-200/80">
                  <td colspan="10" class="p-4 pl-12">
                    <div class="bg-white rounded-xl border border-slate-200 p-3">
                      <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Itemized Breakdown for {{ sale.id }}</h4>
                      <table class="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                            <th class="py-2 px-3">Product Name</th>
                            <th class="py-2 px-3 text-center">Quantity</th>
                            <th class="py-2 px-3 text-right">Selling Price</th>
                            <th class="py-2 px-3 text-right">Unit FIFO Cost</th>
                            <th class="py-2 px-3 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                          <tr v-for="(item, idx) in sale.lineItems" :key="idx">
                            <td class="py-2 px-3 font-bold text-slate-800">{{ item.name }}</td>
                            <td class="py-2 px-3 text-center font-bold text-slate-700">{{ item.qty }}</td>
                            <td class="py-2 px-3 text-right font-mono">${{ Number(item.price).toFixed(2) }}</td>
                            <td class="py-2 px-3 text-right font-mono text-slate-500">${{ Number(item.cost).toFixed(2) }}</td>
                            <td class="py-2 px-3 text-right font-mono font-bold text-slate-900">${{ (item.qty * item.price).toFixed(2) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </template>
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
  </AppLayout>
</template>
