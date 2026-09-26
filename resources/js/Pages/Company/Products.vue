<script setup>
import { ref, computed } from 'vue'
import { Link } from '@inertiajs/vue3'
import AppLayout from '../../Layouts/AppLayout.vue'
import Badge from '../../Components/Badge.vue'
import Modal from '../../Components/Modal.vue'
import { 
  Package, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  QrCode, 
  Boxes, 
  History, 
  Edit3, 
  TrendingUp, 
  AlertTriangle,
  Grid,
  CheckCircle2,
  DollarSign
} from 'lucide-vue-next'

const products = ref([
  {
    id: 1,
    name: 'Wireless Ergonomic Mouse',
    sku: 'MOU-WLS-ERG',
    barcode: '890123456701',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150&auto=format&fit=crop&q=80',
    unit: 'pcs',
    baseCost: 22.00,
    priceRange: '$45.00 - $48.00',
    totalStock: 68,
    status: 'In Stock',
    branchMatrix: {
      'Downtown Store': { stock: 42, price: 45.00, minAlert: 10 },
      'Northside Hub': { stock: 18, price: 45.00, minAlert: 5 },
      'Airport Kiosk': { stock: 8, price: 48.00, minAlert: 5 },
    }
  },
  {
    id: 2,
    name: 'Mechanical Keyboard RGB',
    sku: 'KBD-MECH-RGB',
    barcode: '890123456702',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=150&auto=format&fit=crop&q=80',
    unit: 'pcs',
    baseCost: 45.00,
    priceRange: '$89.00 - $95.00',
    totalStock: 34,
    status: 'In Stock',
    branchMatrix: {
      'Downtown Store': { stock: 20, price: 89.00, minAlert: 8 },
      'Northside Hub': { stock: 10, price: 89.00, minAlert: 5 },
      'Airport Kiosk': { stock: 4, price: 95.00, minAlert: 3 },
    }
  },
  {
    id: 3,
    name: 'UltraHD Monitor 27"',
    sku: 'MON-27-UHD',
    barcode: '890123456703',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150&auto=format&fit=crop&q=80',
    unit: 'pcs',
    baseCost: 280.00,
    priceRange: '$499.00',
    totalStock: 15,
    status: 'In Stock',
    branchMatrix: {
      'Downtown Store': { stock: 8, price: 499.00, minAlert: 3 },
      'Northside Hub': { stock: 5, price: 499.00, minAlert: 2 },
      'Airport Kiosk': { stock: 2, price: 499.00, minAlert: 1 },
    }
  },
  {
    id: 4,
    name: 'USB-C Fast Charger 65W',
    sku: 'CHG-65W-BLK',
    barcode: '890123456704',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=150&auto=format&fit=crop&q=80',
    unit: 'pcs',
    baseCost: 15.00,
    priceRange: '$35.00',
    totalStock: 3,
    status: 'Low Stock',
    branchMatrix: {
      'Downtown Store': { stock: 3, price: 35.00, minAlert: 10 },
      'Northside Hub': { stock: 0, price: 35.00, minAlert: 10 },
      'Airport Kiosk': { stock: 0, price: 35.00, minAlert: 5 },
    }
  },
  {
    id: 5,
    name: 'Ergonomic Standing Desk',
    sku: 'DSK-STD-WHT',
    barcode: '890123456705',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=150&auto=format&fit=crop&q=80',
    unit: 'pcs',
    baseCost: 310.00,
    priceRange: '$599.00',
    totalStock: 0,
    status: 'Out of Stock',
    branchMatrix: {
      'Downtown Store': { stock: 0, price: 599.00, minAlert: 5 },
      'Northside Hub': { stock: 0, price: 599.00, minAlert: 5 },
      'Airport Kiosk': { stock: 0, price: 599.00, minAlert: 2 },
    }
  }
])

const branchesList = ['Downtown Store', 'Northside Hub', 'Airport Kiosk']

const searchQuery = ref('')
const selectedStatusFilter = ref('All')

const showAdjustStockModal = ref(false)
const showAddProductModal = ref(false)
const selectedProductForAdjust = ref(null)

// Adjust stock form state
const adjustForm = ref({
  actionType: 'Restock',
  branch: 'Downtown Store',
  quantity: 10,
  updatedUnitCost: 0,
  reason: 'Regular Supplier Restock Batch'
})

// Add Product form state
const newProduct = ref({
  name: '',
  sku: '',
  barcode: '',
  unit: 'pcs',
  baseCost: 10.00,
  matrix: {
    'Downtown Store': { stock: 20, price: 25.00, minAlert: 5 },
    'Northside Hub': { stock: 15, price: 25.00, minAlert: 5 },
    'Airport Kiosk': { stock: 10, price: 28.00, minAlert: 3 }
  }
})

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.barcode.includes(searchQuery.value)
    
    const matchesStatus = selectedStatusFilter.value === 'All' || p.status === selectedStatusFilter.value
    return matchesSearch && matchesStatus
  })
})

const openAdjustModal = (product) => {
  selectedProductForAdjust.value = product
  adjustForm.value = {
    actionType: 'Restock',
    branch: 'Downtown Store',
    quantity: 10,
    updatedUnitCost: product.baseCost,
    reason: 'Restock lot received'
  }
  showAdjustStockModal.value = true
}

const saveAdjustStock = () => {
  if (!selectedProductForAdjust.value) return
  const prod = products.value.find(p => p.id === selectedProductForAdjust.value.id)
  if (prod) {
    const qty = Number(adjustForm.value.quantity)
    const branch = adjustForm.value.branch

    if (adjustForm.value.actionType === 'Restock') {
      prod.branchMatrix[branch].stock += qty
      prod.totalStock += qty
    } else {
      prod.branchMatrix[branch].stock = Math.max(0, prod.branchMatrix[branch].stock - qty)
      prod.totalStock = Math.max(0, prod.totalStock - qty)
    }

    // Update status badge
    if (prod.totalStock === 0) prod.status = 'Out of Stock'
    else if (prod.totalStock < 10) prod.status = 'Low Stock'
    else prod.status = 'In Stock'
  }

  showAdjustStockModal.value = false
}

const saveNewProduct = () => {
  if (!newProduct.value.name) return

  const totalStk = Object.values(newProduct.value.matrix).reduce((acc, curr) => acc + Number(curr.stock), 0)

  products.value.unshift({
    id: Date.now(),
    name: newProduct.value.name,
    sku: newProduct.value.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
    barcode: newProduct.value.barcode || '89012345' + Math.floor(1000 + Math.random() * 9000),
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150&auto=format&fit=crop&q=80',
    unit: newProduct.value.unit,
    baseCost: Number(newProduct.value.baseCost),
    priceRange: `$${Number(newProduct.value.matrix['Downtown Store'].price).toFixed(2)}`,
    totalStock: totalStk,
    status: totalStk > 10 ? 'In Stock' : (totalStk > 0 ? 'Low Stock' : 'Out of Stock'),
    branchMatrix: JSON.parse(JSON.stringify(newProduct.value.matrix))
  })

  showAddProductModal.value = false
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 subtle-shadow">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Master Product Catalog & Multi-Branch Matrix</h2>
          <p class="text-xs text-slate-500 mt-0.5">Manage master catalog items, branch pricing, stock alerts, and batch histories.</p>
        </div>

        <button 
          @click="showAddProductModal = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
        >
          <Plus class="w-4 h-4" /> Add Master Product
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 subtle-shadow flex flex-wrap items-center justify-between gap-4">
        <div class="relative flex-1 min-w-[240px]">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by product name, SKU, or scan barcode..."
            class="bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 w-full outline-none"
          />
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs font-bold text-slate-600">Stock Status:</span>
          <select 
            v-model="selectedStatusFilter"
            class="bg-slate-100 border border-slate-200 text-slate-800 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <!-- Product Data Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden subtle-shadow">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th class="py-3.5 px-4">Item & Identifiers</th>
                <th class="py-3.5 px-4">Base Cost</th>
                <th class="py-3.5 px-4">Branch Selling Price Range</th>
                <th class="py-3.5 px-4">Multi-Branch Live Stock Breakdown</th>
                <th class="py-3.5 px-4 text-center">Status</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="prod in filteredProducts" :key="prod.id" class="hover:bg-slate-50/80 transition-colors">
                <!-- Image, Name, SKU, Barcode -->
                <td class="py-3.5 px-4">
                  <div class="flex items-center gap-3">
                    <img :src="prod.image" :alt="prod.name" class="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div>
                      <div class="font-bold text-slate-900 text-sm">{{ prod.name }}</div>
                      <div class="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span>SKU: {{ prod.sku }}</span>
                        <span>•</span>
                        <span class="flex items-center gap-1"><QrCode class="w-3 h-3 text-slate-500" /> {{ prod.barcode }}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- Base Cost -->
                <td class="py-3.5 px-4 font-bold text-slate-700 font-mono">
                  ${{ Number(prod.baseCost).toFixed(2) }} / {{ prod.unit }}
                </td>

                <!-- Price Range -->
                <td class="py-3.5 px-4">
                  <span class="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold font-mono">
                    {{ prod.priceRange }}
                  </span>
                </td>

                <!-- Multi-Branch Stock Matrix Breakdown -->
                <td class="py-3.5 px-4">
                  <div class="flex flex-wrap gap-1.5">
                    <span 
                      v-for="(stk, bName) in prod.branchMatrix" 
                      :key="bName"
                      :class="[
                        'px-2 py-1 rounded-md text-[11px] font-semibold border flex items-center gap-1',
                        stk.stock === 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                        stk.stock <= stk.minAlert ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'
                      ]"
                    >
                      <span class="font-bold">{{ bName.split(' ')[0] }}:</span> {{ stk.stock }} {{ prod.unit }}
                    </span>
                  </div>
                </td>

                <!-- Status Badge -->
                <td class="py-3.5 px-4 text-center">
                  <Badge :variant="prod.status" />
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button 
                      @click="openAdjustModal(prod)"
                      class="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs transition-colors"
                    >
                      Adjust Stock
                    </button>

                    <Link 
                      :href="`/company/products/${prod.id}/batches`"
                      class="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <History class="w-3.5 h-3.5" /> Batches
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal: Adjust Stock -->
    <Modal :show="showAdjustStockModal" title="Stock Adjustment & Audit Entry" maxWidth="max-w-md" @close="showAdjustStockModal = false">
      <div v-if="selectedProductForAdjust" class="space-y-4 text-slate-900">
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
          <img :src="selectedProductForAdjust.image" class="w-10 h-10 rounded-lg object-cover" />
          <div>
            <div class="font-bold text-xs text-slate-900">{{ selectedProductForAdjust.name }}</div>
            <div class="text-[10px] text-slate-500">SKU: {{ selectedProductForAdjust.sku }}</div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Action Type</label>
          <div class="grid grid-cols-2 gap-2">
            <button 
              type="button"
              @click="adjustForm.actionType = 'Restock'"
              :class="['py-2 rounded-xl text-xs font-bold border transition-all', adjustForm.actionType === 'Restock' ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200']"
            >
              + Restock Inventory
            </button>
            <button 
              type="button"
              @click="adjustForm.actionType = 'Damage/Loss'"
              :class="['py-2 rounded-xl text-xs font-bold border transition-all', adjustForm.actionType === 'Damage/Loss' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200']"
            >
              - Damage / Loss
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Branch</label>
            <select v-model="adjustForm.branch" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none">
              <option v-for="b in branchesList" :key="b" :value="b">{{ b }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Quantity</label>
            <input v-model="adjustForm.quantity" type="number" min="1" required class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Updated Unit Cost ($)</label>
          <input v-model="adjustForm.updatedUnitCost" type="number" step="0.01" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Reason / Audit Note</label>
          <input v-model="adjustForm.reason" type="text" placeholder="e.g. Supplier Batch #4092" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <template #footer>
        <button @click="showAdjustStockModal = false" class="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Cancel</button>
        <button @click="saveAdjustStock" class="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-xs font-semibold shadow-md">Apply Adjustment</button>
      </template>
    </Modal>

    <!-- Modal: Add Product with Multi-Branch Stock Matrix Grid -->
    <Modal :show="showAddProductModal" title="Add Master Product & Multi-Branch Matrix" maxWidth="max-w-2xl" @close="showAddProductModal = false">
      <form @submit.prevent="saveNewProduct" class="space-y-4 text-slate-900">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Product Name</label>
            <input v-model="newProduct.name" type="text" required placeholder="e.g. Wireless Gaming Headset" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">SKU</label>
            <input v-model="newProduct.sku" type="text" placeholder="HDST-WLS-99" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
          </div>
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Barcode Scanner Input</label>
            <div class="relative">
              <QrCode class="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              <input v-model="newProduct.barcode" type="text" placeholder="890123456799" class="w-full border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Measurement Unit</label>
            <select v-model="newProduct.unit" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="pcs">pcs (Pieces)</option>
              <option value="kg">kg (Kilograms)</option>
              <option value="L">L (Liters)</option>
              <option value="meter">meter (Meters)</option>
              <option value="box">box (Boxes)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Base Cost Price ($)</label>
            <input v-model="newProduct.baseCost" type="number" step="0.01" required class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
          </div>
        </div>

        <!-- Multi-Branch Stock Matrix Grid Section -->
        <div class="pt-3 border-t border-slate-200">
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Grid class="w-4 h-4 text-blue-600" /> Multi-Branch Initial Stock & Selling Price Matrix
            </h4>
            <span class="text-[10px] text-slate-500">Configure parameters per store branch</span>
          </div>

          <div class="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-3">
            <div v-for="branchName in branchesList" :key="branchName" class="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
              <div class="col-span-3 font-bold text-slate-800">{{ branchName }}</div>
              
              <div class="col-span-3">
                <span class="text-[10px] text-slate-400 block mb-0.5">Initial Stock Qty</span>
                <input v-model="newProduct.matrix[branchName].stock" type="number" min="0" class="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div class="col-span-3">
                <span class="text-[10px] text-slate-400 block mb-0.5">Branch Selling Price ($)</span>
                <input v-model="newProduct.matrix[branchName].price" type="number" step="0.01" class="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
              </div>

              <div class="col-span-3">
                <span class="text-[10px] text-slate-400 block mb-0.5">Min Stock Alert Qty</span>
                <input v-model="newProduct.matrix[branchName].minAlert" type="number" min="1" class="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>
      </form>

      <template #footer>
        <button @click="showAddProductModal = false" class="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Cancel</button>
        <button @click="saveNewProduct" class="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-xs font-semibold shadow-md">Create Master Product & Matrix</button>
      </template>
    </Modal>
  </AppLayout>
</template>
