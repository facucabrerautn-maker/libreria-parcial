# venta-simulada Specification

## Purpose

Composición y confirmación de una venta simulada en una sola vista —selector de cliente y de libro, agregado de renglones con precio congelado, control de duplicados, cálculos con dos decimales, bloqueo de confirmaciones inválidas y registro de la venta en `libreria.ventas`— sin dependencias externas, sin build y con apertura por doble clic sobre `file://`.

## Requirements

### Requirement: VEN-01
Selector de cliente alimentado con `store.clientes` y selector de libro con `store.libros`, ambos reflejando altas en vivo.
#### Scenario: RN-LIB-05, RN-CLI-03, 07 §Flujo 6 paso 1

### Requirement: VEN-02
Al agregar renglón: validar cliente existente, libro existente, cantidad entera mayor que cero (rechazar cero, negativos, decimales).
#### Scenario: RN-VEN-01, 07 §Flujo 6 paso 2

### Requirement: VEN-03
Si el `libroId` ya está en el borrador, incrementar la cantidad del renglón existente e informar el duplicado; nunca crear un segundo renglón con el mismo libro.
#### Scenario: RN-VEN-02, caso manual nº 4

### Requirement: VEN-04
Cada renglón guarda snapshot: `titulo`, `isbn`, `autores`, `editorial`, `precioUnitario` (precio del catálogo al agregar), `cantidad`, `subtotal`.
#### Scenario: DD-04, DD-09, RN-VEN-07

### Requirement: VEN-05
Antes de confirmar: cambiar cantidades y quitar renglones mientras la venta no está confirmada.
#### Scenario: RN-VEN-03

### Requirement: VEN-06
Subtotal = cantidad × precio unitario; total = suma de subtotales; todo con dos decimales.
#### Scenario: RN-VEN-04, US-022

### Requirement: VEN-07
Bloquear confirmación sin cliente, sin renglones o con cantidades inválidas; motivo explícito al usuario.
#### Scenario: RN-VEN-05, US-023

### Requirement: VEN-08
Al confirmar: crear `Venta` con `id` correlativo `VEN-###`, `fecha` ISO 8601 UTC, `clienteId`, `clienteNombre` (snapshot), `renglones`, `total`; persistir en `libreria.ventas`; limpiar formulario y borrador; mostrar mensaje con el id de la venta.
#### Scenario: RN-VEN-06, RN-HIS-03, 07 §Flujo 7

### Requirement: VEN-09
Botón "Confirmar venta" deshabilitado mientras se procesa (evitar doble venta por doble clic).
#### Scenario: 07 §Flujo 7, caso de error

### Requirement: VEN-10
Vista Ventas escribe su mensaje de estado inicial en la región `role="status"` de la sección.
#### Scenario: C-02, RN-ACC-02

### Requirement: VEN-11
Tabla de renglones dentro de contenedor con `overflow-x: auto`; panel de resumen de la venta.
#### Scenario: RN-ACC-04
