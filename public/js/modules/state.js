// js/modules/state.js
export const state = {
  session: null,
  currentUser: null,
  currentRole: null,
  estabelecimento: null,
  vinculos: [],

  cart: [],
  manualSaleCart: [],
  openOrders: [],
  products: [],

  ui: {
    currentWeightedProduct: 'acai',
    currentPaymentMethod: null,
    deliveryMode: 'balcao',
    deliveryFee: 0,
    today: new Date().toISOString().slice(0, 10),
  },
};

export function resetCart() {
  state.cart = [];
  state.ui.currentPaymentMethod = null;
}
