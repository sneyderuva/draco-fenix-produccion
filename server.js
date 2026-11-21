// App de producción del canal Draco Fénix.
// Servidor sin dependencias: lee los datos de ./data y exige contraseña.
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const PORT = Number(process.env.PORT || 3000);
const PASSWORD = process.env.APP_PASSWORD || '';
const SECRET = process.env.SESSION_SECRET || '';
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'));
const PUBLIC_DIR = path.join(__dirname, 'public');
const SESSION_DAYS = 30;

if (PASSWORD.length < 8 || SECRET.length < 16) {
  console.error('Faltan APP_PASSWORD (mínimo 8 caracteres) o SESSION_SECRET (mínimo 16). Ver README.');
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
};

const digest = (s) => crypto.createHash('sha256').update(s).digest();
const sign = (v) => crypto.createHmac('sha256', SECRET).update(v).digest('hex');

function makeSession() {
  const exp = String(Date.now() + SESSION_DAYS * 864e5);
  return `${exp}.${sign(exp)}`;
}

function validSession(req) {
  const m = /(?:^|;\s*)sesion=([^;]+)/.exec(req.headers.cookie || '');
  if (!m) return false;
  const [exp, mac] = m[1].split('.');
  if (!exp || !mac || Number(exp) < Date.now()) return false;
  const good = sign(exp);
  return mac.length === good.length && crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(good));
}

// Límite simple de intentos de ingreso por dirección IP.
const attempts = new Map();
function throttled(ip) {
  const now = Date.now();
  const a = (attempts.get(ip) || []).filter((t) => now - t < 15 * 60e3);
  attempts.set(ip, a);
  return a.length >= 5;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer', 'Cache-Control': 'no-store', ...headers,
  });
  res.end(body);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadState() {
  const dir = path.join(DATA_DIR, 'videos');
  const videos = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => readJson(path.join(dir, f)))
    : [];
  return {
    canal: readJson(path.join(DATA_DIR, 'canal.json')),
    pasos: readJson(path.join(DATA_DIR, 'pasos.json')),
    videos,
    generado: new Date().toISOString(),
  };
}

function serveStatic(res, rel) {
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR + path.sep)) return send(res, 403, 'Prohibido');
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, 'No encontrado');
    send(res, 200, buf, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://local');
  const ip = req.socket.remoteAddress || '';
  const secure = req.headers['x-forwarded-proto'] === 'https' || process.env.COOKIE_SECURE === '1';
  const cookieFlags = `Path=/; HttpOnly; SameSite=Strict${secure ? '; Secure' : ''}`;

  if (url.pathname === '/salud') return send(res, 200, 'ok');

  if (url.pathname === '/login' && req.method === 'GET') return serveStatic(res, 'login.html');
  if (url.pathname === '/estilos.css') return serveStatic(res, 'estilos.css');

  if (url.pathname === '/login' && req.method === 'POST') {
    if (throttled(ip)) return send(res, 429, 'Demasiados intentos. Espere 15 minutos.');
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 2048) req.destroy(); });
    req.on('end', () => {
      const given = new URLSearchParams(body).get('clave') || '';
      if (crypto.timingSafeEqual(digest(given), digest(PASSWORD))) {
        return send(res, 302, '', { Location: '/', 'Set-Cookie': `sesion=${makeSession()}; Max-Age=${SESSION_DAYS * 86400}; ${cookieFlags}` });
      }
      attempts.get(ip).push(Date.now());
      send(res, 302, '', { Location: '/login?error=1' });
    });
    return;
  }

  if (url.pathname === '/salir') {
    return send(res, 302, '', { Location: '/login', 'Set-Cookie': `sesion=; Max-Age=0; ${cookieFlags}` });
  }

  if (!validSession(req)) {
    if (url.pathname.startsWith('/api/')) return send(res, 401, '{"error":"sin sesión"}', { 'Content-Type': TYPES['.json'] });
    return send(res, 302, '', { Location: '/login' });
  }

  if (url.pathname === '/api/estado') {
    try {
      return send(res, 200, JSON.stringify(loadState()), { 'Content-Type': TYPES['.json'] });
    } catch (e) {
      console.error(e);
      return send(res, 500, '{"error":"No se pudieron leer los datos"}', { 'Content-Type': TYPES['.json'] });
    }
  }

  if (req.method !== 'GET') return send(res, 405, 'Método no permitido');
  serveStatic(res, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
});

server.listen(PORT, () => console.log(`Draco Fénix · producción en el puerto ${PORT}`));
