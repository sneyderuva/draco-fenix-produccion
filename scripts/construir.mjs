#!/usr/bin/env node
// Genera la versión estática del tablero en ./sitio (para GitHub Pages).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const leer = (...p) => JSON.parse(fs.readFileSync(path.join(raiz, 'data', ...p), 'utf8'));
const salida = path.join(raiz, 'sitio');
fs.rmSync(salida, { recursive: true, force: true });
fs.mkdirSync(salida, { recursive: true });

const dirVideos = path.join(raiz, 'data', 'videos');
const videos = fs.readdirSync(dirVideos).filter((f) => f.endsWith('.json')).sort().map((f) => leer('videos', f));
const estado = { canal: leer('canal.json'), pasos: leer('pasos.json'), videos, generado: new Date().toISOString() };
fs.writeFileSync(path.join(salida, 'estado.json'), JSON.stringify(estado));
for (const f of ['index.html', 'app.js', 'estilos.css']) fs.copyFileSync(path.join(raiz, 'public', f), path.join(salida, f));
fs.writeFileSync(path.join(salida, '.nojekyll'), '');
console.log(`Sitio generado en ${salida} con ${videos.length} video(s).`);
