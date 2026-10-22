/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/catalogo-fichas.js
 * Responsabilidad: construir la ficha de un libro del catálogo y resolver los
 * nombres de editorial, género y autores a partir del store.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria.
 *
 * C-08: la ficha se arma con createElement y textContent, nunca con markup
 * (RN-DAT-05), y nunca con contenido fijo: todo sale del libro recibido
 * (RN-CAT-01). Las relaciones se resuelven por id contra el store; si una
 * relación no existe, se muestra un texto alternativo en lugar de romper la
 * vista.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  var TEXTO_SIN_GENERO = 'Sin clasificar';
  var TEXTO_SIN_AUTORES = 'Sin autores';
  var TEXTO_SIN_EDITORIAL = 'Editorial desconocida';

  /** Convierte un valor cualquiera en texto. */
  function texto(valor) {
    return valor === null || valor === undefined ? '' : String(valor);
  }

  /** Nombre de la editorial del libro, o un texto alternativo si no existe. */
  function nombreEditorial(libro) {
    var datos = window.Libreria.datos;
    var editorial = datos ? datos.obtenerEditorial(libro.editorialId) : null;
    var nombre = editorial ? texto(editorial.nombre).trim() : '';
    return nombre === '' ? TEXTO_SIN_EDITORIAL : nombre;
  }

  /** Nombre del género del libro, o null si el libro no tiene género. */
  function nombreGenero(libro) {
    if (!libro.generoId) {
      return null;
    }
    var datos = window.Libreria.datos;
    var genero = datos ? datos.obtenerGenero(libro.generoId) : null;
    var nombre = genero ? texto(genero.nombre).trim() : '';
    return nombre === '' ? null : nombre;
  }

  /** Nombres de los autores del libro, en el orden en que los declara. */
  function nombresAutores(libro) {
    var datos = window.Libreria.datos;
    var ids = Array.isArray(libro.autorIds) ? libro.autorIds : [];
    var nombres = ids
      .map(function (id) {
        var autor = datos ? datos.obtenerAutor(id) : null;
        return autor ? texto(autor.nombre).trim() : '';
      })
      .filter(function (nombre) {
        return nombre !== '';
      });
    return nombres.length === 0 ? TEXTO_SIN_AUTORES : nombres.join(', ');
  }

  /** Arma la lista de datos de la ficha (ISBN, editorial, autores, precio). */
  function crearDatos(pares) {
    var lista = document.createElement('dl');
    lista.className = 'ficha';

    pares.forEach(function (par) {
      var termino = document.createElement('dt');
      termino.className = 'ficha__etiqueta';
      termino.textContent = par[0];

      var valor = document.createElement('dd');
      valor.className = par[2] ? 'ficha__valor ' + par[2] : 'ficha__valor';
      valor.textContent = par[1];

      lista.appendChild(termino);
      lista.appendChild(valor);
    });

    return lista;
  }

  /**
   * Crea la ficha de un libro: título, ISBN, editorial, género, autores y
   * precio. Un libro sin género muestra el badge «Sin clasificar»
   * (RN-CAT-04, US-011).
   */
  function crearFicha(libro) {
    if (!libro) {
      return null;
    }

    var ficha = document.createElement('article');
    ficha.className = 'tarjeta';

    var cabecera = document.createElement('div');
    cabecera.className = 'tarjeta__cabecera';

    var titulo = document.createElement('h2');
    titulo.className = 'tarjeta__titulo';
    titulo.textContent = texto(libro.titulo);
    cabecera.appendChild(titulo);

    var genero = nombreGenero(libro);
    var badge = document.createElement('span');
    badge.className = genero ? 'badge badge--acento' : 'badge badge--sin-clasificar';
    badge.textContent = genero || TEXTO_SIN_GENERO;
    cabecera.appendChild(badge);

    ficha.appendChild(cabecera);

    ficha.appendChild(
      crearDatos([
        ['ISBN', texto(libro.isbn)],
        ['Editorial', nombreEditorial(libro)],
        ['Autores', nombresAutores(libro)],
        ['Precio', window.Libreria.ui.formatearMonto(libro.precio), 'ficha__precio']
      ])
    );

    return ficha;
  }

  window.Libreria.catalogoFichas = {
    /** Ficha completa de un libro del catálogo. */
    crearFicha: crearFicha,
    /** Nombre de la editorial del libro (o el texto alternativo). */
    nombreEditorial: nombreEditorial,
    /** Nombre del género del libro, o null si no tiene género. */
    nombreGenero: nombreGenero,
    /** Nombres de los autores del libro, separados por coma. */
    nombresAutores: nombresAutores
  };
}());
