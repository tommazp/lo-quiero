// ============================================
// js/supabase.js — Supabase client (shared)
// ============================================
// INSTRUCCIONES:
// 1. Creá un proyecto en https://supabase.com
// 2. Andá a Settings > API
// 3. Copiá la URL y la anon key y pegá abajo
// ============================================

const SUPABASE_URL = 'https://TU_PROYECTO.supabase.co';        // <-- REEMPLAZAR
const SUPABASE_ANON_KEY = 'TU_ANON_KEY_PUBLICA';               // <-- REEMPLAZAR

// La contraseña del admin NUNCA va aquí.
// Se verifica contra Supabase Auth desde el servidor.

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default _supabase;
export { SUPABASE_URL, SUPABASE_ANON_KEY };
