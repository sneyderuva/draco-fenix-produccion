# Draco Fénix · Producción

App privada del canal [Draco Fénix](https://www.youtube.com/@Draco-fenix): tablero de avance, cronograma e información de cada video.

## Cómo funciona

- Los datos viven en `data/`: `canal.json`, `pasos.json` y un archivo por video en `data/videos/`.
- La sesión de Claude publica el avance con un cambio en este repositorio.
- GitHub Actions copia cada cambio al VPS; la app lee los archivos en cada consulta, así que los datos se actualizan solos.
- El acceso exige contraseña. La contraseña se define en el VPS, en `.env`, y nunca se sube al repositorio.

## Despliegue automático con GitHub Actions

El flujo `.github/workflows/desplegar.yml` se ejecuta a mano desde la pestaña Actions (se puede activar para que corra con cada cambio en `main`): copia el código y los datos al VPS por SSH y levanta la app con Docker. No hace falta clonar el repositorio en el VPS ni programar tareas.

GitHub Actions no aloja la app; solo la instala y actualiza en el VPS, que es donde queda corriendo.

### Preparación, una sola vez

1. En el VPS deben estar instalados Docker (con `docker compose`) y `rsync`, y el usuario de despliegue debe poder ejecutar Docker.
2. Crear una llave solo para el despliegue y autorizarla en el VPS. Desde cualquier computador:

   ```bash
   ssh-keygen -t ed25519 -f draco_actions -N ""
   ssh-copy-id -i draco_actions.pub usuario@IP-DEL-VPS
   ```

3. En GitHub, en Settings → Secrets and variables → Actions del repositorio, crear estos secretos:

   | Secreto | Valor |
   | --- | --- |
   | `VPS_HOST` | Dirección IP o dominio del VPS |
   | `VPS_USER` | Usuario de SSH |
   | `VPS_SSH_KEY` | Contenido completo del archivo `draco_actions` (la llave privada) |
   | `APP_PASSWORD` | Contraseña de la app, mínimo 8 caracteres, sin comillas ni el signo `$` |
   | `VPS_PORT` | Opcional; puerto de SSH si no es el 22 |

4. Ejecutar el flujo: pestaña Actions → "Desplegar en el VPS" → Run workflow.

La app queda en `http://IP-DEL-VPS:3000`, en la carpeta `~/draco` del usuario. La carpeta y el puerto se cambian con las variables `VPS_RUTA` y `APP_PUERTO` del repositorio.

**HTTPS:** sin HTTPS la contraseña viaja sin cifrar. Conviene poner la app detrás de un proxy con certificado (Caddy o Nginx).

## Registrar avance

```bash
node scripts/avance.mjs 001-pozzetto 3 en_curso "Buscando fuentes de prensa de 1986"
node scripts/avance.mjs 001-pozzetto 3 hecho "Cronología con 14 fuentes" --bitacora "Investigación terminada"
git commit -am "Pozzetto: paso 3 hecho" && git push
```

Estados: `hecho`, `en_curso`, `espera` (falta una aprobación o tarea del creador) y `pendiente`.

## Página pública en GitHub Pages

El flujo `.github/workflows/pages.yml` genera una versión estática del tablero (`node scripts/construir.mjs`) y la publica con cada cambio en `main`. Requiere que el repositorio sea público y que en Settings → Pages la fuente sea "GitHub Actions".

Esa página no tiene contraseña: cualquiera con el enlace ve los casos en producción y el cronograma.

## Uso local en Windows

Doble clic en `iniciar.bat`. Abre la app en `http://localhost:3000`, sin contraseña y visible solo desde ese computador. Usa Node.js si está instalado y, si no, Docker.

El modo local (`LOCAL=1`) desactiva la contraseña: no debe usarse en un servidor público.
