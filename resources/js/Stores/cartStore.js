import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [],
    selectedBranchId: 1,
    allowPriceOverride: true,
    sellerMoneyOnHand: 480.00,
    sellerTodayOrdersCount: 14,
    sellerTodayUnitsSold: 38,
    sellerTodayRevenue: 1240.50,
    personalSales: [
      {
        id: 'REC-9082',
        time: '14:32 Today',
        branch: 'Downtown Store',
        itemsCount: 3,
        total: 145.00,
        paymentMethod: 'Cash',
        status: 'Completed',
        lineItems: [
          { name: 'Wireless Ergonomic Mouse', qty: 2, price: 45.00 },
          { name: 'Mechanical Keyboard RGB', qty: 1, price: 55.00 }
        ]
      },
      {
        id: 'REC-9079',
        time: '12:15 Today',
        branch: 'Downtown Store',
        itemsCount: 1,
        total: 899.00,
        paymentMethod: 'Card',
        status: 'Completed',
        lineItems: [
          { name: 'UltraHD Monitor 27"', qty: 1, price: 899.00 }
        ]
      },
      {
        id: 'REC-9065',
        time: '10:45 Today',
        branch: 'Downtown Store',
        itemsCount: 4,
        total: 196.50,
        paymentMethod: 'Cash',
        status: 'Completed',
        lineItems: [
          { name: 'USB-C Fast Charger 65W', qty: 2, price: 35.00 },
          { name: 'HDMI 2.1 Cable 3m', qty: 2, price: 63.25 }
        ]
      }
    ]
  }),

  getters: {
    totalItemsCount: (state) => state.cartItems.reduce((acc, item) => acc + item.qty, 0),
    subtotal: (state) => state.cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0),
    taxAmount: (state) => state.cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0) * 0.08,
    totalAmount() {
      return this.subtotal + this.taxAmount
    }
  },

  actions: {
    addToCart(product, customQty = 1, customPrice = null) {
      const existing = this.cartItems.find(item => item.id === product.id)
      const targetPrice = (customPrice !== null && this.allowPriceOverride) ? Number(customPrice) : product.price
      
      if (existing) {
        existing.qty += customQty
        if (customPrice !== null && this.allowPriceOverride) {
          existing.price = targetPrice
        }
      } else {
        this.cartItems.push({
          id: product.id,
          name: product.name,
          sku: product.sku,
          image: product.image,
          price: targetPrice,
          originalPrice: product.price,
          unit: product.unit || 'pcs',
          qty: customQty,
          maxStock: product.branchStock?.[this.selectedBranchId] ?? product.stock ?? 99
        })
      }
    },

    updateQty(productId, delta) {
      const item = this.cartItems.find(i => i.id === productId)
      if (!item) return
      item.qty += delta
      if (item.qty <= 0) {
        this.removeFromCart(productId)
      }
    },

    setQty(productId, qty) {
      const item = this.cartItems.find(i => i.id === productId)
      if (!item) return
      if (qty <= 0) {
        this.removeFromCart(productId)
      } else {
        item.qty = Number(qty)
      }
    },

    updatePrice(productId, newPrice) {
      if (!this.allowPriceOverride) return
      const item = this.cartItems.find(i => i.id === productId)
      if (item && newPrice >= 0) {
        item.price = Number(newPrice)
      }
    },

    removeFromCart(productId) {
      this.cartItems = this.cartItems.filter(i => i.id !== productId)
    },

    clearCart() {
      this.cartItems = []
    },

    completeCheckout(paymentMethod = 'Cash', tenderedAmount = 0) {
      const saleTotal = this.totalAmount
      const orderId = 'REC-' + Math.floor(1000 + Math.random() * 9000)
      const lineItems = this.cartItems.map(i => ({ name: i.name, qty: i.qty, price: i.price }))

      // If payment is Cash, increment cashier Money on Hand
      if (paymentMethod === 'Cash') {
        this.sellerMoneyOnHand += saleTotal
      }

      this.sellerTodayOrdersCount += 1
      this.sellerTodayUnitsSold += this.totalItemsCount
      this.sellerTodayRevenue += saleTotal

      const newReceipt = {
        id: orderId,
        time: 'Just Now',
        branch: 'Downtown Store',
        itemsCount: this.totalItemsCount,
        total: saleTotal,
        paymentMethod: paymentMethod,
        status: 'Completed',
        lineItems: lineItems,
        tendered: paymentMethod === 'Cash' ? Number(tenderedAmount) : saleTotal,
        changeDue: paymentMethod === 'Cash' ? Math.max(0, Number(tenderedAmount) - saleTotal) : 0
      }

      this.personalSales.unshift(newReceipt)
      this.clearCart()
      return newReceipt
    },

    settleCash() {
      this.sellerMoneyOnHand = 0.00
    }
  }
})
