// js/api/supabaseClient.js
// Ponto único de configuração do Supabase.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ⚠️ SUBSTITUA pelos valores reais do seu projeto (Settings > API no Supabase).
const SUPABASE_URL = 'https://kcivghajdcttblombrwc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_giCpPhQu8DTMCg4oE9KoPw_gsu4NItf';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
