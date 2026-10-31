// Ingesta automática: lee las fuentes y actualiza Firestore.
//   node index.js            → escribe en Firestore (necesita FIREBASE_SERVICE_ACCOUNT)
//   node index.js --dry-run  → solo muestra lo que encontraría, sin escribir nada
import { fuenteAyto, fuenteDgt, fuenteNoticias } from './fuentes.js';

const DRY = process.argv.includes('--dry-run');
const INCLUIR_OBRAS = process.env.INCLUIR_OBRAS === '1';
const now = new Date();

const [ayto, dgt, news] = await Promise.allSettled([
  fuenteAyto(now, { incluirObras: INCLUIR_OBRAS }),
  fuenteDgt(now),
  fuenteNoticias(now),
]);
const resumen = (n, r) => r.status === 'fulfilled'
  ? `${n}: ${r.value.leidos} leídos → ${r.value.eventos.length} para el mapa`
  : `${n}: ERROR ${r.reason?.message || r.reason}`;
console.log(resumen('Ayuntamiento de Madrid', ayto));
console.log(resumen('DGT', dgt));
console.log(resumen('Noticias', news));

if (DRY) {
  for (const r of [ayto, dgt, news]) if (r.status === 'fulfilled') {
    for (const ev of r.value.eventos) console.log(`  [${ev.origen}/${ev.tipo}] ${ev.estado.padEnd(9)} ${ev.lugar ? ev.lugar + ' · ' : ''}${ev.titulo}`);
  }
  process.exit(0);
}

const { initializeApp, cert, applicationDefault } = await import('firebase-admin/app');
const { getFirestore, Timestamp } = await import('firebase-admin/firestore');
initializeApp({ credential: process.env.FIREBASE_SERVICE_ACCOUNT ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) : applicationDefault() });
const db = getFirestore();
const col = db.collection('eventos');
const aFirestore = ev => {
  const { id, ...d } = ev;
  for (const k of ['inicio', 'fin', 'caduca']) if (d[k] instanceof Date) d[k] = Timestamp.fromDate(d[k]);
  d.actualizado = Timestamp.now();
  return d;
};

let escritos = 0, borrados = 0, batch = db.batch(), enLote = 0;
async function op(fn) { fn(batch); enLote++; if (enLote >= 450) { await batch.commit(); batch = db.batch(); enLote = 0; } }

// Fuentes oficiales (Ayuntamiento y DGT): escribe solo lo que ha cambiado y borra lo que ya no publican.
async function sincronizar(origen, r) {
  if (r.status !== 'fulfilled') return;
  const previos = new Map((await col.where('origen', '==', origen).get()).docs.map(d => [d.id, d.get('hash')]));
  const actuales = new Set();
  for (const ev of r.value.eventos) {
    actuales.add(ev.id);
    if (previos.get(ev.id) === ev.hash) continue;
    await op(b => b.set(col.doc(ev.id), aFirestore(ev))); escritos++;
  }
  for (const id of previos.keys()) if (!actuales.has(id)) { await op(b => b.delete(col.doc(id))); borrados++; }
}
await sincronizar('ayto', ayto);
await sincronizar('dgt', dgt);

// Noticias: añade las nuevas y deja las ya publicadas como están.
if (news.status === 'fulfilled') {
  const previas = new Set((await col.where('origen', '==', 'noticia').get()).docs.map(d => d.id));
  for (const ev of news.value.eventos) {
    if (previas.has(ev.id)) continue;
    await op(b => b.set(col.doc(ev.id), aFirestore(ev))); escritos++;
  }
}

// Limpieza: noticias de hace más de 2 días.
for (const d of (await col.where('caduca', '<', Timestamp.now()).get()).docs) { await op(b => b.delete(d.ref)); borrados++; }
// Reportes de la gente de hace más de 1 día.
for (const d of (await db.collection('reportes').where('creado', '<', Timestamp.fromMillis(Date.now() - 864e5)).get()).docs) { await op(b => b.delete(d.ref)); borrados++; }

if (enLote) await batch.commit();
console.log(`Firestore: ${escritos} escritos, ${borrados} borrados`);
if ([ayto, dgt, news].every(r => r.status === 'rejected')) process.exit(1);
