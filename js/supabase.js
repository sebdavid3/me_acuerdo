/**
 * Cliente Supabase y consultas a la base de datos
 * Paso 4: conectar con Supabase para leer/escribir recuerdos
 */

let supabaseClient = null;

function initSupabase() {
  if (window.supabase && CONFIG.SUPABASE_ANON_KEY !== 'REEMPLAZAR_CON_ANON_KEY') {
    supabaseClient = window.supabase.createClient(
      CONFIG.SUPABASE_URL,
      CONFIG.SUPABASE_ANON_KEY
    );
    console.log('Supabase inicializado');
  } else {
    console.warn('Supabase no disponible o falta ANON_KEY');
  }
}

async function fetchEntries() {
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient
    .from('entries')
    .select('*')
    .order('entry_date', { ascending: true });
  if (error) {
    console.error('Error cargando recuerdos:', error);
    return [];
  }
  return data || [];
}

async function insertEntry(content, entryDate) {
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient
    .from('entries')
    .insert([{ content, entry_date: entryDate }]);
  if (error) {
    console.error('Error guardando recuerdo:', error);
    return null;
  }
  return data;
}

async function updateEntry(id, updates) {
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient
    .from('entries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) {
    console.error('Error actualizando recuerdo:', error);
    return null;
  }
  return data;
}

async function deleteEntry(id) {
  if (!supabaseClient) return null;
  const { error } = await supabaseClient
    .from('entries')
    .delete()
    .eq('id', id);
  if (error) {
    console.error('Error borrando recuerdo:', error);
    return null;
  }
  return true;
}

async function fetchSettingsPassword() {
  if (!supabaseClient) return null;
  const { data, error } = await supabaseClient
    .from('settings')
    .select('value')
    .eq('key', 'password')
    .single();
  if (error) {
    console.error('Error leyendo contraseña:', error);
    return null;
  }
  return data?.value || null;
}

async function searchEntries(query) {
  if (!supabaseClient) return [];
  const { data, error } = await supabaseClient
    .from('entries')
    .select('*')
    .ilike('content', `%${query}%`)
    .order('entry_date', { ascending: true });
  if (error) {
    console.error('Error buscando:', error);
    return [];
  }
  return data || [];
}

async function fetchEntriesByMonth(year, month) {
  if (!supabaseClient) return [];
  const start = `${year}-${String(month).padStart(2, '0')}-01`;
  const end = new Date(year, month, 0).toISOString().split('T')[0];
  const { data, error } = await supabaseClient
    .from('entries')
    .select('*')
    .gte('entry_date', start)
    .lte('entry_date', end)
    .order('entry_date', { ascending: true });
  if (error) {
    console.error('Error filtrando por mes:', error);
    return [];
  }
  return data || [];
}
