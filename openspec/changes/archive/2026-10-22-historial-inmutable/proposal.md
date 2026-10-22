# Proposal

## Why

La vista Historial es actualmente un **stub** (solo muestra un mensaje de estado inicial; ver `js/vistas/historial.js`). El Ejercicio 5 de la consigna (7 pts de "Confirmación e historial inmutable") exige que el historial de ventas sea consultable, que se puedan consultar los renglones de cada venta (leídos del snapshot, no del catálogo), y que las ventas confirmadas sean inmutables (sin edición ni borrado desde la interfaz).

Este change es **C-12 `historial-inmutable`**, el siguiente en el camino crítico tras C-11 (sus dependencias están resueltas: C-04, C-05, C-07, C-11). Sin él no puede avanzar C-13 `persistencia-integrada` ni cerrar el camino crítico hacia C-14 y C-15.

## What Changes

- **`js/vistas/historial.js`**: implementa el render completo de la vista Historial:
  - Tabla con identificador, fecha, cliente y total de cada venta confirmada, ordenada de más reciente a más antigua (RN-HIS-01, SU-03).
  - Cada fila ofrece una acción para consultar los renglones de esa venta.
  - Detalle de venta: renglones con libro, cantidad, precio unitario y subtotal leídos **del propio registro de la venta** (snapshot), nunca del catálogo (RN-VEN-07, RN-HIS-02).
  - Inmutabilidad: la vista no ofrece acciones de edición ni de borrado, y ninguna función elimina registros de `libreria.ventas` (RN-HIS-02, US-027).
  - Historial alimentado por `store.listarVentas()` (datos locales), nunca por un array paralelo en memoria (US-025 CA-3).
  - Estado vacío: mensaje propio con enlace a la vista Ventas (07 §Flujo 8).
  - Refresco automático cuando cambia el store (`alCambiarElStore`).

- **`css/vistas.css`**: los estilos ya están predefinidos (`.vista-historial__listado`, `.vista-historial__detalle`, `.tabla-historial`), no se requieren cambios.

### Fuera de alcance (explícito)

- Persistencia end-to-end y comprobación de precio histórico → **C-13 `persistencia-integrada`**.
- Contenido del `README.md` → **C-14 `readme-entrega`**.
- Ejecución de los 8 casos manuales → **C-15 `casos-manuales-verificacion`**.

## Capabilities

### New Capabilities

- `historial-inmutable`: historial consultable de ventas confirmadas con detalle de renglones leídos del snapshot, ordenado de más reciente a más antigua, sin edición ni borrado desde la interfaz.

### Modified Capabilities

Ninguna. `openspec/specs/` ya contiene `estructura-navegacion` (C-01/C-02) y `venta-simulada` (C-11); este change añade la capacidad `historial-inmutable` sin tocar las previas.

## Impact

- **Archivos modificados**: `js/vistas/historial.js` (de stub a implementación completa).
- **Sin archivos nuevos** en la entrega funcional.
- **Sin dependencias**: no se agregan `package.json`, `node_modules`, `package-lock.json`, `dist/`, bundler, transpilador, framework, librería, CDN ni fuente remota (RN-ALC-01, RN-ENT-01).
- **Sin red ni backend**: no hay API, base de datos, servidor, login ni variables de entorno (RN-ALC-02, RN-ALC-03). No se usa `fetch` ni ninguna API de red.
- **Sin cambios de contrato de datos**: el modelo `Venta` y `Renglón` ya está definido en C-04 (`js/datos.js`) y las claves `libreria.*` en C-07 (`js/storage.js`). C-12 solo consume esos contratos.

## Open Questions

Ninguna que bloquee la implementación. Las decisiones de diseño que afectan a C-12 ya están resueltas:

- **P-05**: fecha ISO 8601 UTC al guardar, mostrada en formato local `dd/mm/aaaa`; historial ordenado de más reciente a más antiguo (SU-04, DD-10).
- **P-06**: catálogo y listados ordenados por título ascendente (no aplica al historial, que se ordena por fecha).
- **P-09**: no hay huérfanos porque no se borra nada desde la interfaz; el historial se renderiza desde el snapshot de la venta (DD-09).
- **IN-07**: en ventas, la ausencia de edición y borrado es obligatoria (no solo una decisión de alcance).
