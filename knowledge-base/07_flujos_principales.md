# Flujos Principales

> **Fuente**: `docs/consigna-extraida.txt` — Ejercicios 1 a 6.
> Cada flujo documenta el recorrido extremo a extremo entre componentes del frontend. No hay API ni base de datos: toda la persistencia pasa por la Web Storage API.

## Componentes implicados

| Componente | Archivo previsto | Responsabilidad |
|------------|------------------|-----------------|
| `app.js` | `js/app.js` | Bootstrap: siembra inicial, resolución de ruta por hash, montaje de la vista activa |
| `store` | `js/datos.js` | Estado en memoria: colecciones de libros, clientes, ventas, editoriales, géneros, autores |
| `storage` | `js/storage.js` | Lectura y escritura en `localStorage`; siembra condicional |
| `validaciones` | `js/validaciones.js` | Funciones puras que implementan las reglas `RN-*` de validación |
| `ui` | `js/ui.js` | Helpers de DOM: creación de elementos, texto seguro, mensajes, foco |
| Módulos de vista | `js/vistas/*.js` | Render y eventos de Catálogo, Libros, Clientes, Ventas e Historial |

---

## Flujo 1: Arranque de la aplicación y siembra inicial

**Disparador**: el usuario abre `index.html` (doble clic) o recarga la página.
**Actor**: cualquier persona / el docente evaluador.

**Pasos**:
1. `app.js` se ejecuta al cargar el documento (módulo ES con `defer` implícito).
2. `storage.leerTodo()` consulta las claves `libreria.*` de `localStorage`.
3. Si la clave de una colección **no existe**, `storage` escribe el seed de esa colección. Si existe, se respeta el contenido guardado y **no** se escribe nada.
4. `store` hidrata las colecciones en memoria desde lo leído.
5. `app.js` resuelve `location.hash`; si está vacío, reemplaza el hash por `#/catalogo`.
6. Se renderiza la vista activa y se marca el enlace de navegación correspondiente.

```
Usuario → index.html → app.js → storage → localStorage
                       │         │             │
                       │         └─ seed ──────┘  (solo si la clave no existe)
                       ├─ store.hidratar()
                       └─ render(vista) ←─── ui
```

**Casos de error**:
- `localStorage` no disponible (modo privado restrictivo, cookies bloqueadas) → el store funciona en memoria, se muestra un aviso de que la persistencia no está disponible y el README ya advierte este límite.
- JSON corrupto en una clave → se detecta al parsear, se descarta esa colección, se vuelve a sembrar y se informa en consola sin romper el arranque.

---

## Flujo 2: Navegación entre vistas

**Disparador**: clic en un enlace de la barra de navegación, o foco + `Enter` sobre el enlace.
**Actor**: cualquier persona.

**Pasos**:
1. El usuario activa un enlace `<a href="#/clientes">Clientes</a>`.
2. El navegador cambia el hash; no hay recarga de página.
3. `app.js` escucha `hashchange`, resuelve el nombre de la vista y renderiza su módulo.
4. La vista anterior se desmonta (se vacía su `<section>`); los listeners se re-registran junto con el render.
5. El foco se mueve al título de la vista o a `main`, y la vista activa se marca con `aria-current="page"`.

**Casos de error**:
- Hash desconocido → se redirige a `#/catalogo` con un aviso, sin pantalla en blanco.
- Navegación con teclado → el enlace conserva foco visible y el orden de tabulación no se rompe.

---

## Flujo 3: Búsqueda en el catálogo

**Disparador**: se escribe en el campo "Buscar por título" y se envía el formulario (o se filtra en vivo).
**Actor**: el operador.

**Pasos**:
1. El evento `submit` del buscador se intercepta con `preventDefault`; también hay escucha en `input` para respuesta inmediata.
2. `ui` toma el valor del campo y aplica `trim()`.
3. Si el valor resultante es vacío → se renderiza el **catálogo completo** (RN-CAT-03).
4. Si no → se normaliza a minúsculas y se filtran los libros cuyo título normalizado **incluye** el texto (coincidencia parcial, RN-CAT-02).
5. Se re-renderiza la grilla de libros con los resultados.
6. Si el array de resultados está vacío → se muestra el mensaje "No se encontraron libros para «…»" (RN-CAT-04), distinto del mensaje de catálogo vacío.

```
Operador → input[buscar] → ui.trim() → vacía? ── sí → render(catálogo completo)
                                        └── no → filtro parcial sin mayúsculas → render(resultados)
                                                                                     └── 0 resultados → mensaje
```

**Casos de error**:
- Búsqueda con mayúsculas distintas ("FARO" vs. "faro de las salinas") → coincide.
- Búsqueda solo con espacios → se trata como vacía → catálogo completo.
- Búsqueda sin coincidencias → mensaje explícito, sin lista vacía sin explicación.

---

## Flujo 4: Alta de libro

**Disparador**: envío del formulario "Registrar libro".
**Actor**: el operador.

**Pasos**:
1. `submit` → `preventDefault`.
2. Se leen los valores del formulario (título, ISBN, precio, editorial, género, autores).
3. `validaciones.validarLibro(datos, contexto)` evalúa **todas** las reglas de `RN-LIB-03` y devuelve una lista de errores por campo.
4. Si hay errores → se limpian los mensajes previos y se muestran junto al campo correspondiente, en texto; **no** se escribe nada (RN-EX-04).
5. Si no hay errores → se construye el `Libro` con `id` nuevo, `isbnNorm` calculado y `generoId = null` si se eligió «Sin clasificar».
6. `store.agregarLibro(libro)` agrega al array en memoria.
7. `storage.guardarLibros()` persiste en `libreria.libros`.
8. `ui` muestra el mensaje de resultado, limpia el formulario y dispara el refresco de las vistas dependientes (listado de Libros, catálogo, selector de libros de Ventas) **sin recargar la página** (RN-LIB-05).

```
Operador → form[libro] → preventDefault → validarLibro()
                                          ├── errores → mostrar por campo → FIN (nada persistido)
                                          └── ok → store.agregar → storage.guardar → refrescar listas → mensaje
```

**Casos de error**:
- ISBN ya existente (con o sin guiones/espacios) → se rechaza con mensaje en el campo ISBN.
- Precio no numérico, cero o negativo → se rechaza.
- Sin autores seleccionados → se rechaza.
- Editorial o género que no existen en los datos locales → se rechaza.
- ISBN vacío o título vacío → se rechaza.

---

## Flujo 5: Alta de cliente

**Disparador**: envío del formulario "Registrar cliente".
**Actor**: el operador.

**Pasos**:
1. `submit` → `preventDefault`.
2. Se leen nombre completo y email.
3. `validaciones.validarCliente(datos, contexto)` aplica `RN-CLI-02`: no vacíos, formato de email válido, unicidad de `emailNorm` (sin espacios exteriores, sin distinguir mayúsculas).
4. Con errores → se muestran junto al campo y no se escribe nada.
5. Sin errores → se crea el `Cliente` con `id` nuevo y `emailNorm` calculado; se persiste en `libreria.clientes`.
6. Se refrescan el listado de Clientes y el selector de cliente de Ventas, se limpia el formulario y se muestra el mensaje de resultado.

**Casos de error**:
- Email inválido (`"correo@@x"`, `"correo"` sin `@`) → se rechaza.
- Email existente escrito en mayúsculas (`"ANA.FERRER@EXAMPLE.COM"`) → se rechaza por duplicado.
- Nombre vacío → se rechaza.

---

## Flujo 6: Composición de la venta

**Disparador**: en la vista Ventas, selección de cliente, selección de libro y cantidad, y clic en "Agregar renglón".
**Actor**: el operador.

**Pasos**:
1. El selector de cliente se alimenta de `libreria.clientes`; el de libros, de `libreria.libros`.
2. Al agregar un renglón se valida `RN-VEN-01`: cliente existente, libro existente, cantidad **entera** mayor que cero (se rechazan cero, negativos y decimales).
3. Se comprueba `RN-VEN-02`: si el `libroId` ya está en el borrador, se incrementa la cantidad del renglón existente y se informa, **o** se rechaza con un mensaje de duplicado — nunca se crea un segundo renglón del mismo libro.
4. El renglón se agrega al borrador de venta con el **precio unitario leído del catálogo en ese momento** y sus datos descriptivos (título, ISBN, autores, editorial).
5. Se recalculan subtotales y total con dos decimales (`RN-VEN-04`) y se re-renderiza la tabla de renglones.
6. Mientras la venta no esté confirmada, cada renglón expone controles para cambiar la cantidad y para quitarlo (`RN-VEN-03`).

**Casos de error**:
- Sin cliente seleccionado → no se permite agregar renglón.
- Cantidad cero, negativa o decimal → se rechaza con mensaje.
- Libro repetido → se informa el duplicado; el borrador conserva un solo renglón para ese libro.

---

## Flujo 7: Confirmación de la venta

**Disparador**: clic en "Confirmar venta".
**Actor**: el operador.

**Pasos**:
1. Se evalúan las condiciones de bloqueo de `RN-VEN-05`: sin cliente, sin renglones o con cantidades inválidas → la confirmación no procede y se informa el motivo.
2. Con los datos válidos se arma el objeto `Venta`: `id` correlativo (`VEN-001`, `VEN-002`, …), `fecha`, `clienteId`, `clienteNombre` (snapshot), `renglones` y `total`.
3. **Cada renglón conserva su `precioUnitario` como valor histórico** (`RN-VEN-07`). En este punto el precio queda congelado en el registro.
4. La venta se agrega al store y se persiste en `libreria.ventas`.
5. Se limpia el formulario y el borrador para una nueva venta, y se muestra el mensaje de resultado con el identificador de la venta (`RN-HIS-03`).
6. El historial se refresca para incluir la venta recién confirmada.

```
Operador → "Confirmar venta" → ¿válida?
                              ├── no → mensaje de bloqueo → FIN (no se persiste nada)
                              └── sí → construir Venta (renglones con precio congelado)
                                       → store.agregar → storage.guardar
                                       → limpiar formulario → refrescar historial → mensaje
```

**Casos de error**:
- Doble clic rápido en "Confirmar" → se deshabilita el botón mientras se procesa, para no crear dos ventas.
- Falla de escritura en `localStorage` (cuota excedida) → se avisa que la venta no quedó guardada de forma persistente.

---

## Flujo 8: Consulta del historial y detalle de una venta

**Disparador**: visita a `#/historial` o clic en "Ver detalle" de una venta.
**Actor**: el operador o el docente evaluador.

**Pasos**:
1. El módulo de Historial lee `store.ventas` y renderiza una tabla con **identificador, fecha, cliente y total** (`RN-HIS-01`).
2. Cada fila ofrece una acción para consultar los renglones.
3. El detalle muestra, por renglón, **libro, cantidad, precio unitario y subtotal**, leídos **del propio registro de la venta**, nunca del catálogo (`RN-VEN-07`).
4. No se ofrecen acciones de edición ni de borrado (`RN-HIS-02`).
5. Si no hay ventas, se muestra el mensaje de lista vacía.

**Casos de error**:
- Historial vacío → mensaje de lista vacía con enlace a la vista de Ventas.
- Renglón cuyo libro fue renombrado o su precio cambiado en el catálogo → **no afecta** lo que muestra el historial.

---

## Flujo 9: Comprobación guiada del precio histórico (caso manual nº 6)

**Disparador**: procedimiento guiado por el docente sobre una **copia del proyecto** y con datos de prueba.
**Actor**: el docente evaluador.

**Pasos**:
1. El docente abre la copia del proyecto, confirma una venta y **anota sus importes** (por ejemplo 2 × 1500 + 1 × 2000 = 5000).
2. Con las herramientas de almacenamiento del navegador (DevTools → Application → Local Storage), abre la clave del catálogo y **modifica únicamente el `precio` del libro** usado en esa venta.
3. **No** modifica ni borra las ventas guardadas.
4. Recarga la página.
5. El arranque detecta que las claves ya existen: **no** vuelve a sembrar el seed, por lo que el precio modificado **persiste** en el catálogo.
6. El docente consulta el detalle de la venta anterior: **precio unitario, subtotales y total conservan los valores confirmados**.

```
Docente → confirma venta (importes anotados)
        → edita precio del libro en localStorage (no toca ventas)
        → recarga → la app NO re-siembra (la clave ya existe)
        → abre detalle de la venta → precioUnitario/subtotal/total = valores confirmados ✔
```

**Casos de error**:
- Si la app re-sembrara el seed en cada arranque, el precio modificado se perdería y la comprobación no sería concluyente → por eso la siembra es **condicional a que la clave no exista** (RN-PER-02) y el README documenta las claves y la estructura (RN-ENT-03).
- La operación se realiza sobre una **copia**: si se hiciera sobre la entrega original, el catálogo guardado quedaría con un precio alterado.

---

## Flujo 10: Recarga y verificación de persistencia (caso manual nº 7)

**Disparador**: recarga de la página después de altas y de una venta.
**Actor**: el operador o el docente.

**Pasos**:
1. El arranque lee las claves de `localStorage`.
2. Las colecciones se hidratan con el contenido guardado (libros, clientes y ventas).
3. Como las claves existen, **no** se escribe el seed → no se duplican ni ejemplos ni ventas.
4. Catálogo, listados e historial reflejan el estado previo.
5. La venta guardada mantiene sus renglones y sus importes.

**Casos de error**:
- Datos guardados con una versión de estructura distinta → se detecta y se informa; la app no debe fallar en pantalla en blanco.

---

## Flujo 11: Verificación de navegación por teclado y adaptabilidad (caso manual nº 8)

**Disparador**: recorrido manual con teclado y cambio del ancho del viewport a 320 px y 1280 px.
**Actor**: el docente evaluador.

**Pasos**:
1. Se recorre la interfaz con `Tab` / `Shift+Tab` / `Enter` / `Espacio` desde la barra de navegación hasta el final de cada vista.
2. En cada control se verifica que el **foco es visible**.
3. Se activan los enlaces de navegación con el teclado y se comprueba que la vista cambia.
4. Se redimensiona a 320 px: se comprueba que **no aparece desplazamiento horizontal de la página** y que textos y controles siguen siendo legibles.
5. Se redimensiona a 1280 px: se comprueba la legibilidad y que la tabla ancha (si la hay) se desplaza **dentro de su propio contenedor**.

**Casos de error**:
- Tabla que desborda el viewport a 320 px → se envuelve en un contenedor con `overflow-x: auto` (RN-ACC-04).
- Mensaje de error communicator solo con color → se Incorpone texto (RN-ACC-05).
