// js/modules/cart.js
import { state } from './state.js';

export const CartModule = {
  init() { state.cart = []; },

  addProduct(product) {
    state.cart.push({ id: crypto.randomUUID(), name: product.name, totalPrice: product.price, type: 'product' });
  },

  addWeightedItem({ type, weightGrams, pricePerKg }) {
    const name = type === 'acai' ? 'Açaí por KG' : 'Sorvete por KG';
    const totalPrice = (weightGrams / 1000) * pricePerKg;
    state.cart.push({ id: crypto.randomUUID(), name, weightGrams, totalPrice, type: 'weight' });
    return totalPrice;
  },

  removeItem(itemId) {
    state.cart = state.cart.filter(item => item.id !== itemId);
  },

  getSubtotal() {
    return state.cart.reduce((sum, item) => sum + item.totalPrice, 0);
  },

  getTotal() {
    const subtotal = this.getSubtotal();
    const fee = state.ui.deliveryMode === 'entrega' ? (state.ui.deliveryFee || 0) : 0;
    return subtotal + fee;
  },

  clear() {
    state.cart = [];
    state.ui.currentPaymentMethod = null;
  },
};
