<script setup>
import { ref, computed } from 'vue'
import AppLayout from '../../Layouts/AppLayout.vue'
import Badge from '../../Components/Badge.vue'
import Modal from '../../Components/Modal.vue'
import { useCartStore } from '../../Stores/cartStore'
import { 
  Users, 
  Award, 
  DollarSign, 
  Ban, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Store, 
  Plus, 
  RotateCcw,
  Sparkles,
  ShieldAlert,
  UserCheck
} from 'lucide-vue-next'

const cartStore = useCartStore()

const sellers = ref([
  {
    id: 1,
    name: 'Sarah Jenkins',
    email: 'sarah.j@nexusretail.com',
    phone: '+1 (555) 111-2222',
    branch: 'Downtown Store',
    status: 'Active',
    totalProductsSold: 412,
    moneyOnHand: cartStore.sellerMoneyOnHand, // Dynamically linked to Pinia!
    isTopPerformer: true
  },
  {
    id: 2,
    name: 'David Ross',
    email: 'david.r@nexusretail.com',
    phone: '+1 (555) 333-4444',
    branch: 'Northside Hub',
    status: 'Active',
    totalProductsSold: 289,
    moneyOnHand: 180.00,
    isTopPerformer: false
  },
  {
    id: 3,
    name: 'Elena Gomez',
    email: 'elena.g@nexusretail.com',
    phone: '+1 (555) 555-6666',
    branch: 'Airport Kiosk',
    status: 'Active',
    totalProductsSold: 198,
    moneyOnHand: 0.00,
    isTopPerformer: false
  },
  {
    id: 4,
    name: 'Marcus Vance',
    email: 'marcus.v@nexusretail.com',
    phone: '+1 (555) 777-8888',
    branch: 'Downtown Store',
    status: 'Restricted',
    totalProductsSold: 140,
    moneyOnHand: 340.50,
    isTopPerformer: false
  }
])

// Active sellers sorted to top
const sortedSellers = computed(() => {
  return [...sellers.value].sort((a, b) => {
    if (a.status === 'Active' && b.status !== 'Active') return -1
    if (a.status !== 'Active' && b.status === 'Active') return 1
    return b.totalProductsSold - a.totalProductsSold
  })
})

const showSettleModal = ref(false)
const showAddSellerModal = ref(false)
const targetSellerForSettle = ref(null)

const newSeller = ref({
  name: '',
  email: '',
  phone: '',
  branch: 'Downtown Store'
})

const openSettleModal = (seller) => {
  targetSellerForSettle.value = seller
  showSettleModal.value = true
}

const confirmSettleCash = () => {
  if (!targetSellerForSettle.value) return
  
  if (targetSellerForSettle.value.id === 1) {
    cartStore.settleCash()
  }
  targetSellerForSettle.value.moneyOnHand = 0.00
  showSettleModal.value = false
  targetSellerForSettle.value = null
}

const toggleRestrictSeller = (seller) => {
  seller.status = seller.status === 'Active' ? 'Restricted' : 'Active'
}

const saveNewSeller = () => {
  if (!newSeller.value.name) return

  sellers.value.push({
    id: Date.now(),
    name: newSeller.value.name,
    email: newSeller.value.email || 'cashier@nexusretail.com',
    phone: newSeller.value.phone || '+1 (555) 000-0000',
    branch: newSeller.value.branch,
    status: 'Active',
    totalProductsSold: 0,
    moneyOnHand: 0.00,
    isTopPerformer: false
  })

  showAddSellerModal.value = false
  newSeller.value = { name: '', email: '', phone: '', branch: 'Downtown Store' }
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Title & Top Performer Spotlight Card -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Spotlight Banner -->
        <div class="lg:col-span-2 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-2xl p-6 text-white shadow-xl shadow-amber-500/20 flex flex-col justify-between relative overflow-hidden">
          <div class="flex items-start justify-between gap-4 z-10">
            <div>
              <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs">
                <Award class="w-4 h-4 text-amber-200" /> TOP PERFORMER SPOTLIGHT
              </span>
              <h2 class="text-2xl font-black mt-2 tracking-tight">Sarah Jenkins</h2>
              <p class="text-xs text-amber-100 mt-1">Downtown Branch • 412 Total Units Sold • $28,400 Sales Volume</p>
            </div>
            <div class="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center font-black text-xl">
              #1
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs z-10">
            <span>Cash Collection Status: <strong class="text-emerald-200">${{ cartStore.sellerMoneyOnHand.toFixed(2) }} Pending</strong></span>
            <button 
              @click="openSettleModal(sellers[0])"
              class="px-3.5 py-1.5 rounded-xl bg-white text-amber-950 hover:bg-amber-100 font-extrabold text-xs shadow-md transition-all"
            >
              Clear & Settle Cash
            </button>
          </div>
        </div>

        <!-- Add Seller Action Card -->
        <div class="bg-white rounded-2xl border border-slate-200/80 p-6 subtle-shadow flex flex-col justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900">Sales Staff Management</h3>
            <p class="text-xs text-slate-500 mt-0.5">Control cashier terminals, cash clearance, and account access.</p>
          </div>

          <button 
            @click="showAddSellerModal = true"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all mt-4"
          >
            <Plus class="w-4 h-4" /> Onboard New Sales Cashier
          </button>
        </div>
      </div>

      <!-- Seller Table (Active sorted to top) -->
      <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden subtle-shadow">
        <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users class="w-4.5 h-4.5 text-blue-600" /> Registered Sellers Directory (Active Sorted First)
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th class="py-3.5 px-4">Seller Name</th>
                <th class="py-3.5 px-4">Contact Info</th>
                <th class="py-3.5 px-4">Assigned Store Branch</th>
                <th class="py-3.5 px-4 text-center">Status</th>
                <th class="py-3.5 px-4 text-right">Products Sold</th>
                <th class="py-3.5 px-4 text-right">Uncollected "Money on Hand"</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="seller in sortedSellers" :key="seller.id" class="hover:bg-slate-50/80 transition-colors">
                <!-- Name & Spotlight -->
                <td class="py-3.5 px-4">
                  <div class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    {{ seller.name }}
                    <span v-if="seller.isTopPerformer" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      🏆 Top Cashier
                    </span>
                  </div>
                </td>

                <!-- Contact -->
                <td class="py-3.5 px-4">
                  <div class="text-slate-700 flex items-center gap-1">
                    <Mail class="w-3.5 h-3.5 text-slate-400" /> {{ seller.email }}
                  </div>
                  <div class="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone class="w-3 h-3 text-slate-400" /> {{ seller.phone }}
                  </div>
                </td>

                <!-- Branch -->
                <td class="py-3.5 px-4 font-bold text-slate-800">
                  <div class="flex items-center gap-1.5">
                    <Store class="w-3.5 h-3.5 text-blue-600" /> {{ seller.branch }}
                  </div>
                </td>

                <!-- Status -->
                <td class="py-3.5 px-4 text-center">
                  <Badge :variant="seller.status" />
                </td>

                <!-- Products Sold -->
                <td class="py-3.5 px-4 text-right font-bold text-slate-900 font-mono">
                  {{ seller.totalProductsSold }} pcs
                </td>

                <!-- Money on Hand -->
                <td class="py-3.5 px-4 text-right">
                  <span :class="['font-extrabold text-sm font-mono', seller.moneyOnHand > 0 ? 'text-emerald-600' : 'text-slate-400']">
                    ${{ Number(seller.id === 1 ? cartStore.sellerMoneyOnHand : seller.moneyOnHand).toFixed(2) }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <!-- Settle / Clear Cash Button -->
                    <button 
                      @click="openSettleModal(seller)"
                      :disabled="(seller.id === 1 ? cartStore.sellerMoneyOnHand : seller.moneyOnHand) === 0"
                      class="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 border border-emerald-200 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <RotateCcw class="w-3.5 h-3.5" /> Settle Cash
                    </button>

                    <!-- Restrict Toggle Kill-Switch -->
                    <button 
                      @click="toggleRestrictSeller(seller)"
                      :class="[
                        'px-2.5 py-1.5 rounded-lg font-bold text-xs border transition-colors flex items-center gap-1',
                        seller.status === 'Active' 
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200' 
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                      ]"
                    >
                      <Ban v-if="seller.status === 'Active'" class="w-3.5 h-3.5" />
                      <CheckCircle2 v-else class="w-3.5 h-3.5" />
                      <span>{{ seller.status === 'Active' ? 'Restrict' : 'Activate' }}</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal: Settle Cash -->
    <Modal :show="showSettleModal" title="Confirm Cash Collection & Settlement" maxWidth="max-w-md" @close="showSettleModal = false">
      <div v-if="targetSellerForSettle" class="space-y-4 text-slate-900">
        <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-start gap-3 text-xs">
          <DollarSign class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold">Cash Verification:</span> You are confirming physical receipt of cash balance from cashier <strong>{{ targetSellerForSettle.name }}</strong>.
          </div>
        </div>

        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <span class="text-xs text-slate-500 uppercase font-bold block">Cash Amount to Collect & Clear</span>
          <span class="text-3xl font-black text-emerald-600 font-mono mt-1 block">
            ${{ Number(targetSellerForSettle.id === 1 ? cartStore.sellerMoneyOnHand : targetSellerForSettle.moneyOnHand).toFixed(2) }}
          </span>
        </div>
      </div>

      <template #footer>
        <button @click="showSettleModal = false" class="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Cancel</button>
        <button @click="confirmSettleCash" class="px-4 py-2 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 text-xs font-bold shadow-md">Confirm Cash Collected & Reset to $0.00</button>
      </template>
    </Modal>

    <!-- Modal: Add Seller -->
    <Modal :show="showAddSellerModal" title="Onboard Sales Staff / Cashier" maxWidth="max-w-md" @close="showAddSellerModal = false">
      <form @submit.prevent="saveNewSeller" class="space-y-4 text-slate-900">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name</label>
          <input v-model="newSeller.name" type="text" required placeholder="e.g. Robert Drake" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address</label>
          <input v-model="newSeller.email" type="email" required placeholder="robert@nexusretail.com" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
          <input v-model="newSeller.phone" type="text" required placeholder="+1 (555) 000-0000" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Assigned Branch Store</label>
          <select v-model="newSeller.branch" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="Downtown Store">Downtown Store</option>
            <option value="Northside Hub">Northside Hub</option>
            <option value="Airport Kiosk">Airport Kiosk</option>
          </select>
        </div>
      </form>

      <template #footer>
        <button @click="showAddSellerModal = false" class="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Cancel</button>
        <button @click="saveNewSeller" class="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-xs font-semibold shadow-md">Add Cashier</button>
      </template>
    </Modal>
  </AppLayout>
</template>
