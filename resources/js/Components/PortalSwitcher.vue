<script setup>
import { router, usePage } from '@inertiajs/vue3'
import { ShieldCheck, Building2, ShoppingCart, ExternalLink, Zap } from 'lucide-vue-next'

const page = usePage()

const switchPortal = (path) => {
  router.get(path)
}

const currentPath = () => window.location.pathname
</script>

<template>
  <div class="bg-slate-900 text-slate-100 text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-sm z-50">
    <div class="flex items-center gap-2">
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
        <Zap class="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Multi-Tenant SaaS Demo
      </span>
      <span class="hidden md:inline text-slate-400">Switch role & routing subdomain view:</span>
    </div>

    <div class="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60">
      <button 
        @click="switchPortal('/admin/dashboard')"
        :class="[
          'flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all',
          currentPath().startsWith('/admin/dashboard') || currentPath().startsWith('/admin/companies')
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
        ]"
      >
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>1. Super Admin</span>
        <span class="text-[10px] opacity-75 hidden sm:inline">(admin.yoursaas.com)</span>
      </button>

      <button 
        @click="switchPortal('/company/home')"
        :class="[
          'flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all',
          (currentPath().startsWith('/company') || currentPath().startsWith('/admin/home')) && !currentPath().includes('/pos')
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
        ]"
      >
        <Building2 class="w-3.5 h-3.5" />
        <span>2. Company Admin</span>
        <span class="text-[10px] opacity-75 hidden sm:inline">(company.yoursaas.com)</span>
      </button>

      <button 
        @click="switchPortal('/pos')"
        :class="[
          'flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-all',
          currentPath().includes('/pos')
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
        ]"
      >
        <ShoppingCart class="w-3.5 h-3.5" />
        <span>3. POS Terminal</span>
        <span class="text-[10px] opacity-75 hidden sm:inline">(company.yoursaas.com/pos)</span>
      </button>
    </div>
  </div>
</template>
