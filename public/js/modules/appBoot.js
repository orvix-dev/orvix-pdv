// js/modules/appBoot.js
import { state } from './state.js';
import { ProductsAPI } from '../api/products.js';
import { OpenOrdersAPI } from '../api/openOrders.js';
import { CartModule } from './cart.js';
import { SalesModule } from './sales.js';
import { RealtimeModule } from './realtime.js';
import { renderApp } from './ui/render.js';
import { bindEvents } from './events.js';

export async function bootApp() {
  applyBranding();
  applyRoleVisibility();

  try {
    state.products = await ProductsAPI.list(state.estabelecimento.id);
    state.openOrders = await OpenOrdersAPI.list(state.estabelecimento.id);
  } catch (err) {
    console.error('Erro ao carregar dados iniciais:', err);
  }

  CartModule.init();
  SalesModule.init();
  RealtimeModule.init();

  bindEvents();
  renderApp();
}

function applyBranding() {
  const { nome, logo_url } = state.estabelecimento;
  document.title = `${nome} · PDV`;

  const logoImg = document.getElementById('sidebar-logo-img');
  if (logoImg) logoImg.src = logo_url || './image/default-logo.png';

  const nameLabel = document.getElementById('estabelecimento-nome-label');
  if (nameLabel) nameLabel.textContent = nome;
}

function applyRoleVisibility() {
  const isAdminOrDono = ['admin', 'dono'].includes(state.currentRole);
  document.querySelectorAll('[data-requires-admin]').forEach(el => {
    el.style.display = isAdminOrDono ? '' : 'none';
  });

  const switchBtn = document.getElementById('trocar-estabelecimento-btn');
  if (switchBtn) switchBtn.style.display = state.vinculos.length > 1 ? '' : 'none';
}
