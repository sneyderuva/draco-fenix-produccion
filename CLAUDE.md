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

## Tono y meta de monetización

Meta a corto plazo del creador (24 de noviembre de 2026): monetizar pronto, con videos más viscerales que no pierdan los anuncios. El avance se ve en la sección Canal del tablero (`meta_corto_plazo` en `data/canal.json`).

- Visceral sí: abrir en el momento de más tensión, frases cortas, pausas y detalles macabros verificados (el olor que delató un escondite, lo que guardaba el asesino, una frase suya, una cifra que estremece).
- Cada detalle macabro tiene fuente y se dice una vez, sin describir heridas, sangre ni sufrimiento.
- Nada de sangre, heridas, cadáveres ni restos en pantalla, tampoco en recreaciones: YouTube no paga anuncios en contenido impactante con gore o partes del cuerpo.
- Crímenes contra menores: el hecho, la cifra y la investigación, nunca cómo ocurrieron. El contenido centrado en el abuso infantil sigue sin anuncios completos.
- Otros temas sensibles (abuso sexual, violencia doméstica, suicidio) se pueden nombrar sin detalle gráfico: desde enero de 2026 reciben anuncios completos.
- Título, miniatura y primeros segundos: tensión sí, imagen o palabra gráfica no.
- El asesino nunca es el héroe: la protagonista es la investigación.

## Instagram (@dracofenix_)

Perfil de creador («Creador(a) digital») configurado el 25 de noviembre de 2026: nombre «Draco Fénix», la misma foto del canal de YouTube y la presentación «Crimen real contado desde la investigación. Videos completos en YouTube ↓». El enlace a YouTube solo se agrega desde la app del celular.

Conectado a vidIQ el 25 de noviembre de 2026 (cuenta 29274461912211840): puede publicar reels y leer estadísticas.

- Reels propios, con el mismo criterio de tono: casos en 60 segundos (otros casos, con el error que los delató), datos macabros (un detalle verificado, con su fuente en pantalla), expedientes abiertos (casos sin resolver y desaparecidos) y tragedias o catástrofes con su investigación.
- Ganchos: cada video de YouTube tiene uno o más reels que terminan invitando al video completo.
- Ningún reel se publica sin que el creador lo apruebe.
