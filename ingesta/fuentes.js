// Fuentes automáticas: leen, limpian y convierten cada aviso al formato de la web.
// No escriben nada: eso lo hace index.js.
import { createHash } from 'node:crypto';
import { buscarLugar } from './lugares.js';

export const AYTO_URL = 'https://datos.madrid.es/egob/catalogo/202062-0-trafico-incidencias-viapublica.xml';
export const AYTO_WEB = 'https://www.madrid.es/incidenciastrafico.html';
const BUSQUEDA = '(manifestación OR concentración OR disturbios OR saqueos OR barricadas OR huelga OR tractorada OR "corte de tráfico" OR "cortes de tráfico" OR "calles cortadas") when:1d';
export const NEWS_URL = `https://news.google.com/rss/search?q=${encodeURIComponent(BUSQUEDA)}&hl=es&gl=ES&ceid=ES:es`;

const TZ = 'Europe/Madrid';
const H = 3600e3;
export const fmtDia = d => new Intl.DateTimeFormat('sv-SE', { timeZone: TZ }).format(d);
export function diasEntre(ini, fin) {
  const out = [], ultimo = fmtDia(fin && fin > ini ? fin : ini);
  for (let t = ini.getTime(); out.length < 14; t += 864e5) {
    const s = fmtDia(new Date(t)); if (s > ultimo) break;
    if (!out.includes(s)) out.push(s);
  }
  if (!out.includes(ultimo) && out.length < 14) out.push(ultimo);
  return out;
}
export const hash = o => createHash('sha1').update(JSON.stringify(o)).digest('hex').slice(0, 16);

// ---------- lectura de XML sencilla (las dos fuentes son planas) ----------
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export function limpiar(s = '') {
  return String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENT[e.toLowerCase()] ?? m))
    .replace(/\s+/g, ' ')
    .trim();
}
export function bloques(xml, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'g');
  return [...xml.matchAll(re)].map(m => m[1]);
}
export function campos(bloque) {
  const out = {};
  for (const m of bloque.matchAll(/<([\w:]+)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)) if (!(m[1] in out)) out[m[1]] = m[2];
  for (const m of bloque.matchAll(/<([\w:]+)(?:\s[^>]*)?\/>/g)) if (!(m[1] in out)) out[m[1]] = '';
  return out;
}
async function descargar(url, fetchFn) {
  const res = await fetchFn(url, { headers: { 'user-agent': 'HayLioHoy/1.0 (+ingesta de avisos públicos)' } });
  if (!res.ok) throw new Error(`${url} respondió ${res.status}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  const cab = new TextDecoder('ascii').decode(buf.slice(0, 200));
  const enc = (cab.match(/encoding=["']([\w-]+)["']/i)?.[1] || 'utf-8').toLowerCase();
  return new TextDecoder(enc).decode(buf);
}

// ---------- clasificación por texto ----------
export function clasificar(texto) {
  const t = texto.toLowerCase();
  if (/disturbio|altercad|enfrentamient|saqueo|barricad|cargas? policial/.test(t)) return 'disturbios';
  if (/manifestaci|concentraci|marcha |protesta|movilizaci|cacerolada|tractorada/.test(t)) return 'manifestacion';
  if (/huelga|\bparos?\b/.test(t)) return 'huelga';
  if (/partido|concierto|carrera|marat[oó]n|festival|procesi[oó]n|cabalgata|desfile|evento/.test(t)) return 'evento';
  if (/cort(e|es|ad[ao]s?)\b|cierre de calle/.test(t)) return 'corte';
  return null;
}
const titular = s => { const t = s.length > 110 ? s.slice(0, 107).replace(/\s+\S*$/, '') + '…' : s; return t.charAt(0).toUpperCase() + t.slice(1); };
function estado(inicio, fin, now) {
  if (fin && now > fin) return 'terminado';
  return now >= inicio ? 'en_curso' : 'previsto';
}

// ---------- Ayuntamiento de Madrid: incidencias en vía pública (se actualiza cada 5 min) ----------
export function normalizarAyto(c, now, { incluirObras = false } = {}) {
  const lat = parseFloat(c.latitud), lng = parseFloat(c.longitud);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (c.es_contaminacion === 'S' || c.es_accidente === 'S') return null;
  if (c.es_obras === 'S' && !incluirObras) return null;
  const desc = limpiar(c.descripcion), tipoNombre = limpiar(c.nom_tipo_incidencia);
  const esEvento = ['3', '4'].includes(String(c.tipoincid).trim());
  let tipo = clasificar(`${tipoNombre} ${desc}`);
  if (!tipo && !esEvento) return null;
  tipo ||= 'corte';
  const inicio = new Date(limpiar(c.fh_inicio)), finRaw = new Date(limpiar(c.fh_final));
  if (isNaN(inicio)) return null;
  const fin = isNaN(finRaw) ? null : finRaw;
  if (fin && fin.getTime() < now.getTime() - 2 * H) return null;
  const texto = desc || tipoNombre || 'Incidencia en la vía pública';
  const id = 'ayto-' + (limpiar(c.id_incidencia) || limpiar(c.codigo).replace(/\W+/g, '-'));
  const ev = {
    id, origen: 'ayto', tipo,
    titulo: titular(texto),
    descripcion: texto.length > 110 ? texto : '',
    lugar: 'Madrid',
    estado: limpiar(c.incid_estado) === '4' && now < inicio ? 'previsto' : estado(inicio, fin, now),
    inicio, fin,
    dias: diasEntre(inicio < now ? now : inicio, fin && fin > now ? fin : null),
    punto: { lat: +lat.toFixed(6), lng: +lng.toFixed(6) },
    recorrido: [],
    fuenteNombre: 'Ayuntamiento de Madrid', fuenteUrl: AYTO_WEB,
  };
  ev.hash = hash([ev.tipo, ev.titulo, ev.descripcion, ev.estado, +ev.inicio, ev.fin && +ev.fin, ev.dias, ev.punto]);
  return ev;
}
export async function fuenteAyto(now = new Date(), { fetchFn = fetch, incluirObras = false } = {}) {
  const xml = await descargar(AYTO_URL, fetchFn);
  const lista = bloques(xml, 'Incidencia').map(campos);
  return { leidos: lista.length, eventos: lista.map(c => normalizarAyto(c, now, { incluirObras })).filter(Boolean) };
}

// ---------- Noticias: Google News (RSS), últimas 24 h ----------
export function normalizarNoticia(it, now) {
  let titulo = limpiar(it.title), medio = limpiar(it.source);
  const corte = titulo.lastIndexOf(' - ');
  if (corte > 20) { medio ||= titulo.slice(corte + 3); titulo = titulo.slice(0, corte); }
  if (/real madrid|atl[eé]tico de madrid|\bbar[cç]a\b|f\.?c\.? barcelona/i.test(titulo)) return null;
  const tipo = clasificar(titulo);
  if (!tipo) return null;
  // Solo noticias que se pueden situar en España (así se quedan fuera las de otros países).
  const lugar = buscarLugar(titulo);
  if (!lugar) return null;
  const pub = new Date(limpiar(it.pubDate));
  if (isNaN(pub) || now - pub > 24 * H || pub - now > H) return null;
  const link = limpiar(it.link);
  if (!/^https?:\/\//.test(link)) return null;
  const fin = new Date(pub.getTime() + 3 * H);
  return {
    id: 'news-' + hash(link), origen: 'noticia', tipo,
    titulo: titular(titulo), descripcion: '', lugar: lugar.nombre,
    estado: estado(pub, fin, now), inicio: pub, fin, dias: [fmtDia(pub)],
    punto: { lat: lugar.lat, lng: lugar.lng }, recorrido: [],
    fuenteNombre: medio || 'Noticia', fuenteUrl: link,
    caduca: new Date(pub.getTime() + 48 * H),
  };
}
export async function fuenteNoticias(now = new Date(), { fetchFn = fetch } = {}) {
  const xml = await descargar(NEWS_URL, fetchFn);
  const items = bloques(xml, 'item').map(campos);
  const vistos = new Set(), eventos = [];
  for (const it of items) {
    const ev = normalizarNoticia(it, now);
    if (!ev) continue;
    const clave = ev.titulo.toLowerCase().replace(/[^a-záéíóúñ ]/g, '').slice(0, 60);
    if (vistos.has(clave)) continue;
    vistos.add(clave); eventos.push(ev);
  }
  return { leidos: items.length, eventos };
}

// ---------- DGT: incidencias en carreteras de toda España (DATEX II v3.7) ----------
// Solo se quedan las que tienen que ver con protestas, huelgas, disturbios o eventos.
export const DGT_URL = 'https://nap.dgt.es/datex2/v3/dgt/SituationPublication/datex2_v37.xml';
export const DGT_WEB = 'https://infocar.dgt.es/etraffic/';
const valor = (b, n) => { const m = b.match(new RegExp(`<(?:[\\w-]+:)?${n}\\b[^>]*>([^<]*)<`, 'i')); return m ? limpiar(m[1]) : ''; };
const MOTIVOS = [
  [/demonstration|\bmarch\b|crowd|manifestaci|concentraci|tractorada/i, 'manifestacion', 'Corte por manifestación'],
  [/riot|publicdisturbance|disturbio|altercation|assetdestruction/i, 'disturbios', 'Incidentes en la vía'],
  [/strike|huelga/i, 'huelga', 'Afección por huelga'],
  [/blockade|filterblockade|goslowoperation|bloqueo/i, 'corte', 'Bloqueo de la vía'],
  [/publicevent|majorevent|sportsevent|concert|parade|procession|marathon|cyclerace|festival/i, 'evento', 'Corte por evento'],
];
export function normalizarDgt(attrs, b, now) {
  const tipoXsi = (attrs.match(/type="(?:[\w-]+:)?([\w]+)"/) || [])[1] || '';
  const motivo = [tipoXsi, valor(b, 'causeType'), valor(b, 'publicEventType'), valor(b, 'disturbanceActivityType'), valor(b, 'genericSituationRecordName'), valor(b, 'causeDescription')].join(' ');
  const hit = MOTIVOS.find(([re]) => re.test(motivo));
  if (!hit) return null;
  const lat = parseFloat(valor(b, 'latitude')), lng = parseFloat(valor(b, 'longitude'));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  const inicio = new Date(valor(b, 'overallStartTime')), finRaw = new Date(valor(b, 'overallEndTime'));
  if (isNaN(inicio)) return null;
  const fin = isNaN(finRaw) ? null : finRaw;
  if (fin && fin.getTime() < now.getTime() - 2 * H) return null;
  const via = valor(b, 'roadName'), muni = valor(b, 'municipality'), prov = valor(b, 'province');
  const lugar = [via, muni, prov && prov !== muni ? prov : ''].filter(Boolean).join(', ');
  const idAttr = (attrs.match(/\bid="([^"]+)"/) || [])[1];
  const ev = {
    id: 'dgt-' + (idAttr ? idAttr.replace(/[^\w-]+/g, '-').slice(0, 80) : hash([lat, lng, +inicio])), origen: 'dgt', tipo: hit[1],
    titulo: titular(`${hit[2]}${via ? ' en ' + via : ''}${muni ? ' (' + muni + ')' : ''}`),
    descripcion: '', lugar,
    estado: estado(inicio, fin, now), inicio, fin,
    dias: diasEntre(inicio < now ? now : inicio, fin && fin > now ? fin : null),
    punto: { lat: +lat.toFixed(6), lng: +lng.toFixed(6) }, recorrido: [],
    fuenteNombre: 'DGT', fuenteUrl: DGT_WEB,
  };
  ev.hash = hash([ev.tipo, ev.titulo, ev.estado, +ev.inicio, ev.fin && +ev.fin, ev.dias, ev.punto]);
  return ev;
}
export async function fuenteDgt(now = new Date(), { fetchFn = fetch } = {}) {
  const xml = await descargar(DGT_URL, fetchFn);
  const recs = [...xml.matchAll(/<(?:[\w-]+:)?situationRecord\b([^>]*)>([\s\S]*?)<\/(?:[\w-]+:)?situationRecord>/g)];
  return { leidos: recs.length, eventos: recs.map(m => normalizarDgt(m[1], m[2], now)).filter(Boolean) };
}
