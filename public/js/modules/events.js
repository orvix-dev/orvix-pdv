// js/modules/events.js
import { state } from './state.js';
import { CartModule } from './cart.js';
import { SalesModule } from './sales.js';
import { renderCart, renderProducts } from './ui/render.js';
import { trocarEstabelecimento } from './authFlow.js';
import { AuthAPI } from '../api/auth.js';

export function bindEvents() {
  // Logout principal (sidebar)
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await AuthAPI.signOut();
    localStorage.removeItem('ultimoEstabelecimentoId');
    window.location.reload();
  });

  // Logout da tela de onboarding (quando não tem estabelecimento ainda)
  document.getElementById('onboarding-logout-link')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await AuthAPI.signOut();
    localStorage.removeItem('ultimoEstabelecimentoId');
    window.location.reload();
  });
  document.getElementById('trocar-estabelecimento-btn')?.addEventListener('click', trocarEstabelecimento);

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  document.getElementById('products-grid')?.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    const product = state.products.find(p => p.id === card.dataset.id);
    if (product) {
      CartModule.addProduct(product);
      renderCart();
    }
  });

  document.getElementById('cart-items')?.addEventListener('click', (e) => {
    if (e.target.matches('.btn-remove')) {
      CartModule.removeItem(e.target.dataset.id);
      renderCart();
    }
  });

  document.getElementById('confirm-payment')?.addEventListener('click', async () => {
    const paymentMethod = state.ui.currentPaymentMethod;
    const cashReceived = parseFloat(document.getElementById('cash-received')?.value) || 0;
    await SalesModule.finalizeSale({ paymentMethod, cashReceived, deliveryInfo: { mode: state.ui.deliveryMode } });
    renderCart();
  });

  document.querySelectorAll('.payment-option').forEach(el => {
    el.addEventListener('click', () => {
      state.ui.currentPaymentMethod = el.dataset.method;
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
    });
  });

  document.getElementById('product-search')?.addEventListener('input', debounce((e) => {
    filterProducts(e.target.value);
  }, 300));
}

function switchTab(tabName) {
  document.querySelector('.tab.active')?.classList.remove('active');
  document.querySelector(`.tab[data-tab="${tabName}"]`)?.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`${tabName}-tab`)?.classList.add('active');
}

function filterProducts(query) {
  const q = query.trim().toLowerCase();
  const filtered = q ? state.products.filter(p => p.name.toLowerCase().includes(q)) : state.products;
  renderProducts(filtered);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
