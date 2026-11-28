# Draco Fénix · Producción

App de seguimiento del canal de YouTube Draco Fénix (crimen real narrado desde la investigación).

- Servidor: `server.js`, Node sin dependencias. Interfaz: `public/`. Datos: `data/`.
- Todo el texto visible va en español de Colombia, con tildes.
- El avance de un video se registra con `node scripts/avance.mjs <id> <paso> <estado> "nota"`, seguido de commit y push a `main`. El flujo de GitHub Actions `desplegar.yml` copia cada cambio al VPS.
- Un video nuevo es un archivo `data/videos/NNN-slug.json` con la misma estructura que `001-pozzetto.json`.
- Nunca subir `.env` ni contraseñas. No guardar guiones completos ni datos personales de víctimas en este repositorio; solo enlaces y resúmenes.

## Orden de trabajo

- La investigación y la verificación de hechos (pasos 2 a 4) se terminan antes de escribir el guion (paso 5): cada dato del guion queda con su fuente abierta y revisada.
- La voz no se graba mientras quede un dato sin verificar.

## Criterio visual del canal

Referencia del creador: el canal Fusgo. Se mezclan imágenes reales con material de apoyo, según lo que diga la voz.

- Persona, lugar, documento o hecho concreto del caso: foto o video real, con fuente y licencia.
- Idea general o contexto (problemas de plata, soledad, una ciudad de noche, un trámite): foto o video de archivo («stock») acorde al tema, o una recreación sin personas.
- Menos diapositivas de texto y nada de pantallas en negro largas: cada frase del guion debe tener una imagen que la acompañe.
- Las evidencias (cartas, páginas de prensa, pasaportes, sellos) no se tapan ni se reemplazan.
- Material real de baja resolución (menos de 1280 px de ancho, como el video de cámaras corporales de Defensa del video 3): no va a pantalla completa. Se enmarca y se centra, a no más de 2,5 veces su tamaño original, con su rótulo de fuente, lugar y fecha (decisión del creador del 26 de noviembre de 2026).
- El material de archivo nunca se presenta como si fuera del caso. Las recreaciones llevan el rótulo «RECREACIÓN».
- Los videos ya subidos no se modifican: las mejoras se aplican desde el siguiente video (decisión del creador del 26 de noviembre de 2026).
- Desde el video 3: cortinilla v3 (fotos reales de stock en lugar de ilustraciones), la carpeta del expediente para «Abramos el expediente» y las fichas de verificación EN DEBATE, CONFIRMADO y ¿PURA CARRETA?. Están en 00_Plantilla_canal; la carpeta se genera con el número y el asunto de cada video.
- Canva Pro contratado por el creador el 25 de noviembre de 2026: sus fotos y videos de archivo son la fuente principal del material de apoyo. Fuera de Canva, solo recursos gratuitos; ninguna otra compra sin que el creador la pida.

### Material de archivo sin repetir (decisiones del creador del 26 y del 27 de noviembre de 2026, desde el video 3)

Repetir el mismo material de archivo le quita seriedad al video y desconecta a la audiencia.

- Ninguna foto o video de archivo («stock») se repite en un video, y todo el material de apoyo sale de Canva Pro (decisión del 27 de noviembre de 2026; reemplaza el máximo de dos apariciones del 26). Las recreaciones cuentan igual.
- Si faltan imágenes, se busca más material en Canva Pro o se usa una evidencia real; nunca se rellena repitiendo.
- Al buscar el material de un video, se cuentan las frases del guion que piden material de archivo y se consigue un clip distinto para cada una antes de armar el montaje. Los planos de archivo largos (10 s o más) se parten en dos clips distintos.
- Las evidencias y los lugares reales pueden volver cuando la voz los retoma, pero no en planos seguidos; al volver, se muestra otra parte del documento o con otro encuadre.
- Cada plano de la lista lleva `tipo` (archivo, recreacion, real o grafico), `fuente` (el archivo o el ID de Canva; dos recortes del mismo clip comparten fuente) y `encuadre`.
- Antes de renderizar, `node scripts/revisar_planos.mjs <planos.json>` (por defecto, una aparición por clip) debe pasar sin errores. Referencia: el video 2 (ya subido, no se modifica) usó 70 clips de archivo en 145 planos y 20 de ellos salieron tres veces o más; el tablero con hilo rojo salió 8 veces.

## Tono y meta de monetización

Meta a corto plazo del creador (24 de noviembre de 2026): monetizar pronto, con videos más viscerales que no pierdan los anuncios. El avance se ve en la sección Canal del tablero (`meta_corto_plazo` en `data/canal.json`).

- Visceral sí: abrir en el momento de más tensión, frases cortas, pausas y detalles macabros verificados (el olor que delató un escondite, lo que guardaba el asesino, una frase suya, una cifra que estremece).
- Cada detalle macabro tiene fuente y se dice una vez, sin describir heridas, sangre ni sufrimiento.
- Material real del caso (escena del crimen, evidencia, un cuerpo cubierto): decisión del creador del 26 de noviembre de 2026. Solo difuminado por completo, de modo que no se distinga sangre, heridas, el cuerpo ni la cara de la víctima; unos pocos segundos y mientras la voz explica la investigación. Nunca en la miniatura, el título ni el gancho (primeros 30 segundos), y nunca de víctimas menores de edad. Guías de anunciantes de YouTube: cuerpos totalmente difuminados en un video educativo reciben anuncios completos; con heridas visibles, anuncios limitados; fotos de escenas del crimen sin contexto, sin anuncios.
- Sin difuminar, nada de sangre, heridas, cadáveres ni restos en pantalla, tampoco en recreaciones: YouTube no paga anuncios en contenido impactante con gore o partes del cuerpo.
- Crímenes contra menores: el hecho, la cifra y la investigación, nunca cómo ocurrieron. El contenido centrado en el abuso infantil sigue sin anuncios completos.
- Otros temas sensibles (abuso sexual, violencia doméstica, suicidio) se pueden nombrar de paso y sin detalle gráfico: así reciben anuncios completos. Si uno de ellos es el foco de un segmento, los anuncios se limitan aunque el tratamiento sea documental.
- Título, miniatura y primeros segundos: tensión sí, imagen o palabra gráfica no.
- El asesino nunca es el héroe: la protagonista es la investigación.

## Calendario de publicación

Meta del creador (26 de noviembre de 2026): dos videos largos por semana, jueves y domingo a las 6:00 p. m. (Bogotá), desde el domingo 29 de noviembre de 2026. Única excepción: Pozzetto sale el viernes 4 de diciembre de 2026, el día de los 40 años de la masacre, en lugar del jueves 3.

- Siempre hay dos videos en curso: uno en investigación y verificación, y otro en guion, voz y montaje. Cada video empieza su investigación al menos 10 días antes de su fecha.
- Cada video largo da de 2 a 4 cortes verticales 9:16 para Shorts y Reels, que terminan invitando al video completo.

## Carpetas del PC

- No se borran carpetas ni archivos de producción (planos, voz, evidencias, material de apoyo, sonido y versiones anteriores): de ahí salen los cortes 9:16 para Shorts y Reels. Lo que ya no se usa pasa a 99_Archivo_de_trabajo; solo se borran las partes temporales de las copias al PC.
- Los cortes verticales de cada video van en su carpeta 10_Shorts_y_Reels.
- Copias al PC: los videos e imágenes viajan dentro de paquetes .tar.gz (enviados sueltos, los MP4 llegan alterados) y se verifican con md5 al desempacar. Los paquetes y partes temporales quedan en `_to_delete` de la carpeta del video hasta que el creador los borre.
- Cada video lleva su proyecto de Filmora en 06_Edicion_Filmora (planos en orden en Video 1; voz, música y efectos en tres pistas de audio), además del MP4 exportado en 07_Exportados.

## Voz (ElevenLabs)

- Modelo Eleven v4 y voz «David - Deep, Attractive, Mysterious», con los mismos ajustes del piloto.
- El guion de voz va sin códigos: cada sección se copia completa y sale en un solo audio. Las etiquetas de emoción van en inglés y entre corchetes.
- La base es [serious] y [thoughtful]. [hushed] se usa muy pocas veces, solo en un momento puntual, y [whispers] no se usa.

## Efectos de sonido

- Nada de swoosh ni whoosh: suenan burlescos y le quitan seriedad al video (decisión del creador del 26 de noviembre de 2026). Las entradas y las transiciones suenan a papel: pasar hoja, papel que se desliza o acetato. La cortinilla v3 ya va así.

## Instagram (@dracofenix_)

Perfil de creador («Creador(a) digital») configurado el 25 de noviembre de 2026: nombre «Draco Fénix», la misma foto del canal de YouTube y la presentación «Crimen real contado desde la investigación. Videos completos en YouTube ↓». El enlace a YouTube solo se agrega desde la app del celular.

Conectado a vidIQ el 25 de noviembre de 2026 (cuenta 29274461912211840): puede publicar reels y leer estadísticas.

- Reels propios, con el mismo criterio de tono: casos en 60 segundos (otros casos, con el error que los delató), datos macabros (un detalle verificado, con su fuente en pantalla), expedientes abiertos (casos sin resolver y desaparecidos) y tragedias o catástrofes con su investigación.
- Ganchos: cada video de YouTube tiene uno o más reels que terminan invitando al video completo.
- Carruseles (decisión del creador del 28 de noviembre de 2026): cada video largo tiene además un carrusel de Instagram de 6 o 7 imágenes de 1080 × 1350 que termina invitando al video completo en YouTube; la última lámina lleva la miniatura del video, la primera de la prueba A/B (decisión del creador del 28 de noviembre de 2026). Se diseñan en el lienzo «Carruseles de Instagram · Draco Fénix» y van en 10_Shorts_y_Reels/carrusel_instagram con su texto sugerido. Mismo criterio de los videos: material de archivo con su rótulo, recreaciones con «RECREACIÓN» y casos con víctimas menores de edad sin detalles.
- Ningún reel ni carrusel se publica sin que el creador lo apruebe.
