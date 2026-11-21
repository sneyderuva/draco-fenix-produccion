# Draco Fénix · Producción

App de seguimiento del canal de YouTube Draco Fénix (crimen real narrado desde la investigación).

- Servidor: `server.js`, Node sin dependencias. Interfaz: `public/`. Datos: `data/`.
- Todo el texto visible va en español de Colombia, con tildes.
- El avance de un video se registra con `node scripts/avance.mjs <id> <paso> <estado> "nota"`, seguido de commit y push a `main`. El flujo de GitHub Actions `desplegar.yml` copia cada cambio al VPS.
- Un video nuevo es un archivo `data/videos/NNN-slug.json` con la misma estructura que `001-pozzetto.json`.
- Nunca subir `.env` ni contraseñas. No guardar guiones completos ni datos personales de víctimas en este repositorio; solo enlaces y resúmenes.
