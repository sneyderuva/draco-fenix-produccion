#!/usr/bin/env node
// Registra el avance de un paso en el archivo del video.
// Uso: node scripts/avance.mjs <id-video> <paso> <hecho|en_curso|espera|pendiente> ["nota"] [--bitacora "texto"]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ESTADOS = ['hecho', 'en_curso', 'espera', 'pendiente'];
const args = process.argv.slice(2);
const b = args.indexOf('--bitacora');
const bitacora = b >= 0 ? args.splice(b, 2)[1] : null;
const [id, paso, estado, nota] = args;
if (!id || !paso || !ESTADOS.includes(estado)) {
  console.error('Uso: node scripts/avance.mjs <id-video> <paso> <' + ESTADOS.join('|') + '> ["nota"] [--bitacora "texto"]');
  process.exit(1);
}
const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const archivo = path.join(raiz, 'data', 'videos', id + '.json');
const video = JSON.parse(fs.readFileSync(archivo, 'utf8'));
if (!video.pasos[paso]) { console.error('El paso ' + paso + ' no existe en ' + id); process.exit(1); }
const hoy = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Bogota' }).format(new Date());
const p = video.pasos[paso];
p.estado = estado;
p.real = estado === 'hecho' ? hoy : null;
if (nota !== undefined) p.nota = nota;
if (bitacora) (video.bitacora ||= []).push({ fecha: hoy, texto: bitacora });
fs.writeFileSync(archivo, JSON.stringify(video, null, 2) + '\n');
console.log(`${id}: paso ${paso} → ${estado}`);
