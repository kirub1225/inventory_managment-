<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import PosLayout from '../../Layouts/PosLayout.vue'
import Modal from '../../Components/Modal.vue'
import ReceiptModal from '../../Components/ReceiptModal.vue'
import { useCartStore } from '../../Stores/cartStore'
import { 
  Search, 
  QrCode, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  DollarSign, 
  CreditCard, 
  Smartphone, 
  Zap, 
  Printer, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  Tag,
  Store,
  Layers,
  ArrowRight
} from 'lucide-vue-next'

const cartStore = useCartStore()

const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = ['All', 'Electronics', 'Accessories', 'Furniture', 'Chargers']

const products = ref([
  {
    id: 1,
    name: 'Wireless Ergonomic Mouse',
    sku: 'MOU-WLS-ERG',
    barcode: '890123456701',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&auto=format&fit=crop&q=80',
    price: 45.00,
    unit: 'pcs',
    stock: 42
  },
  {
    id: 2,
    name: 'Mechanical Keyboard RGB',
    sku: 'KBD-MECH-RGB',
    barcode: '890123456702',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop&q=80',
    price: 89.00,
    unit: 'pcs',
    stock: 20
  },
  {
    id: 3,
    name: 'UltraHD Monitor 27"',
    sku: 'MON-27-UHD',
    barcode: '890123456703',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&auto=format&fit=crop&q=80',
    price: 499.00,
    unit: 'pcs',
    stock: 8
  },
  {
    id: 4,
    name: 'USB-C Fast Charger 65W',
    sku: 'CHG-65W-BLK',
    barcode: '890123456704',
    category: 'Chargers',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&auto=format&fit=crop&q=80',
    price: 35.00,
    unit: 'pcs',
    stock: 3
  },
  {
    id: 5,
    name: 'Ergonomic Standing Desk',
    sku: 'DSK-STD-WHT',
    barcode: '890123456705',
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=300&auto=format&fit=crop&q=80',
    price: 599.00,
    unit: 'pcs',
    stock: 0
  },
  {
    id: 6,
    name: 'HDMI 2.1 Cable 3m',
    sku: 'CBL-HDMI-21',
    barcode: '890123456706',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80',
    price: 25.00,
    unit: 'pcs',
    stock: 15
  }
])

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesCategory = selectedCategory.value === 'All' || p.category === selectedCategory.value
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          p.barcode.includes(searchQuery.value)
    return matchesCategory && matchesSearch
  })
})

// Barcode scanner listener handling auto-add on Enter key
const handleBarcodeScan = (e) => {
  if (e.key === 'Enter' && searchQuery.value.trim().length > 0) {
    const matchedProduct = products.value.find(p => p.barcode === searchQuery.value.trim() || p.sku.toLowerCase() === searchQuery.value.trim().toLowerCase())
    if (matchedProduct && matchedProduct.stock > 0) {
      cartStore.addToCart(matchedProduct)
      searchQuery.value = ''
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleBarcodeScan)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleBarcodeScan)
})

// Modal states
const showProductPopOver = ref(false)
const selectedProductPop = ref(null)
const popQty = ref(1)
const popCustomPrice = ref(0)

const showPaymentModal = ref(false)
const paymentMethod = ref('Cash')
const tenderedInput = ref('')

const completedReceipt = ref(null)
const showReceiptModal = ref(false)

const openProductPop = (product) => {
  if (product.stock <= 0) return
  selectedProductPop.value = product
  popQty.value = 1
  popCustomPrice.value = product.price
  showProductPopOver.value = true
}

const addPopToCart = () => {
  if (!selectedProductPop.value) return
  cartStore.addToCart(selectedProductPop.value, popQty.value, popCustomPrice.value)
  showProductPopOver.value = false
}

const sellNowDirect = () => {
  addPopToCart()
  showPaymentModal.value = true
}

const selectTenderedQuick = (amount) => {
  tenderedInput.value = amount.toString()
}

const changeDue = computed(() => {
  const tendered = Number(tenderedInput.value) || 0
  return Math.max(0, tendered - cartStore.totalAmount)
})

const processPayment = () => {
  if (paymentMethod.value === 'Cash' && Number(tenderedInput.value) < cartStore.totalAmount) {
    alert('Tendered cash amount is less than total due!')
    return
  }

  const receipt = cartStore.completeCheckout(paymentMethod.value, Number(tenderedInput.value) || cartStore.totalAmount)
  completedReceipt.value = receipt
  showPaymentModal.value = false
  tenderedInput.value = ''
  showReceiptModal.value = true
}
</script>

<template>
  <PosLayout>
    <!-- Split Screen Layout -->
    <div class="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-60px)]">
      <!-- Left Area (70%): Barcode search + Category Tabs + Product Grid -->
      <div class="w-full md:w-[70%] bg-slate-100 p-5 flex flex-col gap-4 overflow-y-auto">
        <!-- Barcode Search Bar -->
        <div class="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div class="relative flex-1">
            <QrCode class="w-5 h-5 text-emerald-600 absolute left-3.5 top-3" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Scan Barcode (Enter key auto-adds) or type product name/SKU..."
              class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autofocus
            />
          </div>

          <div class="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Zap class="w-4 h-4 text-emerald-600" /> Scanner Ready
          </div>
        </div>

        <!-- Category Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0',
              selectedCategory === cat 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-200/70'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Product Grid Cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 flex-1">
          <div 
            v-for="prod in filteredProducts" 
            :key="prod.id"
            @click="openProductPop(prod)"
            :class="[
              'bg-white rounded-2xl border p-3 flex flex-col justify-between transition-all relative overflow-hidden group select-none',
              prod.stock > 0 
                ? 'border-slate-200 hover:border-emerald-500 hover:shadow-lg cursor-pointer hover:-translate-y-1' 
                : 'border-slate-200 bg-slate-50/70 opacity-60 cursor-not-allowed'
            ]"
          >
            <!-- Image & Stock Badge -->
            <div class="relative mb-3 overflow-hidden rounded-xl bg-slate-100 aspect-square">
              <img :src="prod.image" :alt="prod.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              
              <span 
                :class="[
                  'absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm',
                  prod.stock === 0 ? 'bg-rose-600 text-white' : (prod.stock <= 5 ? 'bg-amber-500 text-white' : 'bg-slate-900/80 text-white backdrop-blur-md')
                ]"
              >
                {{ prod.stock === 0 ? 'OUT OF STOCK' : `${prod.stock} in stock` }}
              </span>
            </div>

            <!-- Product Details -->
            <div>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ prod.category }}</span>
              <h3 class="font-extrabold text-xs text-slate-900 line-clamp-2 mt-0.5">{{ prod.name }}</h3>
              <div class="text-[10px] text-slate-400 font-mono mt-0.5">{{ prod.sku }}</div>
            </div>

            <!-- Price & Quick Add Button -->
            <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span class="font-black text-sm text-emerald-600 font-mono">${{ prod.price.toFixed(2) }}</span>
              <button 
                :disabled="prod.stock <= 0"
                class="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Sidebar (30%): Active Cart Drawer (Pinia Store) -->
      <div class="w-full md:w-[30%] bg-white border-l border-slate-200 flex flex-col justify-between shadow-xl z-20">
        <!-- Cart Drawer Header -->
        <div class="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShoppingCart class="w-5 h-5 text-emerald-600" />
            <h2 class="font-extrabold text-sm text-slate-900 uppercase tracking-wider">Current Active Cart</h2>
          </div>
          <button 
            v-if="cartStore.cartItems.length > 0"
            @click="cartStore.clearCart"
            class="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
          >
            <Trash2 class="w-3.5 h-3.5" /> Clear Cart
          </button>
        </div>

        <!-- Cart Items List -->
        <div class="flex-1 p-4 overflow-y-auto divide-y divide-slate-100">
          <div v-if="cartStore.cartItems.length === 0" class="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <ShoppingCart class="w-12 h-12 stroke-1 text-slate-300 mb-2" />
            <h3 class="font-bold text-sm text-slate-600">Cart is currently empty</h3>
            <p class="text-xs text-slate-400 mt-1">Scan barcode or click items on the left to add to order.</p>
          </div>

          <div v-for="item in cartStore.cartItems" :key="item.id" class="py-3 flex items-center justify-between gap-3 text-xs">
            <div class="flex-1">
              <div class="font-bold text-slate-900">{{ item.name }}</div>
              
              <!-- Price Override field if admin enabled -->
              <div class="flex items-center gap-2 mt-1">
                <div v-if="cartStore.allowPriceOverride" class="flex items-center gap-1">
                  <span class="text-[10px] text-slate-400">$</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    :value="item.price"
                    @input="cartStore.updatePrice(item.id, $event.target.value)"
                    class="w-16 border border-slate-200 rounded px-1 py-0.5 text-xs font-mono font-bold text-emerald-700 bg-slate-50 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <span v-else class="font-mono text-emerald-600 font-bold">${{ item.price.toFixed(2) }}</span>
                <span class="text-[10px] text-slate-400">/ {{ item.unit }}</span>
              </div>
            </div>

            <!-- Qty Stepper -->
            <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button @click="cartStore.updateQty(item.id, -1)" class="p-1 rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors">
                <Minus class="w-3.5 h-3.5" />
              </button>
              <span class="font-extrabold text-xs w-6 text-center font-mono">{{ item.qty }}</span>
              <button @click="cartStore.updateQty(item.id, 1)" class="p-1 rounded text-slate-600 hover:bg-white hover:text-slate-900 transition-colors">
                <Plus class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Item Subtotal -->
            <div class="font-black text-slate-900 font-mono text-sm min-w-[60px] text-right">
              ${{ (item.price * item.qty).toFixed(2) }}
            </div>
          </div>
        </div>

        <!-- Cart Summary & Checkout Footer -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
          <div class="space-y-1.5 text-xs text-slate-600">
            <div class="flex justify-between">
              <span>Subtotal:</span>
              <span class="font-mono font-bold">${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Est. Tax (8%):</span>
              <span class="font-mono font-bold">${{ cartStore.taxAmount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
              <span>TOTAL DUE:</span>
              <span class="text-emerald-600 font-mono">${{ cartStore.totalAmount.toFixed(2) }}</span>
            </div>
          </div>

          <button 
            @click="showPaymentModal = true"
            :disabled="cartStore.cartItems.length === 0"
            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Zap class="w-5 h-5 fill-current" /> Complete Order & Payment
          </button>
        </div>
      </div>
    </div>

    <!-- Product Click Popover Modal -->
    <Modal :show="showProductPopOver" title="Add Item to Active Cart" maxWidth="max-w-md" @close="showProductPopOver = false">
      <div v-if="selectedProductPop" class="space-y-4 text-slate-900">
        <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <img :src="selectedProductPop.image" class="w-14 h-14 rounded-xl object-cover" />
          <div>
            <h3 class="font-extrabold text-sm text-slate-900">{{ selectedProductPop.name }}</h3>
            <span class="text-xs text-slate-400 font-mono">SKU: {{ selectedProductPop.sku }}</span>
            <div class="text-xs font-bold text-emerald-600 font-mono mt-0.5">${{ selectedProductPop.price.toFixed(2) }}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Quantity</label>
            <input v-model.number="popQty" type="number" min="1" :max="selectedProductPop.stock" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Unit Price ($) <span v-if="cartStore.allowPriceOverride" class="text-[10px] text-emerald-600">(Editable)</span>
            </label>
            <input 
              v-model.number="popCustomPrice" 
              type="number" 
              step="0.01" 
              :disabled="!cartStore.allowPriceOverride" 
              class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold font-mono focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-100" 
            />
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showProductPopOver = false" class="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Cancel</button>
        <button @click="addPopToCart" class="px-4 py-2 rounded-xl text-white bg-slate-900 hover:bg-slate-800 text-xs font-bold shadow-md">Add to Cart</button>
        <button @click="sellNowDirect" class="px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 text-xs font-bold shadow-md flex items-center gap-1">
          <Zap class="w-4 h-4 fill-current" /> ⚡ Sell Now
        </button>
      </template>
    </Modal>

    <!-- Payment Modal -->
    <Modal :show="showPaymentModal" title="Select Payment & Complete Order" maxWidth="max-w-lg" @close="showPaymentModal = false">
      <div class="space-y-4 text-slate-900">
        <!-- Amount Due Display -->
        <div class="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Amount Payable</span>
            <div class="text-3xl font-black text-emerald-400 font-mono mt-1">${{ cartStore.totalAmount.toFixed(2) }}</div>
          </div>
          <div class="text-right text-xs text-slate-400">
            <div>{{ cartStore.totalItemsCount }} Total Items</div>
            <div>Downtown Branch</div>
          </div>
        </div>

        <!-- Payment Method Tabs -->
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Payment Method</label>
          <div class="grid grid-cols-3 gap-3">
            <button 
              type="button"
              @click="paymentMethod = 'Cash'"
              :class="['p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all', paymentMethod === 'Cash' ? 'bg-emerald-50 border-emerald-600 text-emerald-800 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700']"
            >
              <DollarSign class="w-5 h-5 text-emerald-600" />
              <span class="text-xs">Cash</span>
            </button>

            <button 
              type="button"
              @click="paymentMethod = 'Card'"
              :class="['p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all', paymentMethod === 'Card' ? 'bg-blue-50 border-blue-600 text-blue-800 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700']"
            >
              <CreditCard class="w-5 h-5 text-blue-600" />
              <span class="text-xs">Credit Card / POS</span>
            </button>

            <button 
              type="button"
              @click="paymentMethod = 'Mobile'"
              :class="['p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all', paymentMethod === 'Mobile' ? 'bg-purple-50 border-purple-600 text-purple-800 font-bold shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-700']"
            >
              <Smartphone class="w-5 h-5 text-purple-600" />
              <span class="text-xs">Mobile Pay</span>
            </button>
          </div>
        </div>

        <!-- Tendered Amount Calculator (If Cash) -->
        <div v-if="paymentMethod === 'Cash'" class="space-y-3 pt-2 border-t border-slate-200">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tendered Cash Input ($)</label>
            <input 
              v-model="tenderedInput"
              type="number"
              step="0.01"
              placeholder="Enter cash received..."
              class="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-base font-bold font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          <!-- Quick Cash Buttons -->
          <div class="flex items-center gap-2">
            <button 
              v-for="amt in [10, 20, 50, 100, cartStore.totalAmount]" 
              :key="amt"
              @click="selectTenderedQuick(amt)"
              class="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold font-mono border border-slate-200 transition-colors"
            >
              ${{ Number(amt).toFixed(0) }}
            </button>
          </div>

          <!-- Change Due Calculator -->
          <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-900 uppercase">Change Due to Customer:</span>
            <span class="text-xl font-black text-emerald-600 font-mono">${{ changeDue.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <button @click="showPaymentModal = false" class="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Cancel</button>
        <button @click="processPayment" class="px-5 py-2.5 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 text-xs font-extrabold shadow-md flex items-center gap-2">
          <Printer class="w-4 h-4" /> Complete Sale & Print Receipt
        </button>
      </template>
    </Modal>

    <!-- Receipt Modal -->
    <ReceiptModal 
      :show="showReceiptModal"
      :receipt="completedReceipt"
      @close="showReceiptModal = false"
    />
  </PosLayout>
</template>
