<script setup>
import { Link, usePage } from '@inertiajs/vue3'
import PortalSwitcher from '../Components/PortalSwitcher.vue'
import { useCartStore } from '../Stores/cartStore'
import { 
  ShoppingCart, 
  Receipt, 
  Store, 
  User, 
  DollarSign, 
  Sliders, 
  Building2, 
  ArrowLeft,
  CheckCircle,
  ShieldAlert
} from 'lucide-vue-next'

const cartStore = useCartStore()

const currentPath = () => window.location.pathname
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans select-none overflow-x-hidden">
    <!-- Top Global SaaS Navigation Switcher -->
    <PortalSwitcher />

    <!-- POS Top Header Bar -->
    <header class="bg-slate-900 text-white px-5 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-md sticky top-0 z-40">
      <!-- Left: Terminal Branding & Branch -->
      <div class="flex items-center gap-3">
        <div class="p-2 bg-emerald-500 rounded-xl text-slate-950 font-black shadow-lg shadow-emerald-500/20">
          <ShoppingCart class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="font-extrabold text-sm tracking-tight text-white">POS TERMINAL</h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
              <Store class="w-3 h-3 inline mr-1" /> Downtown Store
            </span>
          </div>
          <p class="text-[11px] text-slate-400">company.yoursaas.com/pos</p>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
        <Link 
          href="/pos"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all',
            currentPath() === '/pos' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          ]"
        >
          <ShoppingCart class="w-4 h-4" />
          <span>POS Checkout</span>
        </Link>

        <Link 
          href="/pos/my-sales"
          :class="[
            'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all',
            currentPath() === '/pos/my-sales' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'text-slate-300 hover:text-white hover:bg-slate-700'
          ]"
        >
          <Receipt class="w-4 h-4" />
          <span>My Personal Sales</span>
        </Link>
      </div>

      <!-- Right: Seller Cashier Info & Money on Hand -->
      <div class="flex items-center gap-4">
        <!-- Price Override Setting Badge -->
        <div class="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px]">
          <Sliders class="w-3.5 h-3.5 text-indigo-400" />
          <span class="text-slate-400">Price Override:</span>
          <span :class="cartStore.allowPriceOverride ? 'text-emerald-400 font-bold' : 'text-slate-400 font-medium'">
            {{ cartStore.allowPriceOverride ? 'ENABLED' : 'OFF' }}
          </span>
        </div>

        <!-- Uncollected Money on Hand Badge -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 shadow-inner">
          <DollarSign class="w-4 h-4 text-emerald-400" />
          <div>
            <div class="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Money on Hand</div>
            <div class="text-sm font-extrabold text-emerald-400">${{ cartStore.sellerMoneyOnHand.toFixed(2) }}</div>
          </div>
        </div>

        <!-- Cashier Profile -->
        <div class="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs">
            SJ
          </div>
          <div class="hidden sm:block text-left">
            <div class="text-xs font-bold text-white">Sarah Jenkins</div>
            <div class="text-[10px] text-slate-400">Senior Cashier</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="flex-1 flex flex-col">
      <slot />
    </div>
  </div>
</template>
