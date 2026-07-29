// js/api/products.js
import { supabase } from './supabaseClient.js';

export const ProductsAPI = {
  async list(estabelecimentoId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('estabelecimento_id', estabelecimentoId)
      .eq('active', true)
      .order('category');
    if (error) throw error;
    return data;
  },
  async create(estabelecimentoId, { name, price, category, image }) {
    const { data, error } = await supabase
      .from('products')
      .insert({ estabelecimento_id: estabelecimentoId, name, price, category, image })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async update(productId, fields) {
    const { data, error } = await supabase
      .from('products')
      .update(fields)
      .eq('id', productId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async remove(productId) {
    const { error } = await supabase
      .from('products')
      .update({ active: false })
      .eq('id', productId);
    if (error) throw error;
  },
};
