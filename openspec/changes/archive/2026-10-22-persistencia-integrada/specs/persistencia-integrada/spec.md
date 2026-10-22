# Spec (delta)

**Change**: C-13 `persistencia-integrada`  
**Capability**: `persistencia-integrada`  
**Depende de**: C-07, C-09, C-10, C-11, C-12 (todas completadas)  
**Rúbrica**: Ejercicio 6 — Persistencia = 4 pts  

Este spec es un **delta** de verificación. No define nuevos módulos ni modifica los existentes; especifica los comportamientos de persistencia que deben quedar verificados end-to-end.

## 1. Comportamientos a verificar

| ID | Requisito | Regla / Fuente |
|----|-----------|----------------|
| PER-01 | Toda mutación (alta de libro, alta de cliente, confirmación de venta) pasa por `storage.guardar*` y queda reflejada en `libreria.libros`, `libreria.clientes` y `libreria.ventas` | RN-PER-01 |
| PER-02 | Recarga después de altas y de una venta: se recuperan los registros guardados sin duplicar ejemplos ni ventas | RN-PER-02, caso manual nº 7 |
| PER-03 | Precio histórico: modificar únicamente el `precio` de un libro en `libreria.libros` y recargar → la venta conserva `precioUnitario`, subtotales y total | RN-VEN-07, caso manual nº 6 |
| PER-04 | Las 6 claves `libreria.*` están pobladas y con contenido coherente con el modelo de `04_modelo_de_datos.md §Estructura persistida en localStorage` | DD-03, DD-07 |
| PER-05 | Avisos al usuario: persistencia no disponible, cuota excedida al escribir y recuperación ante JSON corrupto | 07 §Flujo 1, P-11 |
| PER-06 | Límites documentados: dependencia del navegador, del perfil y de la ubicación de apertura; ausencia de sincronización entre usuarios | RN-PER-03, RN-ALC-04 |

## 2. Contratos consumidos (ya implementados en cambios previos)

| Contrato | Archivo | Definido en |
|----------|---------|-------------|
| `storage.guardarLibros(libros)` | `js/storage.js` | C-07 |
| `storage.guardarClientes(clientes)` | `js/storage.js` | C-07 |
| `storage.guardarVentas(ventas)` | `js/storage.js` | C-07 |
| `storage.guardarTodo()` | `js/storage.js` | C-07 |
| `storage.leerTodo()` | `js/storage.js` | C-07 |
| `storage.hidratar()` | `js/storage.js` | C-07 |
| `storage.disponible` | `js/storage.js` | C-07 |
| `datos.agregarLibro(libro)` | `js/datos.js` | C-04 |
| `datos.agregarCliente(cliente)` | `js/datos.js` | C-04 |
| `datos.agregarVenta(venta)` | `js/datos.js` | C-04 |
| `datos.listarLibros()` | `js/datos.js` | C-04 |
| `datos.listarClientes()` | `js/datos.js` | C-04 |
| `datos.listarVentas()` | `js/datos.js` | C-04 |

## 3. Escenarios de verificación

### PER-01 — Traza de escritura única
- Alta de libro → `libreria.libros` se actualiza con el nuevo libro.
- Alta de cliente → `libreria.clientes` se actualiza con el nuevo cliente.
- Confirmación de venta → `libreria.ventas` se actualiza con la nueva venta (con renglones y precios congelados).

### PER-02 — Recarga sin duplicados
- Primera apertura: el seed se escribe en las claves que faltan.
- Recarga posterior: las claves ya existen, no se re-siembra; no hay duplicados de ejemplos ni de ventas.

### PER-03 — Integridad del precio histórico (caso manual nº 6)
1. Confirmar una venta (p. ej. 2 × LIB-001 a 1500 + 1 × LIB-002 a 2000 = 5000).
2. Modificar únicamente el `precio` de LIB-001 en `libreria.libros` (desde DevTools → Application → Local Storage).
3. No tocar `libreria.ventas`.
4. Recargar la página.
5. Consultar el detalle de la venta anterior: precio unitario, subtotales y total conservan los valores confirmados.

### PER-04 — Claves `libreria.*`
- Seis claves existen: `libreria.libros`, `libreria.clientes`, `libreria.ventas`, `libreria.editoriales`, `libreria.generos`, `libreria.autores`.
- Cada valor es un array de objetos en JSON con la estructura del modelo.

### PER-05 — Avisos al usuario
- Persistencia no disponible → aviso en pantalla.
- Cuota excedida al escribir → aviso de que los cambios quedan solo en esta sesión.
- JSON corrupto en una clave → se descarta esa colección, se vuelve a sembrar, se informa en consola sin romper el arranque.

## 4. Out of scope

- Implementar nuevas escrituras (ya existen desde C-07 a C-12).
- Contenido del README → C-14.
- Ejecución de los 8 casos manuales → C-15.
