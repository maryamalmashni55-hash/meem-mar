import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Connect} from 'vite';
import {createClient} from '@supabase/supabase-js';

const messagesApi = (env: Record<string, string>): Connect.NextHandleFunction => {
  const supabase = createClient(
    env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return async (req, res, next) => {
    if (!req.url?.startsWith('/api/messages')) return next();
    res.setHeader('Content-Type', 'application/json');
    try {
      if (req.method === 'GET') {
        const {data, error} = await supabase.from('messages').select('id, student_name, message_en, seal_id, likes, created_at').order('created_at', {ascending: false});
        if (error) throw error;
        res.end(JSON.stringify(data));
        return;
      }
      let body = '';
      for await (const chunk of req) body += chunk;
      const payload = body ? JSON.parse(body) : {};
      const query = req.method === 'POST'
        ? supabase.from('messages').insert(payload).select('id, student_name, message_en, seal_id, likes, created_at').single()
        : supabase.from('messages').update({likes: payload.likes}).eq('id', payload.id).select('id, likes').single();
      const {data, error} = await query;
      if (error) throw error;
      res.statusCode = req.method === 'POST' ? 201 : 200;
      res.end(JSON.stringify(data));
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({error: 'Unable to save message'}));
    }
  };
};

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), {name: 'messages-api', configureServer(server) { server.middlewares.use(messagesApi(env)); }}],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
