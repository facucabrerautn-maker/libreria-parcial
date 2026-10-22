/*
 * Librería — Parcial 1.
 * Módulo: js/validaciones.js
 * Responsabilidad: funciones puras de validación del dominio.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria; no existe ninguna otra variable global.
 *
 * Son funciones puras: reciben datos, devuelven resultados y no tocan el DOM
 * ni dejan estado. El store se recibe como argumento (`datos`) para que estas
 * reglas se puedan probar sin navegador.
 *
 * Los dos criterios de normalización quedan explícitos y separados (DD-05,
 * IN-04): normalizarIsbn() quita espacios y guiones; normalizarEmail() quita
 * solo espacios exteriores. No comparten una función genérica, porque un solo
 * criterio rompería uno de los dos (RN-LIB-04, RN-CLI-02).
 *
 * C-06: implementa RN-LIB-03, RN-CLI-02, RN-VEN-01 y RN-VEN-05, y los cálculos
 * de RN-VEN-04. Cada error se devuelve como {campo, mensaje} para que la vista
 * pueda mostrarlo junto al control que lo provocó (RN-LIB-05, RN-EX-03).
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  /* Formato de email laxo pero con dominio y TLD (P-12). */
  var EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /** Texto recortado de un valor cualquiera; vacío si no hay texto. */
  function texto(valor) {
    if (valor === null || valor === undefined) {
      return '';
    }
    return String(valor).trim();
  }

  /** Número finito o null. No acepta separador de miles ni de miles con coma. */
  function numero(valor) {
    if (typeof valor === 'number') {
      return Number.isFinite(valor) ? valor : null;
    }
    if (typeof valor === 'string') {
      var limpio = valor.trim();
      if (limpio === '') {
        return null;
      }
      var convertido = Number(limpio);
      return Number.isFinite(convertido) ? convertido : null;
    }
    return null;
  }

  /** Indica si una cantidad es un número entero mayor que cero (RN-VEN-01). */
  function cantidadValida(valor) {
    var convertido = numero(valor);
    return convertido !== null && Number.isInteger(convertido) && convertido > 0;
  }

  /** Busca un registro por id con el método del store indicado. */
  function existe(datos, metodo, id) {
    if (!datos || typeof datos[metodo] !== 'function') {
      return false;
    }
    return Boolean(datos[metodo](id));
  }

  /** ¿Ya existe un libro con ese ISBN? Se compara sin espacios ni guiones. */
  function existeIsbn(datos, isbn) {
    var normalizado = window.Libreria.validaciones.normalizarIsbn(isbn);
    if (normalizado === '') {
      return false;
    }
    var libros = datos && typeof datos.listarLibros === 'function' ? datos.listarLibros() : [];
    return (libros || []).some(function (libro) {
      if (!libro) {
        return false;
      }
      var existente =
        typeof libro.isbnNorm === 'string' && libro.isbnNorm !== ''
          ? libro.isbnNorm
          : window.Libreria.validaciones.normalizarIsbn(libro.isbn);
      return existente === normalizado;
    });
  }

  /** ¿Ya existe un cliente con ese email? Se compara sin espacios exteriores. */
  function existeEmail(datos, email) {
    var normalizado = window.Libreria.validaciones.normalizarEmail(email);
    if (normalizado === '') {
      return false;
    }
    var clientes = datos && typeof datos.listarClientes === 'function' ? datos.listarClientes() : [];
    return (clientes || []).some(function (cliente) {
      if (!cliente) {
        return false;
      }
      var existente =
        typeof cliente.emailNorm === 'string' && cliente.emailNorm !== ''
          ? cliente.emailNorm
          : window.Libreria.validaciones.normalizarEmail(cliente.email);
      return existente === normalizado;
    });
  }

  /** Calcula el subtotal de un renglón: cantidad por precio unitario (RN-VEN-04). */
  function subtotalDe(renglon) {
    if (!renglon || typeof renglon !== 'object') {
      return 0;
    }
    var cantidad = numero(renglon.cantidad);
    var precio = numero(renglon.precioUnitario);
    if (cantidad === null || precio === null) {
      return 0;
    }
    return Math.round(cantidad * precio * 100) / 100;
  }

  window.Libreria.validaciones = {
    /**
     * Errores de alta de un libro, uno por campo (RN-LIB-03).
     * @param {object} datos store con los que comprobar existencia
     * @param {object} contexto {titulo, isbn, precio, editorialId, generoId, autorIds}
     * @returns {Array<{campo: string, mensaje: string}>}
     */
    validarLibro: function (datos, contexto) {
      var errores = [];
      var formulario = contexto || {};

      if (texto(formulario.titulo) === '') {
        errores.push({ campo: 'titulo', mensaje: 'El título es obligatorio.' });
      }

      if (texto(formulario.isbn) === '') {
        errores.push({ campo: 'isbn', mensaje: 'El ISBN es obligatorio.' });
      } else if (existeIsbn(datos, formulario.isbn)) {
        errores.push({
          campo: 'isbn',
          mensaje: 'Ya existe un libro registrado con ese ISBN.'
        });
      }

      var precio = numero(formulario.precio);
      if (precio === null || precio <= 0) {
        errores.push({
          campo: 'precio',
          mensaje: 'El precio debe ser un número mayor que cero (por ejemplo 1500 o 1500.50).'
        });
      }

      var editorialId = texto(formulario.editorialId);
      if (editorialId === '' || !existe(datos, 'obtenerEditorial', editorialId)) {
        errores.push({ campo: 'editorialId', mensaje: 'Elegí una editorial de la lista.' });
      }

      /* El género es opcional: la ausencia es un estado válido (RN-DAT-04). */
      var generoId = texto(formulario.generoId);
      if (generoId !== '' && !existe(datos, 'obtenerGenero', generoId)) {
        errores.push({ campo: 'generoId', mensaje: 'El género elegido no existe en los datos.' });
      }

      var autorIds = formulario.autorIds;
      if (!Array.isArray(autorIds) || autorIds.length === 0) {
        errores.push({ campo: 'autorIds', mensaje: 'Elegí al menos un autor.' });
      } else {
        var autorInvalido = autorIds.some(function (id) {
          return !existe(datos, 'obtenerAutor', texto(id));
        });
        if (autorInvalido) {
          errores.push({
            campo: 'autorIds',
            mensaje: 'Alguno de los autores elegidos no existe en los datos.'
          });
        }
      }

      return errores;
    },

    /**
     * Errores de alta de un cliente, uno por campo (RN-CLI-02).
     * @param {object} datos store con el que comprobar la unicidad del email
     * @param {object} contexto {nombre, email}
     * @returns {Array<{campo: string, mensaje: string}>}
     */
    validarCliente: function (datos, contexto) {
      var errores = [];
      var formulario = contexto || {};

      if (texto(formulario.nombre) === '') {
        errores.push({ campo: 'nombre', mensaje: 'El nombre completo es obligatorio.' });
      }

      var email = texto(formulario.email);
      if (email === '') {
        errores.push({ campo: 'email', mensaje: 'El email es obligatorio.' });
      } else if (!EMAIL_VALIDO.test(email)) {
        errores.push({
          campo: 'email',
          mensaje: 'El email no tiene un formato válido (ejemplo: nombre@example.com).'
        });
      } else if (existeEmail(datos, email)) {
        errores.push({
          campo: 'email',
          mensaje: 'Ya existe un cliente registrado con ese email.'
        });
      }

      return errores;
    },

    /**
     * Errores de una venta por confirmar (RN-VEN-01, RN-VEN-02, RN-VEN-05).
     * @param {object} datos store con el que comprobar existencia
     * @param {object} contexto {clienteId, renglones}
     * @returns {Array<{campo: string, mensaje: string}>}
     */
    validarVenta: function (datos, contexto) {
      var errores = [];
      var formulario = contexto || {};

      var clienteId = texto(formulario.clienteId);
      if (clienteId === '') {
        errores.push({ campo: 'clienteId', mensaje: 'Elegí un cliente para la venta.' });
      } else if (!existe(datos, 'obtenerCliente', clienteId)) {
        errores.push({ campo: 'clienteId', mensaje: 'El cliente elegido no existe.' });
      }

      var renglones = Array.isArray(formulario.renglones) ? formulario.renglones : [];
      if (renglones.length === 0) {
        errores.push({
          campo: 'renglones',
          mensaje: 'Agregá al menos un libro a la venta antes de confirmarla.'
        });
        return errores;
      }

      if (renglones.some(function (renglon) { return !cantidadValida(renglon && renglon.cantidad); })) {
        errores.push({
          campo: 'renglones',
          mensaje: 'Las cantidades deben ser números enteros mayores que cero.'
        });
      }

      if (renglones.some(function (renglon) {
        return !existe(datos, 'obtenerLibro', texto(renglon && renglon.libroId));
      })) {
        errores.push({
          campo: 'renglones',
          mensaje: 'Alguno de los libros elegidos no existe en el catálogo.'
        });
      }

      var vistos = {};
      var hayDuplicado = renglones.some(function (renglon) {
        var id = texto(renglon && renglon.libroId);
        if (vistos[id]) {
          return true;
        }
        vistos[id] = true;
        return false;
      });
      if (hayDuplicado) {
        errores.push({
          campo: 'renglones',
          mensaje: 'No se puede agregar dos veces el mismo libro a la misma venta.'
        });
      }

      return errores;
    },

    /**
     * Criterio de comparación del ISBN: sin espacios, sin guiones y en minúsculas
     * (RN-LIB-04). No coincide con el criterio del email.
     */
    normalizarIsbn: function (isbn) {
      if (typeof isbn !== 'string') {
        return '';
      }
      return isbn.replace(/[\s-]/g, '').toLowerCase();
    },

    /**
     * Criterio de comparación del email: sin espacios exteriores y en minúsculas
     * (RN-CLI-02). Los guiones se conservan: no coincide con el criterio del ISBN.
     */
    normalizarEmail: function (email) {
      if (typeof email !== 'string') {
        return '';
      }
      return email.trim().toLowerCase();
    },

    /**
     * Subtotal de UN renglón: cantidad por precio unitario, con dos decimales
     * (RN-VEN-04). Recibe el renglón, no la lista: el subtotal es por renglón.
     */
    calcularSubtotal: function (renglon) {
      return subtotalDe(renglon);
    },

    /**
     * Total de la venta: suma de los subtotales de sus renglones, con dos
     * decimales (RN-VEN-04). Acepta la lista de renglones o el objeto venta.
     */
    calcularTotal: function (renglones) {
      var lista = Array.isArray(renglones)
        ? renglones
        : (renglones && Array.isArray(renglones.renglones) ? renglones.renglones : []);
      var total = 0;
      lista.forEach(function (renglon) {
        total += subtotalDe(renglon);
      });
      return Math.round(total * 100) / 100;
    }
  };
}());
