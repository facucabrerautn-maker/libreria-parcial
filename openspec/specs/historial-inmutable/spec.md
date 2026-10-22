# historial-inmutable Specification

## Purpose

Historial consultable de ventas confirmadas con detalle de renglones leídos del snapshot, ordenado de más reciente a más antigua, sin edición ni borrado desde la interfaz.

## Requirements

### Requirement: HIS-01
Tabla con identificador, fecha, cliente y total de cada venta confirmada, ordenada de más reciente a más antigua.
#### Scenario: RN-HIS-01, SU-03, US-025 CA-1

### Requirement: HIS-02
Cada fila ofrece una acción para consultar los renglones de esa venta.
#### Scenario: RN-HIS-01, US-025 CA-2

### Requirement: HIS-03
Detalle de venta: renglones con libro, cantidad, precio unitario y subtotal leídos del propio registro de la venta (snapshot), nunca del catálogo.
#### Scenario: RN-VEN-07, RN-HIS-02, US-026

### Requirement: HIS-04
Inmutabilidad: no hay acciones de edición ni de borrado desde la interfaz; ninguna función elimina registros de `libreria.ventas`.
#### Scenario: RN-HIS-02, US-027, RN-EX-04

### Requirement: HIS-05
Historial alimentado por `store.listarVentas()` (datos locales), nunca por un array paralelo en memoria.
#### Scenario: US-025 CA-3

### Requirement: HIS-06
Estado vacío: mensaje propio con enlace a la vista Ventas.
#### Scenario: 07 §Flujo 8, US-004 CA-1

### Requirement: HIS-07
Mensaje de estado inicial escrito en la región `role="status"` de la sección al renderizar.
#### Scenario: C-02, RN-ACC-02

### Requirement: HIS-08
Refresco automático cuando cambia el store (`alCambiarElStore`).
#### Scenario: RN-HIS-01, C-07
