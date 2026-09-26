<script setup>
import { ref, computed } from 'vue'
import SuperAdminLayout from '../../Layouts/SuperAdminLayout.vue'
import Badge from '../../Components/Badge.vue'
import Modal from '../../Components/Modal.vue'
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  ShieldAlert, 
  CheckCircle, 
  Ban, 
  Mail, 
  Phone, 
  User, 
  Globe, 
  CreditCard,
  Trash2,
  ExternalLink
} from 'lucide-vue-next'

const companies = ref([
  {
    id: 1,
    name: 'Nexus Retail Chains',
    subdomain: 'nexus-retail.yoursaas.com',
    adminName: 'Alex Sterling',
    adminEmail: 'alex@nexusretail.com',
    adminPhone: '+1 (555) 234-5678',
    planTier: 'Enterprise Pro',
    startDate: '2025-01-15',
    paymentStatus: 'Paid',
    accountStatus: 'Active'
  },
  {
    id: 2,
    name: 'Apex Supermarkets',
    subdomain: 'apex-mart.yoursaas.com',
    adminName: 'Sarah Jenkins',
    adminEmail: 'sarah@apexmart.com',
    adminPhone: '+1 (555) 987-6543',
    planTier: 'Multi-Branch Pro',
    startDate: '2025-03-01',
    paymentStatus: 'Paid',
    accountStatus: 'Active'
  },
  {
    id: 3,
    name: 'Starlight Electronics',
    subdomain: 'starlight.yoursaas.com',
    adminName: 'Michael Vance',
    adminEmail: 'mvance@starlight.io',
    adminPhone: '+1 (555) 456-7890',
    planTier: 'Starter Tier',
    startDate: '2025-05-12',
    paymentStatus: 'Unpaid',
    accountStatus: 'Restricted'
  },
  {
    id: 4,
    name: 'Urban Fashion Hub',
    subdomain: 'urban-hub.yoursaas.com',
    adminName: 'Elena Rostova',
    adminEmail: 'elena@urbanfashion.com',
    adminPhone: '+1 (555) 321-6549',
    planTier: 'Multi-Branch Pro',
    startDate: '2025-06-20',
    paymentStatus: 'Paid',
    accountStatus: 'Active'
  },
  {
    id: 5,
    name: 'GreenGrocers Co',
    subdomain: 'greengrocers.yoursaas.com',
    adminName: 'David Miller',
    adminEmail: 'dmiller@greengrocers.org',
    adminPhone: '+1 (555) 789-0123',
    planTier: 'Starter Tier',
    startDate: '2025-08-04',
    paymentStatus: 'Trial',
    accountStatus: 'Active'
  }
])

const searchQuery = ref('')
const selectedPaymentFilter = ref('All')
const selectedAccountFilter = ref('All')

const showAddModal = ref(false)
const showRestrictModal = ref(false)
const targetCompanyForRestrict = ref(null)

const newCompany = ref({
  name: '',
  subdomain: '',
  adminName: '',
  adminEmail: '',
  adminPhone: '',
  planTier: 'Multi-Branch Pro',
  billingCycle: 'Monthly',
  paymentStatus: 'Paid'
})

const filteredCompanies = computed(() => {
  return companies.value.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          c.subdomain.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          c.adminName.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesPayment = selectedPaymentFilter.value === 'All' || c.paymentStatus === selectedPaymentFilter.value
    const matchesAccount = selectedAccountFilter.value === 'All' || c.accountStatus === selectedAccountFilter.value

    return matchesSearch && matchesPayment && matchesAccount
  })
})

const openAddModal = () => {
  newCompany.value = {
    name: '',
    subdomain: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    planTier: 'Multi-Branch Pro',
    billingCycle: 'Monthly',
    paymentStatus: 'Paid'
  }
  showAddModal.value = true
}

const saveCompany = () => {
  if (!newCompany.value.name || !newCompany.value.subdomain) return
  
  companies.value.unshift({
    id: Date.now(),
    name: newCompany.value.name,
    subdomain: newCompany.value.subdomain.includes('.') ? newCompany.value.subdomain : `${newCompany.value.subdomain}.yoursaas.com`,
    adminName: newCompany.value.adminName || 'Admin User',
    adminEmail: newCompany.value.adminEmail || 'admin@company.com',
    adminPhone: newCompany.value.adminPhone || '+1 (555) 000-0000',
    planTier: newCompany.value.planTier,
    startDate: new Date().toISOString().split('T')[0],
    paymentStatus: newCompany.value.paymentStatus,
    accountStatus: 'Active'
  })

  showAddModal.value = false
}

const confirmRestrictToggle = (company) => {
  targetCompanyForRestrict.value = company
  showRestrictModal.value = true
}

const toggleRestrictStatus = () => {
  if (!targetCompanyForRestrict.value) return
  const company = companies.value.find(c => c.id === targetCompanyForRestrict.value.id)
  if (company) {
    company.accountStatus = company.accountStatus === 'Active' ? 'Restricted' : 'Active'
  }
  showRestrictModal.value = false
  targetCompanyForRestrict.value = null
}
</script>

<template>
  <SuperAdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Company & Tenant Directory</h2>
          <p class="text-slate-400 text-xs mt-1">Manage tenant organizations, subdomains, and subscription access status.</p>
        </div>
        <button 
          @click="openAddModal"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus class="w-4 h-4" /> Add Company Tenant
        </button>
      </div>

      <!-- Filters & Search Bar -->
      <div class="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <!-- Search -->
        <div class="relative flex-1 min-w-[240px]">
          <Search class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search by company name, subdomain, or admin..."
            class="bg-slate-900 border border-slate-800 text-white placeholder-slate-500 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 w-full outline-none"
          />
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter class="w-3.5 h-3.5 text-indigo-400" />
            <span>Payment:</span>
            <select 
              v-model="selectedPaymentFilter"
              class="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Trial">Trial</option>
            </select>
          </div>

          <div class="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Account Status:</span>
            <select 
              v-model="selectedAccountFilter"
              class="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Restricted">Restricted</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Companies Data Table -->
      <div class="bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-xs">
            <thead>
              <tr class="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th class="py-3.5 px-4">Company & Subdomain</th>
                <th class="py-3.5 px-4">Primary Admin Details</th>
                <th class="py-3.5 px-4">Subscription Plan</th>
                <th class="py-3.5 px-4">Start Date</th>
                <th class="py-3.5 px-4">Payment Status</th>
                <th class="py-3.5 px-4">Account Status</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800/60">
              <tr v-for="comp in filteredCompanies" :key="comp.id" class="hover:bg-slate-900/50 transition-colors">
                <!-- Company Name & Subdomain -->
                <td class="py-3.5 px-4">
                  <div class="font-bold text-white text-sm flex items-center gap-2">
                    <Building2 class="w-4 h-4 text-indigo-400" />
                    {{ comp.name }}
                  </div>
                  <div class="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                    <Globe class="w-3 h-3 text-slate-500" /> {{ comp.subdomain }}
                  </div>
                </td>

                <!-- Admin Details -->
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-slate-200 flex items-center gap-1.5">
                    <User class="w-3.5 h-3.5 text-slate-400" /> {{ comp.adminName }}
                  </div>
                  <div class="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span class="flex items-center gap-1"><Mail class="w-3 h-3" /> {{ comp.adminEmail }}</span>
                  </div>
                  <div class="text-[10px] text-slate-500 flex items-center gap-1">
                    <Phone class="w-3 h-3" /> {{ comp.adminPhone }}
                  </div>
                </td>

                <!-- Plan -->
                <td class="py-3.5 px-4">
                  <span class="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">
                    {{ comp.planTier }}
                  </span>
                </td>

                <!-- Start Date -->
                <td class="py-3.5 px-4 text-slate-400 font-mono">
                  {{ comp.startDate }}
                </td>

                <!-- Payment Status -->
                <td class="py-3.5 px-4">
                  <Badge :variant="comp.paymentStatus" />
                </td>

                <!-- Account Status -->
                <td class="py-3.5 px-4">
                  <Badge :variant="comp.accountStatus" />
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-right">
                  <button 
                    @click="confirmRestrictToggle(comp)"
                    :class="[
                      'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 inline-flex',
                      comp.accountStatus === 'Active'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                    ]"
                  >
                    <Ban v-if="comp.accountStatus === 'Active'" class="w-3.5 h-3.5" />
                    <CheckCircle v-else class="w-3.5 h-3.5" />
                    <span>{{ comp.accountStatus === 'Active' ? 'Restrict' : 'Activate' }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal: Add Company -->
    <Modal :show="showAddModal" title="Onboard New Company Tenant" maxWidth="max-w-lg" @close="showAddModal = false">
      <form @submit.prevent="saveCompany" class="space-y-4 text-slate-900">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company Name</label>
          <input v-model="newCompany.name" type="text" required placeholder="e.g. Apex Hypermarket LLC" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subdomain Name</label>
          <div class="flex items-center">
            <input v-model="newCompany.subdomain" type="text" required placeholder="apex-mart" class="w-full border border-slate-300 rounded-l-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
            <span class="bg-slate-100 border border-l-0 border-slate-300 text-slate-600 px-3 py-2 text-xs rounded-r-xl font-mono">.yoursaas.com</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Primary Admin Name</label>
            <input v-model="newCompany.adminName" type="text" required placeholder="Sarah Jenkins" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
            <input v-model="newCompany.adminPhone" type="text" required placeholder="+1 (555) 000-0000" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Primary Admin Email</label>
          <input v-model="newCompany.adminEmail" type="email" required placeholder="admin@apexmart.com" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Subscription Tier</label>
            <select v-model="newCompany.planTier" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Starter Tier">Starter Tier</option>
              <option value="Multi-Branch Pro">Multi-Branch Pro</option>
              <option value="Enterprise Pro">Enterprise Pro</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Initial Payment Status</label>
            <select v-model="newCompany.paymentStatus" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Trial">Trial</option>
            </select>
          </div>
        </div>
      </form>

      <template #footer>
        <button @click="showAddModal = false" class="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Cancel</button>
        <button @click="saveCompany" class="px-4 py-2 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold shadow-md">Add Tenant Company</button>
      </template>
    </Modal>

    <!-- Modal: Confirm Restrict / Suspend -->
    <Modal :show="showRestrictModal" title="Update Company Account Access Status" maxWidth="max-w-md" @close="showRestrictModal = false">
      <div v-if="targetCompanyForRestrict" class="space-y-3 text-slate-800">
        <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs">
          <ShieldAlert class="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span class="font-bold">Warning:</span> Restricting <strong>{{ targetCompanyForRestrict.name }}</strong> will immediately block all branch cashiers and store managers from logging into POS terminals or admin dashboards!
          </div>
        </div>

        <p class="text-xs text-slate-600">
          Current Status: <Badge :variant="targetCompanyForRestrict.accountStatus" />
        </p>
      </div>

      <template #footer>
        <button @click="showRestrictModal = false" class="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Cancel</button>
        <button 
          @click="toggleRestrictStatus" 
          :class="[
            'px-4 py-2 rounded-xl text-white text-xs font-semibold shadow-md',
            targetCompanyForRestrict?.accountStatus === 'Active' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
          ]"
        >
          Confirm {{ targetCompanyForRestrict?.accountStatus === 'Active' ? 'Restrict' : 'Activate' }}
        </button>
      </template>
    </Modal>
  </SuperAdminLayout>
</template>
