# Librería — Base de Conocimiento

Base de conocimiento generada en **Modo A (ingestión silenciosa)** a partir de la fuente única del proyecto: `docs/consigna-extraida.txt` (texto extraído de *Consigna Primer Parcial* — Programación III, Tecnicatura Universitaria en Programación, Unidad "HTML, CSS y JavaScript").

> **Alcance de esta KB**: documenta el parcial 1 (Ejercicios 1 a 6, 100 puntos). **No** es el código de la aplicación ni el `README.md` de entrega: es la especificación que le precede.

## Índice de archivos

| Archivo | Contenido |
|---------|-----------|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito del sistema, objetivos por actor (3), alcance v1.0, fuera de alcance, métricas de éxito |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack tecnológico (HTML5 + CSS3 + JS nativo + `localStorage`), arquitectura general (SPA por hash), integraciones externas (ninguna), API REST (no aplica) |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Actores (4), matriz de permisos del rol único `operador`, rutas públicas de las 5 vistas |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Dominios, ERD, 7 entidades con atributos y constraints, seed data completo (6/2/2/3/3), estructura persistida en `localStorage` |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | **47 reglas** codificadas `RN-{DOMINIO}-{NN}`: 42 de dominio en 10 dominios + 5 excepciones globales |
| [06_funcionalidades.md](06_funcionalidades.md) | **34 historias de usuario** `US-001…US-034` en 9 épicas, con criterios de aceptación y trazabilidad a la rúbrica de 100 puntos |
| [07_flujos_principales.md](07_flujos_principales.md) | 11 flujos extremo a extremo: arranque, navegación, búsqueda, altas, venta, confirmación, historial, precio histórico, recarga, accesibilidad |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones aplicados, estructura de directorios, estrategia de renderizado, seguridad, accesibilidad, modelo de despliegue |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | 12 decisiones `DD-01…DD-12` con alternativas y trade-offs + 10 supuestos `SU-01…SU-10` con riesgo y validación |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | 9 inconsistencias detectadas `IN-01…IN-09` + 15 preguntas abiertas priorizadas con default propuesto |

## Quick Start para Desarrolladores

1. Entender el dominio → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. Entender los datos → [04](04_modelo_de_datos.md)
3. Entender las reglas → [05](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md)
5. Implementar → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. Antes de codificar → [09](09_decisiones_y_supuestos.md), [10](10_preguntas_abiertas.md)

**Orden de implementación sugerido** (deriva de las dependencias del roadmap):

```
08 (estructura de carpetas + HTML base + CSS base)
   → 04 (seed + store + localStorage)
      → 02 (catálogo + filtro)      [ej. 3]
      → 06 (altas: libros y clientes) [ej. 4]
         → 06 (ventas + historial)  [ej. 5]
            → 08 (persistencia)      [ej. 6]
               → 10 (casos manuales + README de entrega)
```

## Resumen Ejecutivo

El parcial 1 pide el **frontend de una librería** —catálogo de libros, clientes, ventas e historial— construido **exclusivamente con HTML, CSS y JavaScript nativos**, sin librerías, frameworks, CDNs, build, backend ni base de datos. Toda la persistencia es `localStorage` y todo el estado vive en el navegador.

El requisito que define la arquitectura del proyecto es el **caso manual nº 6**: al confirmar una venta, el **precio unitario se copia al renglón como valor histórico**, de modo que el historial nunca vuelve a leer el precio actual del catálogo. Eso obliga a un modelo con *snapshot* en el renglón (precio, título, ISBN, autores, editorial) y a una siembra **condicional** de `localStorage` que no pise el precio que el docente modifica a mano para verificarlo.

La consigna evalúa 100 puntos en 6 ejercicios y cierra con tres exigencias de documentación que son parte de la nota: el `README.md` debe registrar el **resultado observado** de los 8 casos manuales (no se declara aprobado lo que no se ejecutó), debe explicar el funcionamiento y los límites de `localStorage`, y debe documentar **la ubicación y la estructura del catálogo guardado** para que el docente pueda reproducir la comprobación del precio histórico.

## Reglas de la fuente

- La **fuente única** es `docs/consigna-extraida.txt`. El PDF original (`docs/Consigna Primer Parcial.pdf`) no se parseó: su texto ya está extraído en el `.txt`.
- Todo lo que la consigna **no** especifica está registrado en [10_preguntas_abiertas.md](10_preguntas_abiertas.md) con un **default propuesto**, para que la implementación pueda avanzar sin bloquearse.
- Las 5 vistas obligatorias son **Catálogo, Libros, Clientes, Ventas e Historial**.
- Fuera de alcance explícito: backend/API/BD/servidor, login real, stock, pagos y facturación fiscal, edición o eliminación de ventas confirmadas, CRUD de editoriales/géneros/autores, edición o eliminación de libros y clientes.
