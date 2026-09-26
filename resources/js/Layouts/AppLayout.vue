<script setup>
import { ref, provide } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import PortalSwitcher from '../Components/PortalSwitcher.vue'
import { 
  Building2, 
  Store, 
  LayoutDashboard, 
  Package, 
  Users, 
  Receipt, 
  ShoppingCart, 
  Bell, 
  Search, 
  ChevronDown, 
  Calendar,
  Layers,
  Sparkles,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-vue-next'

const selectedBranch = ref('All Branches')
const selectedTimeFilter = ref('This Month')

// Provide reactive state to child components so metrics update dynamically!
provide('selectedBranch', selectedBranch)
provide('selectedTimeFilter', selectedTimeFilter)

const branches = [
  'All Branches',
  'Downtown Store',
  'Northside Hub',
  'Airport Kiosk'
]

const timeFilters = [
  'Today',
  'This Week',
  'This Month',
  'This Year',
  'Custom'
]

const showBranchDropdown = ref(false)

const setTimeFilter = (filter) => {
  selectedTimeFilter.value = filter
}

const isRoute = (path) => {
  return window.location.pathname.startsWith(path) || (path === '/company/home' && window.location.pathname === '/admin/home')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
    <!-- Top Global SaaS Navigation Switcher -->
    <PortalSwitcher />

    <div class="flex-1 flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 z-20">
        <div class="space-y-6">
          <!-- Tenant Logo & Subdomain -->
          <div class="flex items-center gap-3 px-2">
            <div class="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <Store class="w-6 h-6" />
            </div>
            <div>
              <h1 class="font-extrabold text-base tracking-tight text-slate-900">Nexus Retail</h1>
              <span class="text-[11px] text-blue-600 font-semibold">company.yoursaas.com</span>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="space-y-1">
            <Link 
              href="/company/home"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isRoute('/company/home') || isRoute('/admin/home')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <LayoutDashboard class="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </Link>

            <Link 
              href="/company/branches"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isRoute('/company/branches') || isRoute('/admin/branches')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <Building2 class="w-4.5 h-4.5" />
              <span>Branches</span>
            </Link>

            <Link 
              href="/company/products"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isRoute('/company/products') || isRoute('/admin/products')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <Package class="w-4.5 h-4.5" />
              <span>Products & Matrix</span>
            </Link>

            <Link 
              href="/company/sellers"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isRoute('/company/sellers') || isRoute('/admin/sellers')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <Users class="w-4.5 h-4.5" />
              <span>Sellers & Cashiers</span>
            </Link>

            <Link 
              href="/company/sales"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all',
                isRoute('/company/sales') || isRoute('/admin/sales')
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              ]"
            >
              <Receipt class="w-4.5 h-4.5" />
              <span>Sales Audit</span>
            </Link>

            <!-- Quick Jump to POS Terminal -->
            <div class="pt-4 mt-4 border-t border-slate-100">
              <Link 
                href="/pos"
                class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all group"
              >
                <div class="flex items-center gap-2">
                  <ShoppingCart class="w-4 h-4" />
                  <span>Launch POS Terminal</span>
                </div>
                <ChevronRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </nav>
        </div>

        <!-- Tenant Account Footer -->
        <div class="pt-4 border-t border-slate-100">
          <div class="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200/60">
            <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              CA
            </div>
            <div class="overflow-hidden">
              <div class="text-xs font-bold text-slate-900 truncate">Alex Sterling</div>
              <div class="text-[10px] text-slate-500 truncate">Company Admin</div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Section -->
      <main class="flex-1 bg-slate-50 flex flex-col overflow-x-hidden">
        <!-- Header Top Bar -->
        <header class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <!-- Left: Branch Selector Dropdown -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <button 
                @click="showBranchDropdown = !showBranchDropdown"
                class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-xs font-bold text-slate-800 transition-all"
              >
                <Store class="w-4 h-4 text-blue-600" />
                <span>{{ selectedBranch }}</span>
                <ChevronDown class="w-3.5 h-3.5 text-slate-500" />
              </button>

              <div 
                v-if="showBranchDropdown" 
                class="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in zoom-in-95"
              >
                <div class="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Select Store Location</div>
                <button 
                  v-for="branch in branches" 
                  :key="branch"
                  @click="selectedBranch = branch; showBranchDropdown = false"
                  :class="[
                    'w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-blue-50 hover:text-blue-700 transition-colors',
                    selectedBranch === branch ? 'text-blue-600 bg-blue-50/50 font-bold' : 'text-slate-700'
                  ]"
                >
                  <span>{{ branch }}</span>
                  <span v-if="selectedBranch === branch" class="w-2 h-2 rounded-full bg-blue-600"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Global Search & Notifications & User -->
          <div class="flex items-center gap-4">
            <div class="relative hidden sm:block">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Global product / receipt search..."
                class="bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              />
            </div>

            <button class="relative p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-xl border border-slate-200 transition-colors">
              <Bell class="w-4.5 h-4.5" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <!-- Global Time Filter Bar -->
        <div class="bg-white/80 border-b border-slate-200 px-6 py-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Calendar class="w-4 h-4 text-blue-600" />
            <span>Time Period:</span>
          </div>

          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
            <button 
              v-for="tf in timeFilters" 
              :key="tf"
              @click="setTimeFilter(tf)"
              :class="[
                'px-3 py-1 rounded-lg text-xs font-bold transition-all',
                selectedTimeFilter === tf 
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              ]"
            >
              [ {{ tf }} ]
            </button>
          </div>
        </div>

        <!-- Page Content -->
        <div class="p-6 flex-1">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
