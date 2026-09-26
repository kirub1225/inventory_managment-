<script setup>
import { Printer, CheckCircle2, Download, X } from 'lucide-vue-next'
import Modal from './Modal.vue'

const props = defineProps({
  show: Boolean,
  receipt: Object
})

const emit = defineEmits(['close'])

const printReceipt = () => {
  window.print()
}
</script>

<template>
  <Modal :show="show" title="Sales Receipt / Order Completed" maxWidth="max-w-md" @close="emit('close')">
    <div v-if="receipt" id="printable-receipt" class="bg-white text-slate-900 p-2 font-mono text-xs">
      <!-- Receipt Header -->
      <div class="text-center pb-4 mb-4 border-b border-dashed border-slate-300">
        <div class="flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-sm mb-1">
          <CheckCircle2 class="w-5 h-5 inline" /> SALE SUCCESSFUL
        </div>
        <h2 class="text-base font-bold uppercase tracking-wider text-slate-900">NEXUS RETAIL SaaS</h2>
        <p class="text-slate-500 text-[11px]">{{ receipt.branch || 'Downtown Branch' }}</p>
        <p class="text-slate-500 text-[11px]">Tel: +1 (800) 555-0199</p>
      </div>

      <!-- Receipt Meta -->
      <div class="space-y-1 mb-4 text-[11px] border-b border-dashed border-slate-300 pb-3">
        <div class="flex justify-between">
          <span class="text-slate-500">Receipt #:</span>
          <span class="font-bold text-slate-800">{{ receipt.id }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Date/Time:</span>
          <span>{{ receipt.time || 'Today' }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Cashier:</span>
          <span>Sarah Jenkins</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-500">Payment Method:</span>
          <span class="font-bold">{{ receipt.paymentMethod }}</span>
        </div>
      </div>

      <!-- Itemized Table -->
      <div class="mb-4">
        <div class="flex justify-between font-bold border-b border-slate-200 pb-1 mb-2 text-slate-700">
          <span>ITEM</span>
          <span class="text-right">QTY x PRICE = TOTAL</span>
        </div>

        <div v-for="(item, idx) in receipt.lineItems" :key="idx" class="flex justify-between py-1 border-b border-slate-100 text-[11px]">
          <div>
            <div class="font-semibold text-slate-900">{{ item.name }}</div>
            <div class="text-[10px] text-slate-400">{{ item.qty }} pcs @ ${{ Number(item.price).toFixed(2) }}</div>
          </div>
          <div class="font-bold text-slate-900 self-end">
            ${{ (item.qty * item.price).toFixed(2) }}
          </div>
        </div>
      </div>

      <!-- Totals -->
      <div class="space-y-1.5 pt-2 border-t border-dashed border-slate-300 text-xs">
        <div class="flex justify-between text-slate-600">
          <span>Subtotal:</span>
          <span>${{ (receipt.total * 0.92).toFixed(2) }}</span>
        </div>
        <div class="flex justify-between text-slate-600">
          <span>Tax (8%):</span>
          <span>${{ (receipt.total * 0.08).toFixed(2) }}</span>
        </div>
        <div class="flex justify-between font-bold text-sm text-slate-900 pt-1 border-t border-slate-200">
          <span>TOTAL DUE:</span>
          <span class="text-emerald-600">${{ Number(receipt.total).toFixed(2) }}</span>
        </div>

        <div v-if="receipt.paymentMethod === 'Cash'" class="pt-2 text-[11px] space-y-1">
          <div class="flex justify-between text-slate-600">
            <span>Tendered Cash:</span>
            <span>${{ Number(receipt.tendered || receipt.total).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-bold text-slate-800">
            <span>Change Due:</span>
            <span class="text-blue-600">${{ Number(receipt.changeDue || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Footer Barcode -->
      <div class="text-center mt-6 pt-4 border-t border-slate-200">
        <div class="inline-block px-4 py-1 bg-slate-100 rounded tracking-widest font-mono text-sm font-bold text-slate-700 mb-1">
          *{{ receipt.id }}*
        </div>
        <p class="text-[10px] text-slate-400">Thank you for shopping with us!</p>
      </div>
    </div>

    <template #footer>
      <button 
        @click="emit('close')"
        class="px-4 py-2 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-semibold transition-colors"
      >
        Close Window
      </button>
      <button 
        @click="printReceipt"
        class="px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
      >
        <Printer class="w-4 h-4" /> Print Thermal Receipt
      </button>
    </template>
  </Modal>
</template>
