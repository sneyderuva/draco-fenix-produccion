#!/usr/bin/env node
// Revisa la lista de planos de un video antes de renderizar.
// Regla del creador (26 de noviembre de 2026, desde el video 3): un mismo material de archivo
// («stock») sale como máximo dos veces en un video, nunca en planos seguidos y con al menos
// 60 segundos entre una aparición y la otra. Las recreaciones cuentan como material de archivo.
// Las evidencias y los lugares reales pueden volver cuando la voz los retoma, pero no en planos seguidos.
//
// Uso: node scripts/revisar_planos.mjs <planos.json> [--max 2] [--separacion 60]
// Cada plano: { vis, ini, fin, tipo?, fuente?, encuadre? }
//   tipo: archivo | recreacion | real | grafico. Si falta, se deduce del prefijo de «vis»:
//         D = archivo, R = real, el resto (C, E, T, G, X, L, K, F, CORTINILLA…) = gráfico del canal.
//   fuente: archivo o código de origen (por ejemplo, el ID de Canva). Dos recortes del mismo clip
//           comparten fuente y cuentan como el mismo material. Si falta, se usa «vis».
//   encuadre: recorte o movimiento del plano; la segunda aparición debe usar otro.
// Sale con código 1 si hay errores, para frenar el render.
import fs from 'node:fs';

const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(nombre);
  return i >= 0 ? Number(args.splice(i, 2)[1]) : porDefecto;
};
const MAX = opcion('--max', 2);
const SEPARACION = opcion('--separacion', 60);
const ruta = args[0];
if (!ruta) {
  console.error('Uso: node scripts/revisar_planos.mjs <planos.json> [--max 2] [--separacion 60]');
  process.exit(2);
}
const datos = JSON.parse(fs.readFileSync(ruta, 'utf8'));
const planos = Array.isArray(datos) ? datos : datos.planos;

const PREFIJOS = { D: 'archivo', R: 'real' };
const tipoDe = (p) => p.tipo || (p.recreacion === true ? 'recreacion' : null) ||
  PREFIJOS[String(p.vis).match(/^[A-Za-z]+/)?.[0]] || 'grafico';
const fuenteDe = (p) => p.fuente || p.vis;
const reloj = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const usos = new Map();
planos.forEach((p, i) => {
  const tipo = tipoDe(p);
  if (tipo === 'grafico') return;
  const f = fuenteDe(p);
  if (!usos.has(f)) usos.set(f, { tipo, planos: [] });
  usos.get(f).planos.push({ i, ...p });
});

const errores = [];
const avisos = [];
for (const [fuente, { tipo, planos: ps }] of usos) {
  const esArchivo = tipo === 'archivo' || tipo === 'recreacion';
  if (esArchivo && ps.length > MAX) {
    errores.push(`${fuente} (${tipo}) sale ${ps.length} veces (máximo ${MAX}): ${ps.map((p) => reloj(p.ini)).join(', ')}`);
  }
  if (!esArchivo && ps.length > 3) {
    avisos.push(`${fuente} (real) sale ${ps.length} veces: revisar si la voz de verdad vuelve a esa pieza.`);
  }
  for (let k = 1; k < ps.length; k++) {
    const a = ps[k - 1], b = ps[k];
    if (b.i === a.i + 1) {
      errores.push(`${fuente} se repite en planos seguidos (${reloj(a.ini)} y ${reloj(b.ini)}).`);
    } else if (esArchivo && b.ini - a.ini < SEPARACION) {
      errores.push(`${fuente} vuelve a salir a los ${Math.round(b.ini - a.ini)} s (mínimo ${SEPARACION} s): ${reloj(a.ini)} y ${reloj(b.ini)}.`);
    }
    if (esArchivo && (a.encuadre || '') === (b.encuadre || '')) {
      avisos.push(`${fuente}: la segunda aparición (${reloj(b.ini)}) debería llevar otro encuadre o movimiento.`);
    }
  }
}

const deArchivo = [...usos.values()].filter((u) => u.tipo === 'archivo' || u.tipo === 'recreacion');
const totalArchivo = deArchivo.reduce((s, u) => s + u.planos.length, 0);
const repetidos = deArchivo.filter((u) => u.planos.length > 1).length;
const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
const reales = [...usos.values()].filter((u) => u.tipo === 'real').length;
console.log(`Planos: ${planos.length} · material de archivo: ${deArchivo.length} distintos en ${totalArchivo} planos ` +
  `(${plural(repetidos, 'se repite', 'se repiten')}) · real: ${plural(reales, 'pieza', 'piezas')}.`);
if (avisos.length) {
  const muestra = avisos.slice(0, 12);
  console.log('\nAvisos:\n- ' + muestra.join('\n- ') + (avisos.length > 12 ? `\n- … y ${avisos.length - 12} avisos más.` : ''));
}
if (errores.length) {
  console.log(`\nErrores (${errores.length}):\n- ` + errores.join('\n- '));
  console.log('\nBusque más material de archivo (Canva Pro primero) o cambie el plano por una evidencia real antes de renderizar.');
  process.exit(1);
}
console.log('\nSin errores: ningún material de archivo se repite más de lo permitido.');
