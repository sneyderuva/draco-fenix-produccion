'use strict';
const $ = (s) => document.querySelector(s);
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ESTADOS = { hecho: 'Hecho', en_curso: 'En curso', espera: 'Espera al creador', pendiente: 'Pendiente' };
const fmtFecha = (iso, opt = { day: 'numeric', month: 'short' }) =>
  iso ? new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', opt) : 'Por definir';
const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

let datos = null;
let vista = location.hash.slice(1).split('/')[0] || 'tablero';
let desfaseSemana = 0;

const pasoDe = (v, id) => v.pasos[String(id)] || { estado: 'pendiente' };
const hechos = (v) => datos.pasos.filter((p) => pasoDe(v, p.id).estado === 'hecho').length;
const actual = (v) => datos.pasos.find((p) => pasoDe(v, p.id).estado !== 'hecho');

function listaPasos(v) {
  return `<ol class="pasos">${datos.pasos.map((p) => {
    const e = pasoDe(v, p.id).estado;
    return `<li class="paso ${esc(e)}"><b>${p.id}. ${esc(p.nombre)}</b><small>${esc(ESTADOS[e] || e)} · ${esc(p.responsable)}</small></li>`;
  }).join('')}</ol>`;
}

function tablero() {
  const esperas = datos.videos.flatMap((v) => datos.pasos
    .filter((p) => pasoDe(v, p.id).estado === 'espera')
    .map((p) => `<li><b>${esc(v.caso)}</b>: ${esc(p.nombre)}${pasoDe(v, p.id).nota ? ' — ' + esc(pasoDe(v, p.id).nota) : ''}</li>`));
  const aviso = esperas.length
    ? `<div class="aviso"><b>Pendiente del creador</b><ul>${esperas.join('')}</ul></div>`
    : `<div class="aviso ok">No hay aprobaciones pendientes del creador.</div>`;
  const tarjetas = datos.videos.map((v) => {
    const n = hechos(v), total = datos.pasos.length, a = actual(v);
    return `<section class="tarjeta">
      <div class="fila"><div><h3>${esc(v.caso)}</h3><div class="sub" style="margin:0">${esc(v.titulo_trabajo)}</div></div>
      <a class="btn" href="#videos/${esc(v.id)}">Ver ficha</a></div>
      <div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${n}"><i style="width:${(n / total) * 100}%"></i></div>
      <div class="fila"><span>${n} de ${total} pasos</span><span class="lema">${a ? 'Paso actual: ' + a.id + '. ' + esc(a.nombre) : 'Producción terminada'}</span></div>
      ${listaPasos(v)}
    </section>`;
  }).join('') || '<p class="sub">Aún no hay videos en producción.</p>';
  return `<h1>Tablero</h1><p class="sub">Estado de cada video en producción.</p>${aviso}${tarjetas}`;
}

function cronograma() {
  const hoy = new Date();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7) + desfaseSemana * 7);
  const dias = [...Array(7)].map((_, i) => { const d = new Date(lunes); d.setDate(lunes.getDate() + i); return d; });
  const celdas = dias.map((d) => {
    const iso = isoLocal(d);
    const ev = datos.videos.flatMap((v) => datos.pasos
      .filter((p) => pasoDe(v, p.id).plan === iso)
      .map((p) => `<div class="evento ${esc(pasoDe(v, p.id).estado)}">${p.id}. ${esc(p.nombre)}<small>${esc(v.caso)} · ${esc(p.responsable)}</small></div>`));
    const pub = datos.videos.filter((v) => v.fecha_publicacion_plan === iso)
      .map((v) => `<div class="evento en_curso">Publicación<small>${esc(v.caso)}</small></div>`);
    return `<div class="dia ${iso === isoLocal(hoy) ? 'hoy' : ''}"><h4>${d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}</h4>${ev.concat(pub).join('') || ''}</div>`;
  }).join('');
  return `<h1>Cronograma</h1>
    <div class="fila" style="margin-bottom:16px"><p class="sub" style="margin:0">Semana del ${fmtFecha(isoLocal(dias[0]))} al ${fmtFecha(isoLocal(dias[6]))}</p>
    <div><button class="btn" data-semana="-1">← Anterior</button><button class="btn" data-semana="0">Hoy</button><button class="btn" data-semana="1">Siguiente →</button></div></div>
    <div class="semana">${celdas}</div>`;
}

function videos() {
  const id = location.hash.split('/')[1];
  const v = datos.videos.find((x) => x.id === id) || datos.videos[0];
  if (!v) return '<h1>Videos</h1><p class="sub">Aún no hay videos.</p>';
  const selector = datos.videos.length > 1
    ? `<p>${datos.videos.map((x) => `<a class="btn" href="#videos/${esc(x.id)}">${esc(x.caso)}</a>`).join('')}</p>` : '';
  const filas = datos.pasos.map((p) => {
    const s = pasoDe(v, p.id);
    return `<tr><td>${p.id}. ${esc(p.nombre)}</td><td>${esc(p.responsable)}</td><td><span class="etiqueta">${esc(ESTADOS[s.estado] || s.estado)}</span></td><td>${fmtFecha(s.plan)}</td><td>${s.real ? fmtFecha(s.real) : ''}</td><td>${esc(s.nota)}</td></tr>`;
  }).join('');
  const fuentes = (v.fuentes || []).map((f) => `<li>${f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.titulo || f.url)}</a>` : esc(f.titulo)}${f.nota ? ' — ' + esc(f.nota) : ''}</li>`).join('');
  const bit = (v.bitacora || []).slice().reverse().map((b) => `<tr><td style="white-space:nowrap">${fmtFecha(b.fecha)}</td><td>${esc(b.texto)}</td></tr>`).join('');
  const m = v.metricas;
  return `<h1>${esc(v.caso)}</h1><p class="sub">Video ${esc(v.numero)} · ${hechos(v)} de ${datos.pasos.length} pasos</p>${selector}
    <section class="tarjeta"><dl>
      <dt>Título de trabajo</dt><dd>${esc(v.titulo_trabajo)}${v.titulo_nota ? `<br><small class="lema">${esc(v.titulo_nota)}</small>` : ''}</dd>
      <dt>Ángulo</dt><dd>${esc(v.angulo)}</dd>
      <dt>Duración objetivo</dt><dd>${esc(v.duracion_objetivo_min)} minutos</dd>
      <dt>Formato</dt><dd>${esc(v.formato)}</dd>
      <dt>Demanda</dt><dd>${esc(v.demanda)}</dd>
      <dt>Publicación</dt><dd>${fmtFecha(v.fecha_publicacion_plan, { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
    </dl></section>
    <h2>Pasos</h2><section class="tarjeta" style="overflow-x:auto"><table><thead><tr><th>Paso</th><th>Responsable</th><th>Estado</th><th>Plan</th><th>Hecho</th><th>Nota</th></tr></thead><tbody>${filas}</tbody></table></section>
    <h2>Resultados</h2><section class="tarjeta">${m ? `<div class="cifras">
      <div class="cifra"><b>${esc(m.vistas ?? '—')}</b><span>Vistas</span></div>
      <div class="cifra"><b>${esc(m.ctr_pct ?? '—')} %</b><span>Clics sobre impresiones</span></div>
      <div class="cifra"><b>${esc(m.retencion_pct ?? '—')} %</b><span>Retención media</span></div></div>` : '<span class="lema">Disponible después de publicar.</span>'}</section>
    <h2>Fuentes verificadas</h2><section class="tarjeta">${fuentes ? `<ul>${fuentes}</ul>` : '<span class="lema">Se llenan al terminar la investigación y la verificación.</span>'}</section>
    <h2>Bitácora</h2><section class="tarjeta"><table><tbody>${bit}</tbody></table></section>`;
}

function canal() {
  const c = datos.canal, m = c.metricas, meta = c.meta_monetizacion;
  const pct = (a, b) => Math.min(100, Math.round((a / b) * 100));
  return `<h1>${esc(c.nombre)}</h1><p class="sub"><a href="${esc(c.url)}" target="_blank" rel="noopener noreferrer">${esc(c.identificador)}</a> · datos al ${fmtFecha(m.actualizado, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
    <section class="tarjeta cifras">
      <div class="cifra"><b>${esc(m.suscriptores)}</b><span>Suscriptores</span></div>
      <div class="cifra"><b>${esc(m.horas_reproduccion)}</b><span>Horas de reproducción</span></div>
      <div class="cifra"><b>${esc(m.videos_publicados)}</b><span>Videos publicados</span></div>
      <div class="cifra"><b>${datos.videos.length}</b><span>Videos en producción</span></div>
    </section>
    <h2>Avance hacia la monetización</h2><section class="tarjeta">
      <div class="fila"><span>Suscriptores</span><span class="lema">${esc(m.suscriptores)} de ${esc(meta.suscriptores)}</span></div>
      <div class="barra"><i style="width:${pct(m.suscriptores, meta.suscriptores)}%"></i></div>
      <div class="fila" style="margin-top:14px"><span>Horas de reproducción</span><span class="lema">${esc(m.horas_reproduccion)} de ${esc(meta.horas_reproduccion)}</span></div>
      <div class="barra"><i style="width:${pct(m.horas_reproduccion, meta.horas_reproduccion)}%"></i></div>
    </section>`;
}

const VISTAS = { tablero, cronograma, videos, canal };

function pintar() {
  if (!datos) return;
  if (!VISTAS[vista]) vista = 'tablero';
  $('#lema').textContent = datos.canal.lema;
  document.querySelectorAll('nav button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.vista === vista)));
  $('#contenido').innerHTML = VISTAS[vista]();
  $('#pie').textContent = 'Actualizado ' + new Date(datos.generado).toLocaleString('es-CO');
}

async function cargar() {
  try {
    const r = await fetch('/api/estado', { cache: 'no-store' });
    if (r.status === 401) { location.href = '/login'; return; }
    if (!r.ok) throw new Error(r.status);
    datos = await r.json();
    pintar();
  } catch (e) {
    if (!datos) $('#contenido').innerHTML = '<div class="aviso">No se pudieron cargar los datos. Se reintenta en un minuto.</div>';
  }
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('nav button');
  if (tab) { location.hash = tab.dataset.vista; return; }
  const sem = e.target.closest('[data-semana]');
  if (sem) { const n = Number(sem.dataset.semana); desfaseSemana = n === 0 ? 0 : desfaseSemana + n; pintar(); }
});
window.addEventListener('hashchange', () => { vista = location.hash.slice(1).split('/')[0] || 'tablero'; pintar(); window.scrollTo(0, 0); });

cargar();
setInterval(cargar, 60000);
