# AdmiX

Prepárate. Practica. Ingresa.

Aplicación de práctica y simulacros para exámenes de admisión universitaria, con énfasis en ingeniería.

## Qué incluye el MVP

- Bienvenida, perfil, cursos y temario
- Práctica con explicación inmediata y XP
- Simulacro cronometrado, navegación, marcas y resultados
- Estadísticas, logros, racha y niveles
- Guardado local (listo para sincronización futura)
- Modo oscuro / claro y recordatorios (arquitectura de notificaciones)

## Stack

Web app móvil (PWA) con React 19, TanStack Start, Tailwind CSS y persistencia local. Se eligió así para:

- Iterar rápido y verse nativa en Android (pantalla completa, botones grandes)
- Instalarse en el teléfono desde el navegador
- Empaquetarse luego como APK con Capacitor sin reescribir la lógica

## Desarrollo

```bash
npm install
npm run dev
```

La app queda en el puerto 8080.

```bash
npm run build
npm run typecheck
```

## Generar APK (Android)

La app es una PWA con servidor (Vercel), así que el camino más simple es PWABuilder:

1. Publica la app en Vercel y abre la URL en el navegador para comprobar que carga.
2. Entra a [pwabuilder.com](https://www.pwabuilder.com), pega la URL y pulsa **Start**.
3. Pulsa **Package for stores → Android → Generate package** y descarga el zip.
4. Dentro encontrarás el `.apk` (para instalar directo) y el `.aab` (para Google Play).

Para pruebas rápidas, también puedes abrir la URL en Chrome del celular y elegir **Instalar aplicación**.

## Próximas versiones

Cuentas, ranking, banco remoto de preguntas y panel de administración. El estado ya pasa por un adaptador de persistencia intercambiable (`src/lib/db/local.ts`).

## Abrir en Visual Studio Code

1. Descomprime el zip y abre la carpeta `admix` con **File → Open Folder**.
2. VS Code te sugerirá instalar las extensiones recomendadas (ESLint, Prettier, Tailwind): acepta.
3. Abre la terminal (`Ctrl + ñ`) y ejecuta:

```bash
npm install
npm run dev
```

4. Abre http://localhost:8080 en el navegador.

Requiere Node.js 22 o superior.

> No borres `.grok/app-env.json`: los scripts `dev` y `build` lo leen para dejar el login desactivado.

## Subir a producción (Vercel)

1. Crea un repositorio en GitHub y sube la carpeta (`git init`, `git add .`, `git commit`, `git push`).
2. En vercel.com → **Add New Project** → importa el repositorio. Vercel detecta la configuración sola.
3. **Deploy**. No necesitas variables de entorno mientras la app no use base de datos.
