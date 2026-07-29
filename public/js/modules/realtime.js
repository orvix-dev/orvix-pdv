// js/modules/realtime.js
import { state } from './state.js';
import { SalesAPI } from '../api/sales.js';
import { showNotification } from './ui/notifications.js';
import { refreshHistoryIfVisible, refreshDashboardMetrics } from './ui/render.js';

export const RealtimeModule = {
  channel: null,
  init() {
    if (!state.estabelecimento) return;
    this.channel = SalesAPI.subscribe(state.estabelecimento.id, (novaVenda) => {
      showNotification(`Nova venda: R$ ${Number(novaVenda.total).toFixed(2)}`, 'success');
      refreshDashboardMetrics(novaVenda);
      refreshHistoryIfVisible(novaVenda);
    });
  },
  teardown() {
    if (this.channel) this.channel.unsubscribe();
  },
};
