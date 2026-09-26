<script setup>
import { ref } from 'vue'
import { router, Link, usePage } from '@inertiajs/vue3'
import PortalSwitcher from '../Components/PortalSwitcher.vue'
import { 
  ShieldCheck, 
  Building2, 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-vue-next'

const page = usePage()

const isRoute = (path) => {
  return window.location.pathname.startsWith(path)
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
    <!-- Top Global SaaS Navigation Switcher -->
    <PortalSwitcher />

    <!-- Main Admin Shell -->
    <div class="flex-1 flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4">
        <div class="space-y-6">
          <!-- Platform Logo -->
          <div class="flex items-center gap-3 px-2">
            <div class="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <div>
              <h1 class="font-extrabold text-base tracking-tight text-white">SaaS HQ Admin</h1>
              <span class="text-[11px] text-indigo-400 font-medium">admin.yoursaas.com</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="space-y-1">
            <Link 
              href="/admin/dashboard"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isRoute('/admin/dashboard') 
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              ]"
            >
              <LayoutDashboard class="w-4 h-4" />
              <span>Global Analytics</span>
            </Link>

            <Link 
              href="/admin/companies"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isRoute('/admin/companies') 
                  ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              ]"
            >
              <Building2 class="w-4 h-4" />
              <span>Company Directory</span>
            </Link>
          </nav>
        </div>

        <!-- System Health Widget -->
        <div class="pt-4 border-t border-slate-800 space-y-3">
          <div class="bg-slate-900/80 rounded-xl p-3 border border-slate-800/80">
            <div class="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Multi-Tenant Cluster</span>
              <span class="text-emerald-400 font-semibold flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Healthy
              </span>
            </div>
            <div class="text-[11px] text-slate-500">PostgreSQL Tenants: 142 Active</div>
          </div>

          <div class="flex items-center justify-between px-2 pt-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                SA
              </div>
              <div class="text-left">
                <div class="text-xs font-semibold text-slate-200">Super Admin</div>
                <div class="text-[10px] text-slate-500">root@yoursaas.com</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 bg-slate-900 flex flex-col overflow-x-hidden">
        <!-- Top Header Bar -->
        <header class="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-bold text-white tracking-tight">Super Admin Operations Center</h2>
          </div>

          <div class="flex items-center gap-4">
            <div class="relative hidden sm:block">
              <Search class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search companies, subdomains, MRR..."
                class="bg-slate-800/90 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
              />
            </div>

            <button class="relative p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg border border-slate-700/60 transition-colors">
              <Bell class="w-4 h-4" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <!-- Page View Container -->
        <div class="p-6 flex-1">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
