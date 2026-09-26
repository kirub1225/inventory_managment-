<script setup>
import { ref } from 'vue'
import AppLayout from '../../Layouts/AppLayout.vue'
import Modal from '../../Components/Modal.vue'
import { 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  Users, 
  Plus, 
  Search, 
  Store, 
  Edit, 
  Trash2,
  CheckCircle2
} from 'lucide-vue-next'

const branches = ref([
  {
    id: 1,
    name: 'Downtown Store',
    address: '742 Evergreen Terrace, Suite 100, Sector 4',
    phone: '+1 (555) 123-4567',
    manager: 'Sarah Jenkins',
    staffCount: 12,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Northside Hub',
    address: '1200 Industrial Parkway, Building B',
    phone: '+1 (555) 234-5678',
    manager: 'David Ross',
    staffCount: 8,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Airport Kiosk',
    address: 'Terminal 2 Concourse B, Gate 14',
    phone: '+1 (555) 345-6789',
    manager: 'Elena Gomez',
    staffCount: 5,
    status: 'Active'
  },
  {
    id: 4,
    name: 'Westside Logistics Warehouse',
    address: '450 Cargo Port Boulevard',
    phone: '+1 (555) 456-7890',
    manager: 'Marcus Vance',
    staffCount: 15,
    status: 'Active'
  }
])

const showAddModal = ref(false)
const newBranch = ref({
  name: '',
  address: '',
  phone: '',
  manager: ''
})

const saveBranch = () => {
  if (!newBranch.value.name) return

  branches.value.push({
    id: Date.now(),
    name: newBranch.value.name,
    address: newBranch.value.address || 'Standard Location Address',
    phone: newBranch.value.phone || '+1 (555) 000-0000',
    manager: newBranch.value.manager || 'Unassigned',
    staffCount: 1,
    status: 'Active'
  })

  showAddModal.value = false
  newBranch.value = { name: '', address: '', phone: '', manager: '' }
}
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Title Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 subtle-shadow">
        <div>
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Branch Store Locations</h2>
          <p class="text-xs text-slate-500 mt-0.5">Manage physical retail stores, fulfillment hubs, and assigned store managers.</p>
        </div>

        <button 
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all"
        >
          <Plus class="w-4 h-4" /> Add New Branch
        </button>
      </div>

      <!-- Branch Table -->
      <div class="bg-white rounded-2xl border border-slate-200/80 overflow-hidden subtle-shadow">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th class="py-3.5 px-4">Branch Name</th>
                <th class="py-3.5 px-4">Address / Location</th>
                <th class="py-3.5 px-4">Phone Number</th>
                <th class="py-3.5 px-4">Assigned Manager</th>
                <th class="py-3.5 px-4 text-center">Active Staff Count</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="branch in branches" :key="branch.id" class="hover:bg-slate-50/80 transition-colors">
                <td class="py-3.5 px-4">
                  <div class="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    <Store class="w-4 h-4 text-blue-600" />
                    {{ branch.name }}
                  </div>
                  <span class="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 class="w-3 h-3" /> Operational
                  </span>
                </td>

                <td class="py-3.5 px-4">
                  <div class="text-slate-700 font-medium flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" /> {{ branch.address }}
                  </div>
                </td>

                <td class="py-3.5 px-4 text-slate-600 font-mono">
                  <div class="flex items-center gap-1.5">
                    <Phone class="w-3.5 h-3.5 text-slate-400" /> {{ branch.phone }}
                  </div>
                </td>

                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-800 flex items-center gap-1.5">
                    <User class="w-3.5 h-3.5 text-blue-500" /> {{ branch.manager }}
                  </div>
                </td>

                <td class="py-3.5 px-4 text-center">
                  <span class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    <Users class="w-3 h-3 inline mr-1" /> {{ branch.staffCount }} Cashiers
                  </span>
                </td>

                <td class="py-3.5 px-4 text-right">
                  <button class="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors">
                    <Edit class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal: Add Branch -->
    <Modal :show="showAddModal" title="Add New Retail Branch Store" maxWidth="max-w-md" @close="showAddModal = false">
      <form @submit.prevent="saveBranch" class="space-y-4 text-slate-900">
        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Branch Store Name</label>
          <input v-model="newBranch.name" type="text" required placeholder="e.g. Eastside Mall Kiosk" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Location Address</label>
          <input v-model="newBranch.address" type="text" required placeholder="e.g. 500 Grand Avenue, Unit 4" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number</label>
          <input v-model="newBranch.phone" type="text" required placeholder="+1 (555) 000-0000" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Assigned Branch Manager</label>
          <input v-model="newBranch.manager" type="text" placeholder="e.g. Robert Drake" class="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </form>

      <template #footer>
        <button @click="showAddModal = false" class="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold">Cancel</button>
        <button @click="saveBranch" class="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 text-xs font-semibold shadow-md">Create Branch Store</button>
      </template>
    </Modal>
  </AppLayout>
</template>
