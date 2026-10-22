# Modelo de Datos

> **Fuente**: `docs/consigna-extraida.txt` — Ejercicio 3 ("Datos locales, catálogo y filtro") y Ejercicio 5 ("Venta simulada e historial").
> La consigna define el modelo en su forma mínima: *"Se representan libros, editoriales, géneros, autores y clientes mediante arrays y objetos con identificadores estables"*, y exige un conjunto inicial de **al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios**.
> Los identificadores, el esquema de claves de `localStorage` y los precios del seed son **decisiones de diseño nuestras** (ver [09](09_decisiones_y_supuestos.md)); están marcados explícitamente.

## Dominios

| Dominio | Descripción | Entidades |
|---------|-------------|-----------|
| **Catálogo** | Collection de referencia y obras disponibles. Solo lectura para editoriales, géneros y autores; alta de libros habilitada. | Editorial, Género, Autor, Libro |
| **Clientes** | Padroneo de las personas que compran en la librería simulada. | Cliente |
| **Comercial** | Registro de operaciones: venta y sus renglones. Renglón con precio unitario congelado. | Venta, Renglón |

## ERD (Entity Relationship Diagram)

```
                    ┌────────────────────┐
                    │     EDITORIAL      │
                    │ id      : string   │
                    │ nombre  : string   │
                    └─────────┬──────────┘
                              │ 1
                              │
                    N         ▼         1
   ┌──────────────┐  ┌──────────────────────────┐  ┌───────────────┐
   │    AUTOR     │  │         LIBRO           │  │    GÉNERO     │
   │ id   : string│─*│ id        : string       │─*│ id   : string │
   │ nombre: strin│  │ titulo    : string       │  │ nombre: string│
   │ (≥1 por libro│  │ isbn      : string       │  │ (opcional en  │
   │  → cardinal. │  │ isbnNorm  : string       │  │  el libro)    │
   │    N..1)     │  │ precio    : number       │  └───────────────┘
   └──────────────┘  │ editorialId : string     │
                      │ generoId    : string?    │
                      └─────────────┬────────────┘
                                    │ 1
                                    │
                                    │ N  (renglones con snapshot)
                                    ▼
   ┌──────────────┐          ┌──────────────────────────┐
   │   CLIENTE    │    1    │          VENTA           │   N
   │ id     : str │─────────▶│ id      : string         │◀──┘
   │ nombre  : str│          │ fecha   : string (ISO)   │
   │ email  : str │          │ clienteId : string       │
   │ emailNorm:str│          │ clienteNombre : string   │  (snapshot)
   └──────────────┘          │ renglones : Renglón[]    │
                              │ total    : number       │
                              └──────────────────────────┘
                                            │
                                            │ 1
                                            ▼
                              ┌──────────────────────────┐
                              │        RENGLÓN           │
                              │ id            : string   │
                              │ libroId       : string   │
                              │ titulo        : string   │  (snapshot)
                              │ isbn          : string   │  (snapshot)
                              │ autores       : string   │  (snapshot)
                              │ editorial     : string   │  (snapshot)
                              │ cantidad      : integer  │
                              │ precioUnitario: number  │  (snapshot)
                              │ subtotal      : number  │  (snapshot)
                              └──────────────────────────┘

   Cardinalidades:  Editorial 1 ─── N Libro      Género 0..1 ─── N Libro
                    Autor    N ─── N Libro        Cliente 1 ─── N Venta
                    Venta    1 ─── N Renglón      Libro   1 ─── N Renglón
```

**Regla clave del modelo:** la relación `Venta → Renglón → Libro` es **doble**: el renglón apunta al libro por `libroId` (integridad referencial) **y** guarda una copia de los datos descriptivos y del precio unitario (*snapshot*). El snapshot es lo que hace que una venta confirmada sea legible e inmutable aunque el catálogo cambie.

## Entidades

### Libro

| Atributo | Tipo | Requerido | Notas |
|----------|------|-----------|-------|
| `id` | string | Sí | Identificador estable, nunca se reasigna. |
| `titulo` | string | Sí | Texto libre; no vacío tras `trim()`. |
| `isbn` | string | Sí | Valor tal como lo carga el usuario. |
| `isbnNorm` | string | Sí | Clave de unicidad: `isbn` sin espacios ni guiones, en minúsculas. |
| `precio` | number | Sí | Numérico y **mayor que cero**. |
| `editorialId` | string | Sí | Debe existir en la colección de editoriales. |
| `generoId` | string \| null | No | `null` = sin clasificar. Si se asigna, debe existir. |
| `autorIds` | string[] | Sí | **Al menos un** autor; todos deben existir. |

- **Relaciones**: `editorialId` → Editorial (N..1, obligatoria); `autorIds` → Autores (N..N, mínimo 1); `generoId` → Género (N..1, opcional).
- **Constraints**: `isbnNorm` único; `precio > 0`; `autorIds.length >= 1`; `generoId ∈ Editoriales ∪ {null}`; `editorialId ∈ Editoriales`.
- **Índices relevantes**: por `isbnNorm` (unicidad, se consulta en cada alta), por `titulo` normalizado (búsqueda del catálogo).

### Editorial

| Atributo | Tipo | Requerido | Notas |
|----------|------|-----------|-------|
| `id` | string | Sí | Identificador estable. |
| `nombre` | string | Sí | No vacío. |

- **Relaciones**: 1 → N Libro.
- **Constraints**: `nombre` único dentro del catálogo (no exigido por la consigna, pero evita selectores ambiguos).
- **Gestión**: solo lectura. No se crea, no se edita, no se elimina.

### Género

| Atributo | Tipo | Requerido | Notas |
|----------|------|-----------|-------|
| `id` | string | Sí | Identificador estable. |
| `nombre` | string | Sí | No vacío. |

- **Relaciones**: 0..1 → N Libro.
- **Constraints**: `nombre` único.
- **Gestión**: solo lectura. La ausencia de género se representa con `generoId = null` y se muestra como «Sin clasificar».

### Autor

| Atributo | Tipo | Requerido | Notas |
|----------|------|-----------|-------|
| `id` | string | Sí | Identificador estable. |
| `nombre` | string | Sí | No vacío. |

- **Relaciones**: N..N → Libro.
- **Constraints**: `nombre` único.
- **Gestión**: solo lectura.

### Cliente

| Atributo | Tipo | Requerido | Notas |
|----------|------|-----------|-------|
| `id` | string | Sí | Identificador estable. |
| `nombre` | string | Sí | Nombre completo; **no** hay campo de apellido separado. |
| `email` | string | Sí | Formato válido. |
| `emailNorm` | string | Sí | Clave de unicidad: `email` sin espacios exteriores, en minúsculas. |

- **Relaciones**: 1 → N Venta.
- **Constraints**: `emailNorm` único; `nombre` y `email` no vacíos; `email` con formato válido.
- **Nota de normalización**: el cliente normaliza **solo espacios exteriores**; el libro (ISBN) normaliza **espacios y guiones**. La consigna lo dice así literalmente en cada caso.

### Venta

| Atributo | Tipo | Requerido | Notas |
|----------|------|-----------|-------|
| `id` | string | Sí | Identificador de la venta, p. ej. `VEN-001`. Asignado al confirmar. |
| `fecha` | string | Sí | Fecha y hora de confirmación. |
| `clienteId` | string | Sí | Debe existir en la colección de clientes. |
| `clienteNombre` | string | Sí | Snapshot del nombre, para leer la venta sin depender del catálogo de clientes. |
| `renglones` | Renglón[] | Sí | Al menos un elemento. |
| `total` | number | Sí | Suma de los subtotales, con dos decimales. |

- **Relaciones**: `clienteId` → Cliente (N..1, obligatoria); `renglones` → Renglones (1..N).
- **Constraints**: `total === sum(renglones.subtotal)`; los importes se presentan con dos decimales.
- **Inmutabilidad**: una vez confirmada, la venta **no se edita ni se elimina** desde la interfaz. La única forma de alterar el contenido de una venta es manipulating directamente el `localStorage`, y la consigna prohíbe explícitamente hacerlo en el procedimiento de comprobación ("sin modificar ni borrar las ventas guardadas").

### Renglón

| Atributo | Tipo | Requerido | Notas |
|----------|------|-----------|-------|
| `id` | string | Sí | Identificador estable del renglón dentro de la venta. |
| `libroId` | string | Sí | Debe existir en la colección de libros. |
| `titulo` | string | Sí | Snapshot del título. |
| `isbn` | string | Sí | Snapshot del ISBN. |
| `autores` | string | Sí | Snapshot de los nombres de autor, unidos para lectura. |
| `editorial` | string | Sí | Snapshot del nombre de la editorial. |
| `cantidad` | number | Sí | **Entero mayor que cero**. |
| `precioUnitario` | number | Sí | **Snapshot del precio de catálogo en el momento de agregar el renglón.** |
| `subtotal` | number | Sí | `cantidad × precioUnitario`, redondeado a dos decimales. |

- **Relaciones**: `libroId` → Libro (N..1, obligatoria); pertenece a exactamente 1 Venta.
- **Constraints**: `cantidad` entero `>= 1`; `precioUnitario > 0`; `subtotal = round2(cantidad × precioUnitario)`; **no puede haber dos renglones con el mismo `libroId` dentro de la misma venta**.
- **Propiedad clave**: `precioUnitario` es un **valor histórico**. El historial **no vuelve a leer el precio actual del catálogo** para mostrar importes. Si el docente cambia el precio guardado del libro, el renglón y el total de la venta permanecen intactos.

## Seed data inicial

Conjunto inicial mínimo exigido: **6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios**. La consigna no fija nombres ni precios, así que los siguientes son una **propuesta concreta** (decisión DD-02), diseñada para cubrir todos los caminos de la interfaz y para hacer reproducible el caso manual nº 5 (*dos unidades a 1500 y una a 2000*).

### Editoriales (2)

| id | nombre |
|----|--------|
| `EDI-001` | Editorial Aurora |
| `EDI-002` | Editorial del Río |

### Géneros (2)

| id | nombre |
|----|--------|
| `GEN-001` | Novela |
| `GEN-002` | Ensayo |

### Autores (3)

| id | nombre |
|----|--------|
| `AUT-001` | Elena Marchetti |
| `AUT-002` | Joaquín Buffarini |
| `AUT-003` | Rocío Sandoval |

### Libros (6)

| id | título | isbn | isbnNorm | precio | editorialId | generoId | autorIds |
|----|--------|------|----------|--------|-------------|----------|----------|
| `LIB-001` | El faro de las salinas | 978-8001-0001-1 | `978800100011` | 1500.00 | `EDI-001` | `GEN-001` | `["AUT-001"]` |
| `LIB-002` | Cuentos del delta | 978-8001-0002-2 | `978800100022` | 2000.00 | `EDI-002` | `null` | `["AUT-002","AUT-003"]` |
| `LIB-003` | Manual de cartografía | 978-8001-0003-3 | `978800100033` | 2500.00 | `EDI-001` | `GEN-002` | `["AUT-003"]` |
| `LIB-004` | La casa de los vientos | 978-8001-0004-4 | `978800100044` | 1800.00 | `EDI-002` | `GEN-001` | `["AUT-001","AUT-002"]` |
| `LIB-005` | Notas de un viajero | 978-8001-0005-5 | `978800100055` | 1200.00 | `EDI-001` | `null` | `["AUT-002"]` |
| `LIB-006` | Atlas de lo imaginado | 978-8001-0006-6 | `978800100066` | 3200.00 | `EDI-002` | `GEN-002` | `["AUT-001"]` |

Cobertura del seed:

- `LIB-001` (1500.00) y `LIB-002` (2000.00) permiten reproducir el caso manual nº 5 sin cargar datos extra: 2 × 1500 + 1 × 2000 = **5000.00**.
- `LIB-002` y `LIB-005` tienen `generoId = null` → ejercitan la etiqueta **«Sin clasificar»**.
- `LIB-002` y `LIB-004` tienen dos autores → ejercitan la relación N..N y el selector múltiple.
- Todos los ISBN son ficticios y **no satisfacen el dígito de control real**, en línea con la consigna: *"no se requiere implementar su dígito de control"*.

### Clientes (3)

| id | nombre | email | emailNorm |
|----|--------|-------|-----------|
| `CLI-001` | Ana Beatriz Ferrer | ana.ferrer@example.com | `ana.ferrer@example.com` |
| `CLI-002` | Carlos Hernán Medina | carlos.medina@example.com | `carlos.medina@example.com` |
| `CLI-003` | Lucía Torres | lucia.torres@example.com | `lucia.torres@example.com` |

> Se usa el dominio reservado `example.com` para no apuntar a buzones reales.

## Estructura persistida en `localStorage`

La consigna exige persistir **libros, clientes y ventas** y que, al reabrir, se recuperen "sin duplicar los datos iniciales". Este es el esquema que el `README.md` debe documentar para que el docente pueda localizar el catálogo y editar el precio de un libro:

| Clave | Tipo | Contenido | Obligatoria por la consigna |
|-------|------|-----------|-------------------------------|
| `libreria.libros` | `Libro[]` | Catálogo de libros (incluye los del seed y los dados de alta) | **Sí** |
| `libreria.clientes` | `Cliente[]` | Clientes registrados | **Sí** |
| `libreria.ventas` | `Venta[]` | Ventas confirmadas, con renglones y precios históricos | **Sí** |
| `libreria.editoriales` | `Editorial[]` | Catálogo de editoriales | No (decisión DD-06) |
| `libreria.generos` | `Género[]` | Catálogo de géneros | No (decisión DD-06) |
| `libreria.autores` | `Autor[]` | Catálogo de autores | No (decisión DD-06) |

Ejemplo del contenido de `libreria.libros` (extracto):

```json
[
  {
    "id": "LIB-001",
    "titulo": "El faro de las salinas",
    "isbn": "978-8001-0001-1",
    "isbnNorm": "978800100011",
    "precio": 1500.0,
    "editorialId": "EDI-001",
    "generoId": "GEN-001",
    "autorIds": ["AUT-001"]
  }
]
```

Ejemplo del contenido de `libreria.ventas` (extracto) — nótese que el renglón **no** consulta el catálogo:

```json
[
  {
    "id": "VEN-001",
    "fecha": "2026-10-22T14:35:00.000Z",
    "clienteId": "CLI-001",
    "clienteNombre": "Ana Beatriz Ferrer",
    "renglones": [
      {
        "id": "REN-001",
        "libroId": "LIB-001",
        "titulo": "El faro de las salinas",
        "isbn": "978-8001-0001-1",
        "autores": "Elena Marchetti",
        "editorial": "Editorial Aurora",
        "cantidad": 2,
        "precioUnitario": 1500.0,
        "subtotal": 3000.0
      }
    ],
    "total": 5000.0
  }
]
```

**Regla de siembra:** el seed se escribe **solo si la clave correspondiente no existe** en `localStorage`. Si la clave existe, el contenido guardado es el que manda: esto garantiza (a) que no se dupliquen los ejemplos al reabrir y (b) que la modificación del precio de catálogo que hace el docente **sobreviva a la recarga** y pueda ser observada en el catálogo, mientras la venta mantiene su precio histórico.
