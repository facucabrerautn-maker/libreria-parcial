# Tasks

> Change `C-13` — `persistencia-integrada`. Verificación end-to-end de la persistencia y de la integridad histórica (Ejercicio 6 — 4 pts).
>
> Verificación: no hay test runner en el proyecto (prohibido por RN-ALC-01 y RN-ENT-01). Cada task indica cómo se comprueba a mano, con un comando de PowerShell o con la observación en el navegador.

## 1. Traza de escritura única

- [ ] 1.1 Alta de libro: registrar un libro nuevo desde la vista Libros y verificar que aparece en `libreria.libros` de `localStorage` (DevTools → Application → Local Storage).
  Verificar que el libro tiene `id`, `isbnNorm`, `precio`, `editorialId`, `generoId`, `autorIds`.
- [ ] 1.2 Alta de cliente: registrar un cliente nuevo desde la vista Clientes y verificar que aparece en `libreria.clientes`.
  Verificar que tiene `id`, `nombre`, `email`, `emailNorm`.
- [ ] 1.3 Confirmación de venta: armar y confirmar una venta desde la vista Ventas y verificar que aparece en `libreria.ventas` con `id`, `fecha`, `clienteId`, `clienteNombre`, `renglones` y `total`.
  Verificar que cada renglón tiene `libroId`, `titulo`, `isbn`, `autores`, `editorial`, `cantidad`, `precioUnitario`, `subtotal`.
- [x] 1.4 Verificar que `storage.guardarLibros()`, `storage.guardarClientes()` y `storage.guardarVentas()` se invocan en cada mutación (inspección de código en `js/datos.js`).

## 2. Recarga sin duplicados

- [ ] 2.1 Primera apertura: verificar que las 6 claves `libreria.*` se crean con el seed (6 libros, 3 clientes, 0 ventas, 2 editoriales, 2 géneros, 3 autores).
- [ ] 2.2 Recarga posterior: recargar la página y verificar que no hay duplicados (siguen siendo 6 libros, 3 clientes, 0 ventas si no se confirmaron ventas).
- [ ] 2.3 Después de altas y de una venta: recargar y verificar que los registros guardados se recuperan sin duplicar ejemplos ni ventas (caso manual nº 7).

## 3. Integridad del precio histórico (caso manual nº 6)

- [ ] 3.1 Confirmar una venta (p. ej. 2 × LIB-001 a 1500 + 1 × LIB-002 a 2000 = 5000).
- [ ] 3.2 Modificar únicamente el `precio` de LIB-001 en `libreria.libros` desde DevTools (no tocar `libreria.ventas`).
- [ ] 3.3 Recargar la página y consultar el detalle de la venta anterior en el Historial.
  Verificar que `precioUnitario`, subtotales y total conservan los valores confirmados (RN-VEN-07).
- [ ] 3.4 Verificar que el catálogo sí muestra el precio modificado (la siembra condicional respetó el cambio).

## 4. Claves `libreria.*` y estructura

- [ ] 4.1 Confirmar que las 6 claves existen: `libreria.libros`, `libreria.clientes`, `libreria.ventas`, `libreria.editoriales`, `libreria.generos`, `libreria.autores`.
- [ ] 4.2 Verificar que cada valor es un array de objetos en JSON con la estructura del modelo (ver `04_modelo_de_datos.md §Estructura persistida en localStorage`).

## 5. Avisos al usuario

- [ ] 5.1 Persistencia no disponible: verificar que la app funciona en memoria y avisa cuando `localStorage` no está disponible.
- [ ] 5.2 Cuota excedida: verificar que si la escritura falla, se muestra un aviso en pantalla y la app sigue funcionando en memoria.
- [ ] 5.3 JSON corrupto: verificar que si una clave de `localStorage` tiene JSON corrupto, se descarta esa colección, se vuelve a sembrar y se informa en consola sin romper el arranque.

## 6. Verificación integral de alcance

- [x] 6.1 Confirmar que no hay archivos nuevos ni modificados en la entrega funcional (C-13 es de verificación).
- [x] 6.2 Confirmar que `git status` no muestra cambios en `js/`, `css/` ni `index.html` fuera de la carpeta de planificación de este change.

## Workflow follow-up

- Marcar `[x]` la entrada de C-13 en `CHANGES.md` una vez archivado el change.
- Archivar el change con `/opsx:archive persistencia-integrada`.
- Recordar el paso siguiente del roadmap: **C-14 `readme-entrega`** (depende de C-04, C-12, C-13) completa la documentación de la entrega.

---
> Resultado **observado** de cada punto marcado. Ningún punto se da por aprobado sin haber ejecutado la comprobación.
