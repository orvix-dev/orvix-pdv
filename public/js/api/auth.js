// js/api/auth.js
// Toda a lógica de autenticação (Google + Email/Senha) e resolução de tenant.

import { supabase } from './supabaseClient.js';

export const AuthAPI = {
  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  },

  async signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUpWithEmail(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
    return data;
  },

  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((_event, session) => callback(session));
  },

  async getVinculos(userId) {
    const { data, error } = await supabase
      .from('user_estabelecimentos')
      .select('role, estabelecimento_id, estabelecimentos(id, nome, cidade, slug, logo_url, acai_price_per_kg, sorvete_price_per_kg)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async criarEstabelecimento({ nome, cidade, logoFile, userId }) {
    let logoUrl = null;

    // Faz upload do logo se fornecido
    if (logoFile) {
      const path = `${userId}/${Date.now()}-${logoFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(path, logoFile, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(path);
      logoUrl = urlData.publicUrl;
    }

    // Usa RPC SECURITY DEFINER para criar estabelecimento + vinculo atomicamente
    // (contorna limitacao de auth.uid() no RLS com publishable key)
    const { data, error } = await supabase.rpc('criar_meu_estabelecimento', {
      p_nome: nome,
      p_cidade: cidade || null,
      p_logo_url: logoUrl,
    });

    if (error) throw error;
    return data;
  },

  async _gerarSlugUnico(nome, cidade) {
    const base = `${nome}-${cidade || ''}`
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let slug = base;
    let contador = 1;

    while (true) {
      const { data } = await supabase
        .from('estabelecimentos')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!data) return slug;
      slug = `${base}-${contador++}`;
    }
  },
};
