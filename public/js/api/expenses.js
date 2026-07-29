// js/api/expenses.js
import { supabase } from './supabaseClient.js';

export const ExpensesAPI = {
  async listByDate(estabelecimentoId, dateKey) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('expense_date', dateKey)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async create(estabelecimentoId, expense) {
    const { data, error } = await supabase
      .from('expenses')
      .insert({ ...expense, estabelecimento_id: estabelecimentoId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async remove(expenseId) {
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
    if (error) throw error;
  },
};
