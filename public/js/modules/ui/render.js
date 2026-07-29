// js/modules/ui/render.js
import { state } from '../state.js';
import { CartModule } from '../cart.js';

export function renderApp() {
  renderProducts();
  renderCart();
  renderOpenOrdersCount();
}

export function renderProducts(list) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const items = list || state.products;

  grid.innerHTML = items.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image">${p.image ? `<img src="${p.image}" alt="${p.name}">` : '🍧'}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price-card">R$ ${Number(p.price).toFixed(2)}</div>
    </div>
  `).join('');
}

export function renderCart() {
  const container = document.getElementById('cart-items');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');
  if (!container) return;

  container.innerHTML = state.cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="item-info">
        <span class="item-name">${item.name}</span>
        ${item.weightGrams ? `<span class="item-weight">${item.weightGrams}g</span>` : ''}
      </div>
      <span class="item-price">R$ ${item.totalPrice.toFixed(2)}</span>
      <button class="btn-remove" data-id="${item.id}">✕</button>
    </div>
  `).join('');

  if (subtotalEl) subtotalEl.textContent = `R$ ${CartModule.getSubtotal().toFixed(2)}`;
  if (totalEl) totalEl.textContent = `R$ ${CartModule.getTotal().toFixed(2)}`;
}

export function renderOpenOrdersCount() {
  const badge = document.getElementById('open-orders-count');
  if (badge) badge.textContent = state.openOrders.length;
}

export function refreshDashboardMetrics(novaVenda) {
  const totalHojeEl = document.getElementById('dashboard-total-hoje');
  if (!totalHojeEl) return;
  const atual = parseFloat(totalHojeEl.dataset.valor || '0');
  const novoTotal = atual + Number(novaVenda.total);
  totalHojeEl.dataset.valor = novoTotal;
  totalHojeEl.textContent = `R$ ${novoTotal.toFixed(2)}`;
}

export function refreshHistoryIfVisible() {
  const historyTab = document.getElementById('historico-tab');
  if (historyTab && historyTab.classList.contains('active')) {
    document.dispatchEvent(new CustomEvent('history:refresh'));
  }
}
