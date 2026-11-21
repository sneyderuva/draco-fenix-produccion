# Draco Fénix · Producción

App privada del canal [Draco Fénix](https://www.youtube.com/@Draco-fenix): tablero de avance, cronograma e información de cada video.

## Cómo funciona

- Los datos viven en `data/`: `canal.json`, `pasos.json` y un archivo por video en `data/videos/`.
- La sesión de Claude publica el avance con un cambio en este repositorio.
- El VPS descarga los cambios cada minuto; la app lee los archivos en cada consulta, así que se actualiza sin reiniciar.
- El acceso exige contraseña. La contraseña se define en el VPS, en `.env`, y nunca se sube al repositorio.

## Despliegue en el VPS (Linux con Docker)

1. Crear una llave de despliegue de solo lectura y registrarla en GitHub (Settings → Deploy keys del repositorio):

   ```bash
   ssh-keygen -t ed25519 -f ~/.ssh/draco_deploy -N ""
   cat ~/.ssh/draco_deploy.pub
   ```

2. Clonar y configurar:

   ```bash
   GIT_SSH_COMMAND="ssh -i ~/.ssh/draco_deploy" git clone git@github.com:sneyderuva/draco-fenix-produccion.git /opt/draco
   cd /opt/draco
   git config core.sshCommand "ssh -i ~/.ssh/draco_deploy"
   cp .env.example .env
   nano .env   # definir APP_PASSWORD (mínimo 8 caracteres)
   echo "SESSION_SECRET=$(openssl rand -hex 32)" >> .env   # y borrar la línea SESSION_SECRET vacía
   ```

3. Levantar la app y programar la actualización cada minuto:

   ```bash
   docker compose up -d --build
   (crontab -l 2>/dev/null; echo "* * * * * cd /opt/draco && git pull -q --ff-only") | crontab -
   ```

La app queda en `http://IP-DEL-VPS:3000`. Los cambios de datos se ven solos; si cambia el código (`server.js` o `public/`), hay que ejecutar de nuevo `docker compose up -d --build`.

**HTTPS:** sin HTTPS la contraseña viaja sin cifrar. Conviene poner la app detrás de un proxy con certificado (Caddy o Nginx) y entonces definir `COOKIE_SECURE=1`.

## Registrar avance

```bash
node scripts/avance.mjs 001-pozzetto 3 en_curso "Buscando fuentes de prensa de 1986"
node scripts/avance.mjs 001-pozzetto 3 hecho "Cronología con 14 fuentes" --bitacora "Investigación terminada"
git commit -am "Pozzetto: paso 3 hecho" && git push
```

Estados: `hecho`, `en_curso`, `espera` (falta una aprobación o tarea del creador) y `pendiente`.

## Prueba local

```bash
APP_PASSWORD=una-clave-larga SESSION_SECRET=$(openssl rand -hex 32) node server.js
```
