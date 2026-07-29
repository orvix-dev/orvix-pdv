// js/api/sales.js
import { supabase } from './supabaseClient.js';

export const SalesAPI = {
  async listByDate(estabelecimentoId, dateKey) {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('sale_date', dateKey)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(estabelecimentoId, sale) {
    const { data, error } = await supabase
      .from('sales')
      .insert({ ...sale, estabelecimento_id: estabelecimentoId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async remove(saleId) {
    const { error } = await supabase.from('sales').delete().eq('id', saleId);
    if (error) throw error;
  },
  subscribe(estabelecimentoId, onInsert) {
    return supabase
      .channel(`sales-${estabelecimentoId}`)
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sales', filter: `estabelecimento_id=eq.${estabelecimentoId}` },
        (payload) => onInsert(payload.new)
      )
      .subscribe();
  },
};
