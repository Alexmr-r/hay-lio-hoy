# ¿Hay lío hoy? · España

Mapa en directo de manifestaciones, cortes, huelgas, disturbios y reportes de la gente en toda España.

## Qué hay en la carpeta

- `public/index.html`: la web entera (un solo archivo).
- `firestore.rules`: quién puede leer y escribir en la base de datos.
- `ingesta/`: programa que cada 10 minutos lee el Ayuntamiento de Madrid, la DGT y las noticias, y lo sube al mapa.
- `.github/workflows/ingesta.yml`: lo ejecuta GitHub automáticamente.
