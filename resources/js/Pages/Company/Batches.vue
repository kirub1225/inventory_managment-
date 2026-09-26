<script setup>
import { ref } from 'vue'
import { Link } from '@inertiajs/vue3'
import AppLayout from '../../Layouts/AppLayout.vue'
import Badge from '../../Components/Badge.vue'
import { 
  Package, 
  ArrowLeft, 
  QrCode, 
  Boxes, 
  History, 
  TrendingUp, 
  Calendar, 
  Store, 
  CheckCircle2,
  DollarSign
} from 'lucide-vue-next'

const product = ref({
  id: 1,
  name: 'Wireless Ergonomic Mouse',
  sku: 'MOU-WLS-ERG',
  barcode: '890123456701',
  image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=80',
  unit: 'pcs',
  totalStock: 68,
  sellingPrice: 45.00
})

const batches = ref([
  {
    lotId: 'LOT-2025-0891',
    branch: 'Downtown Store',
    stockDate: '2025-08-14 09:30 AM',
    costPrice: 22.00,
    receivedQty: 50,
    soldQty: 32,
    remainingQty: 18,
    revenue: 1440.00,
    profit: 736.00,
    status: 'Active'
  },
  {
    lotId: 'LOT-2025-0812',
    branch: 'Downtown Store',
    stockDate: '2025-07-20 11:15 AM',
    costPrice: 20.50,
    receivedQty: 40,
    soldQty: 40,
    remainingQty: 0,
    revenue: 1800.00,
    profit: 980.00,
    status: 'Completed'
  },
  {
    lotId: 'LOT-2025-0744',
    branch: 'Northside Hub',
    stockDate: '2025-08-01 02:45 PM',
    costPrice: 22.00,
    receivedQty: 30,
    soldQty: 12,
    remainingQty: 18,
    revenue: 540.00,
    profit: 276.00,
    status: 'Active'
  },
  {
    lotId: 'LOT-2025-0690',
    branch: 'Airport Kiosk',
    stockDate: '2025-08-10 10:00 AM',
    costPrice: 23.00,
    receivedQty: 15,
    soldQty: 7,
    remainingQty: 8,
    revenue: 336.00,
    profit: 175.00,
    status: 'Active'
  }
])
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Back button & Product Header Summary -->
      <div>
        <Link href="/company/products" class="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mb-3">
          <ArrowLeft class="w-3.5 h-3.5" /> Back to Product Catalog
        </Link>

        <div class="bg-white p-5 rounded-2xl border border-slate-200/80 subtle-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <img :src="product.image" :alt="product.name" class="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm" />
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">{{ product.name }}</h2>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {{ product.unit }}
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono mt-1">
                <span>SKU: <strong class="text-slate-800">{{ product.sku }}</strong></span>
                <span>•</span>
                <span class="flex items-center gap-1"><QrCode class="w-3.5 h-3.5" /> Barcode: <strong class="text-slate-800">{{ product.barcode }}</strong></span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6 text-xs">
            <div>
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Total Branch Stock</span>
              <span class="text-xl font-black text-slate-900">{{ product.totalStock }} {{ product.unit }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px] uppercase font-bold">Selling Price</span>
              <span class="text-xl font-black text-emerald-600">${{ product.sellingPrice.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Batch Table & Stock Ledger -->
      <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden subtle-shadow">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <History class="w-4.5 h-4.5 text-blue-600" /> FIFO Stock Batch Ledger History
            </h3>
            <p class="text-xs text-slate-500">Track cost of goods sold, remaining lot inventory, and lot profitability.</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th class="py-3.5 px-4">Batch / Lot Reference ID</th>
                <th class="py-3.5 px-4">Branch Store</th>
                <th class="py-3.5 px-4">Stock Date/Time</th>
                <th class="py-3.5 px-4">Cost Price / Unit</th>
                <th class="py-3.5 px-4 text-center">Received / Sold / Remaining</th>
                <th class="py-3.5 px-4 text-right">Total Revenue</th>
                <th class="py-3.5 px-4 text-right">Batch Net Profit</th>
                <th class="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="batch in batches" :key="batch.lotId" class="hover:bg-slate-50/80 transition-colors">
                <!-- Lot Ref ID -->
                <td class="py-3.5 px-4">
                  <div class="font-mono font-extrabold text-slate-900 text-sm">{{ batch.lotId }}</div>
                </td>

                <!-- Branch -->
                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-800 flex items-center gap-1.5">
                    <Store class="w-3.5 h-3.5 text-blue-600" /> {{ batch.branch }}
                  </div>
                </td>

                <!-- Stock Date -->
                <td class="py-3.5 px-4 text-slate-600 font-mono">
                  <div class="flex items-center gap-1.5">
                    <Calendar class="w-3.5 h-3.5 text-slate-400" /> {{ batch.stockDate }}
                  </div>
                </td>

                <!-- Cost Price -->
                <td class="py-3.5 px-4 font-bold text-slate-800 font-mono">
                  ${{ Number(batch.costPrice).toFixed(2) }}
                </td>

                <!-- Qty breakdown -->
                <td class="py-3.5 px-4 text-center">
                  <span class="px-2 py-1 bg-slate-100 rounded-md font-mono text-[11px] font-bold text-slate-800 border border-slate-200">
                    {{ batch.receivedQty }} Rec | <span class="text-blue-600">{{ batch.soldQty }} Sold</span> | <span class="text-emerald-600">{{ batch.remainingQty }} Rem</span>
                  </span>
                </td>

                <!-- Revenue -->
                <td class="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                  ${{ Number(batch.revenue).toFixed(2) }}
                </td>

                <!-- Net Profit -->
                <td class="py-3.5 px-4 text-right font-extrabold text-emerald-600 font-mono">
                  +${{ Number(batch.profit).toFixed(2) }}
                </td>

                <!-- Status -->
                <td class="py-3.5 px-4 text-center">
                  <Badge :variant="batch.status === 'Active' ? 'active' : 'completed'" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
