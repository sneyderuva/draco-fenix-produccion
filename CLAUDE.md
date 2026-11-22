# Draco Fénix · Producción

App de seguimiento del canal de YouTube Draco Fénix (crimen real narrado desde la investigación).

- Servidor: `server.js`, Node sin dependencias. Interfaz: `public/`. Datos: `data/`.
- Todo el texto visible va en español de Colombia, con tildes.
- El avance de un video se registra con `node scripts/avance.mjs <id> <paso> <estado> "nota"`, seguido de commit y push a `main`. El flujo de GitHub Actions `desplegar.yml` copia cada cambio al VPS.
- Un video nuevo es un archivo `data/videos/NNN-slug.json` con la misma estructura que `001-pozzetto.json`.
- Nunca subir `.env` ni contraseñas. No guardar guiones completos ni datos personales de víctimas en este repositorio; solo enlaces y resúmenes.

## Criterio visual del canal

Referencia del creador: el canal Fusgo. Se mezclan imágenes reales con material de apoyo, según lo que diga la voz.

- Persona, lugar, documento o hecho concreto del caso: foto o video real, con fuente y licencia.
- Idea general o contexto (problemas de plata, soledad, una ciudad de noche, un trámite): foto o video de archivo («stock») acorde al tema, o una recreación sin personas.
- Menos diapositivas de texto y nada de pantallas en negro largas: cada frase del guion debe tener una imagen que la acompañe.
- Las evidencias (cartas, páginas de prensa, pasaportes, sellos) no se tapan ni se reemplazan.
- El material de archivo nunca se presenta como si fuera del caso. Las recreaciones llevan el rótulo «RECREACIÓN».
- Solo recursos gratuitos por ahora. Canva Pro (videos de archivo) es una compra posible a futuro: no se contrata sin que el creador lo pida.
