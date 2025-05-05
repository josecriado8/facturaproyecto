# FacturaProyecto

Aplicación para la generación de facturas en formato PDF, desarrollada con React, TypeScript y jsPDF. El proyecto cuenta con una versión web y una versión de escritorio basada en Electron.

## Características

- Generación de facturas personalizadas en PDF usando [jsPDF](https://github.com/parallax/jsPDF).
- Interfaz moderna desarrollada con [React](https://react.dev/) y [TypeScript](https://www.typescriptlang.org/).
- Empaquetado y desarrollo rápido con [Vite](https://vitejs.dev/).
- Gestión de dependencias y scripts con [Bun](https://bun.sh/).
- Versión web y versión de escritorio (Electron).

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/facturaproyecto.git
   cd facturaproyecto
   ```

2. Instala las dependencias:
   ```bash
   bun install
   ```

## Uso en desarrollo (Web)

```bash
bun run dev
```

Accede a la aplicación en [http://localhost:5173](http://localhost:5173).

## Compilación para producción (Web)

```bash
bun run build
```

## Versión de escritorio (Electron)

1. Instala las dependencias de Electron:
   ```bash
   cd electron
   bun install
   ```

2. Para ejecutar Electron en modo desarrollo:
   ```bash
   bun run electron
   ```

3. Para generar el ejecutable de escritorio:
   ```bash
   bun run dist
   ```
   El ejecutable estará disponible en la carpeta `dist/win-unpacked`.

## Tecnologías principales

- React + TypeScript
- Vite
- Bun
- jsPDF
- Electron

## Licencia

MIT
