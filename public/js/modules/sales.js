// js/modules/sales.js
import { state, resetCart } from './state.js';
import { SalesAPI } from '../api/sales.js';
import { CartModule } from './cart.js';
import { showNotification } from './ui/notifications.js';
import { showReceipt } from './ui/receipt.js';

export const SalesModule = {
  init() {},

  async finalizeSale({ paymentMethod, cashReceived, deliveryInfo }) {
    if (state.cart.length === 0) return showNotification('Carrinho vazio.', 'error');
    if (!paymentMethod) return showNotification('Selecione uma forma de pagamento.', 'error');

    const subtotal = CartModule.getSubtotal();
    const fee = deliveryInfo?.mode === 'entrega' ? (deliveryInfo.fee || 0) : 0;
    const total = subtotal + fee;

    if (paymentMethod === 'cash' && (cashReceived || 0) < total) {
      return showNotification('Valor insuficiente.', 'error');
    }

    const sale = {
      user_id: state.currentUser.id,
      items: state.cart,
      subtotal,
      delivery_fee: fee,
      total,
      payment_method: paymentMethod,
      cash_received: paymentMethod === 'cash' ? cashReceived : null,
      change_amount: paymentMethod === 'cash' ? cashReceived - total : null,
      delivery_mode: deliveryInfo?.mode || 'balcao',
      delivery_info: deliveryInfo || null,
      sale_date: state.ui.today,
    };

    try {
      const saved = await SalesAPI.create(state.estabelecimento.id, sale);
      showNotification('Venda finalizada!', 'success');
      showReceipt(saved);
      resetCart();
      return saved;
    } catch (err) {
      showNotification('Erro ao salvar venda: ' + err.message, 'error');
    }
  },
};
