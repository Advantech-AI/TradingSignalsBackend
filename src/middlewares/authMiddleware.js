import { supabaseAdmin } from '../db/SupabaseConnection';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(' Auth: No se envió token válido en Authorization header');
      return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    console.log('🔍 Auth: Validando token con Supabase Admin...');

    
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data?.user) {
      console.log('Auth: Token rechazado por Supabase:', error?.message);
      return res.status(401).json({ error: 'Token inválido o expirado.' });
    }

    req.user = data.user;
    console.log(' Auth: Usuario verificado correctamente ->', req.user.id);
    
    return next()

  } catch (err) {
    console.error(' Error grave en middleware de autenticación:', err);
    return res.status(500).json({ error: 'Error interno de autenticación.' });
  }
};