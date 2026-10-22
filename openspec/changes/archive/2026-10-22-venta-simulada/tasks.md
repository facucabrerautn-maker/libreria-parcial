# Tasks

> Change `C-11` — `venta-simulada`. Composición y confirmación de la venta simulada (Ejercicio 5 — 13 pts).
> Implementa el cuerpo de `js/vistas/ventas.js` y añade reglas de estilo en `css/vistas.css`.
>
> Verificación: no hay test runner en el proyecto (prohibido por RN-ALC-01 y RN-ENT-01). Cada task indica cómo
> se comprueba a mano, con un comando de PowerShell o con la observación en el navegador.

## 1. Selectores de cliente y de libro, alimentados desde el store

- [x] 1.1 En `js/vistas/ventas.js`, renderizar un `<form>` con:
  - un `<select>` de cliente con `<label for="venta-cliente">Cliente</label>`, alimentado con
    `store.listarClientes()` (una `<option>` por cliente, `value` = `id`, texto = nombre);
  - un `<select>` de libro con `<label for="venta-libro">Libro</label>`, alimentado con
    `store.listarLibros()` (una `<option>` por libro, `value` = `id`, texto = título);
  - un `<input type="number" id="venta-cantidad" min="1" step="1" required>` con
    `<label for="venta-cantidad">Cantidad</label>`;
  - un `<button type="submit">Agregar renglón</button>`.
  Verificar que los tres controles existen y que sus `<option>` coinciden con los datos del seed
  (3 clientes, 6 libros).
- [x] 1.2 Al cambiar el select de cliente o de libro, actualizar el estado privado del borrador
  (`clienteId` y `libroId` candidato). Verificar que se lee el valor del `<select>` con `.value` y no con
  `innerHTML`.
- [x] 1.3 Escribir el mensaje de estado inicial en la región `.region-mensajes` de la sección al renderizar
  (p. ej. "Todavía no hay ventas registradas..."). Verificar con `Select-String` sobre el texto del mensaje.

## 2. Agregar renglón: validación, snapshot y tabla

- [x] 2.1 Interceptar el `submit` del formulario con `preventDefault`. Al enviar:
  - leer `clienteId`, `libroId` y `cantidad`;
  - validar que `cantidad` sea un entero mayor que cero (rechazar cero, negativos y decimales);
  - validar que el cliente y el libro existan en el store;
  - si hay errores, mostrarlos con `ui.mostrarErrores(campo, mensaje)` y no agregar renglón.
  Verificar con `Select-String -Path js\vistas\ventas.js -Pattern 'preventDefault'` y con pruebas en el
  navegador: cantidad 0, negativa, decimal, cliente sin seleccionar, libro inexistente.
- [x] 2.2 Si el `libroId` ya está en el borrador, incrementar la cantidad del renglón existente y mostrar un
  mensaje de duplicado; nunca crear un segundo renglón con el mismo `libroId` (RN-VEN-02). Verificar en el
  navegador agregando el mismo libro dos veces y comprobando que hay una sola fila con cantidad 2.
- [x] 2.3 Al agregar un renglón válido, construir el snapshot: `titulo`, `isbn`, `autores`, `editorial`,
  `precioUnitario` (leído de `store.obtenerLibro(libroId)`), `cantidad`, `subtotal =
  round2(cantidad × precioUnitario)`. Verificar que `precioUnitario` coincide con el precio del catálogo en ese
  momento.
- [x] 2.4 Renderizar la tabla de renglones con `<thead><th scope="col">` y `<tbody><td>`:
  columnas: Libro, ISBN, Autores, Editorial, Cantidad, Precio unitario, Subtotal, Acciones (quitar).
  Verificar con `Select-String` sobre `<th scope="col">` y `<td>`.
- [x] 2.5 Recalcular y mostrar el total de la venta (suma de subtotales) con dos decimales en el panel de
  resumen. Usar `ui.formatearMonto()`. Verificar que el total se actualiza al agregar, editar o quitar renglones.

## 3. Edición del borrador: cambiar cantidad y quitar renglones

- [x] 3.1 Cada renglón de la tabla expone un control para cambiar la cantidad (mientras la venta no está
  confirmada) y un botón para quitarlo. Verificar que existen ambos controles por fila.
- [x] 3.2 Al cambiar la cantidad, recalcular el subtotal de ese renglón y el total de la venta. Verificar en el
  navegador.
- [x] 3.3 Al quitar un renglón, eliminarlo del borrador y re-renderizar la tabla y el total. Verificar en el
  navegador.
- [x] 3.4 Verificar que no hay edición ni borrado de la venta **confirmada** (eso es C-12; en C-11 solo se
  edita el borrador antes de confirmar).

## 4. Confirmación de la venta

- [x] 4.1 Botón `<button id="venta-confirmar">Confirmar venta</button>` deshabilitado por defecto (sin cliente
  o sin renglones). Habilitarlo solo cuando el borrador sea válido (cliente seleccionado y al menos un renglón).
  Verificar que el botón comienza deshabilitado y se habilita tras agregar un renglón.
- [x] 4.2 Al confirmar, llamar a `validaciones.validarVenta(borrador, contexto)` y, si pasa, construir el
  objeto `Venta`:
  - `id`: correlativo `VEN-###` (usar `store.siguienteId('VEN')` o equivalente);
  - `fecha`: ISO 8601 UTC (`new Date().toISOString()`);
  - `clienteId`, `clienteNombre` (snapshot del nombre);
  - `renglones`: array del borrador;
  - `total`: suma de subtotales.
  Verificar la estructura del objeto con `console.log` o inspección del store.
- [x] 4.3 Llamar a `store.agregarVenta(venta)` y `storage.guardarVentas()`. Verificar que la venta aparece en
  `libreria.ventas` de `localStorage`.
- [x] 4.4 Limpiar el formulario y el borrador (cliente, libro, cantidad, tabla de renglones, total). Mostrar
  mensaje de resultado con el identificador (`VEN-001`) en la región de mensajes.
- [x] 4.5 Deshabilitar el botón "Confirmar venta" mientras se procesa (evitar doble venta por doble clic).
- [x] 4.6 Verificar que, tras la confirmación, el borrador está vacío y se puede armar una nueva venta desde
  cero.

## 5. Estilos de la vista Ventas (`css/vistas.css`)

- [x] 5.1 Añadir regla para envolver la tabla de renglones en un contenedor con `overflow-x: auto`
  (RN-ACC-04). Verificar con `Select-String -Path css\vistas.css -Pattern 'overflow-x'`.
- [x] 5.2 Añadir reglas para el panel de resumen de la venta (total destacado, dos decimales).
- [x] 5.3 Verificar que no hay `position: absolute` usado como maquetación, ni anchos fijos de layout en `px`,
  ni recursos remotos en `css/vistas.css`.

## 6. Verificación integral de alcance

- [x] 6.1 Confirmar que `js/vistas/ventas.js` no supera las 200 líneas y que tiene una sola responsabilidad
  (render y eventos de la vista Ventas). Verificar con
  `Get-Item js\vistas\ventas.js | Select-Object -ExpandProperty Length` o contando líneas.
- [x] 6.2 Confirmar que no hay `innerHTML` en `js/vistas/ventas.js` (datos de usuario solo con `textContent` y
  `value`). Verificar con `Select-String -Path js\vistas\ventas.js -Pattern 'innerHTML'` → sin coincidencias.
- [x] 6.3 Confirmar que no hay `fetch(`, `XMLHttpRequest` ni `https?://` en `js/vistas/ventas.js`.
- [x] 6.4 Abrir `index.html` con doble clic, navegar a `#/ventas` y verificar:
  - los selectores de cliente y libro muestran las opciones del seed;
  - se puede agregar un renglón, cambiar su cantidad y quitarlo;
  - el total se calcula con dos decimales;
  - el botón "Confirmar venta" se habilita solo con borrador válido;
  - al confirmar, aparece el mensaje con el `VEN-###` y el formulario se limpia;
  - la consola del navegador queda limpia (sin errores de CORS ni excepciones).
- [x] 6.5 Confirmar que `git status` muestra únicamente los archivos modificados de este change
  (`js/vistas/ventas.js`, `css/vistas.css`) y que no se tocó nada de `docs/`, `knowledge-base/` ni `openspec/`
  fuera de este change.

## Workflow follow-up

- Marcar `[x]` la entrada de C-11 en `CHANGES.md` una vez archivado el change.
- Archivar el change con `/opsx:archive venta-simulada`.
- Recordar el paso siguiente del roadmap: **C-12 `historial-inmutable`** (depende de C-11) completa el
  Ejercicio 5 con el listado de ventas y el detalle de renglones leídos del snapshot.

---
> Resultado **observado** de cada punto marcado. Ningún punto se da por aprobado sin haber ejecutado la
> comprobación.
