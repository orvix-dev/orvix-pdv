// js/api/openOrders.js
import { supabase } from './supabaseClient.js';

export const OpenOrdersAPI = {
  async list(estabelecimentoId) {
    const { data, error } = await supabase
      .from('open_orders')
      .select('*')
      .eq('estabelecimento_id', estabelecimentoId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },
  async create(estabelecimentoId, order) {
    const { data, error } = await supabase
      .from('open_orders')
      .insert({ ...order, estabelecimento_id: estabelecimentoId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async update(orderId, fields) {
    const { data, error } = await supabase
      .from('open_orders')
      .update(fields)
      .eq('id', orderId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async remove(orderId) {
    const { error } = await supabase.from('open_orders').delete().eq('id', orderId);
    if (error) throw error;
  },
};
