/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/catalogo.js
 * Responsabilidad: render y eventos de la vista Catálogo.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria, dentro de Libreria.vistas.
 *
 * C-08: la grilla se genera desde el store, nunca desde HTML fijo (RN-CAT-01);
 * cada ficha muestra título, ISBN, editorial, género, autores y precio. El
 * buscador por título filtra en vivo y al enviar el formulario, con
 * preventDefault, trim() y coincidencia parcial (RN-CAT-02). Los estados de
 * "catálogo vacío" y "búsqueda sin coincidencias" son distintos y explícitos
 * (RN-CAT-04).
 *
 * El texto de la búsqueda es estado privado de este módulo: sobrevive a
 * alCambiarElStore() y no es estado global (RN-LIB-05). Las escuchas viven en
 * los nodos que crea el render, así que no se acumulan entre montajes.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};
  window.Libreria.vistas = window.Libreria.vistas || {};

  var CLASE_RESULTADOS = 'vista-catalogo__resultados';
  var CLASE_GRILLA = 'grilla-catalogo';
  var CLASE_ITEM = 'grilla-catalogo__item';
  var CLASE_CONSEO = 'vista-catalogo__conteo';

  var MENSAJE_CATALOGO_VACIO =
    'El catálogo todavía no tiene libros cargados. Cuando des de alta un título ' +
    'desde la vista Libros, va a aparecer acá.';
  var PREFIJO_SIN_COINCIDENCIAS = 'No se encontraron libros para "';
  var SUFIJO_SIN_COINCIDENCIAS = '"';

  /* Estado privado del módulo: la última búsqueda y los nodos de la vista. */
  var consulta = '';
  var nodoRegion = null;
  var nodoResultados = null;
  var nodoMensaje = null;

  /** Quita el mensaje de estado propio, sin tocar los mensajes ajenos. */
  function quitarMensaje() {
    if (nodoMensaje && nodoMensaje.parentNode) {
      nodoMensaje.parentNode.removeChild(nodoMensaje);
    }
    nodoMensaje = null;
  }

  /** Escribe un mensaje de estado en la región de mensajes de la vista. */
  function mostrarMensaje(textoMensaje) {
    quitarMensaje();
    if (!nodoRegion) {
      return null;
    }
    nodoMensaje = window.Libreria.ui.mostrarMensaje(nodoRegion, textoMensaje, 'vacio');
    return nodoMensaje;
  }

  /** Grilla de fichas a partir de los libros ya filtrados. */
  function crearGrilla(libros) {
    var grilla = document.createElement('ul');
    grilla.className = CLASE_GRILLA;

    libros.forEach(function (libro) {
      var item = document.createElement('li');
      item.className = CLASE_ITEM;
      item.appendChild(window.Libreria.catalogoFichas.crearFicha(libro));
      grilla.appendChild(item);
    });

    return grilla;
  }

  /** Resumen de resultados: "6 libros en el catálogo" o "2 de 6 libros". */
  function textoConsejo(cantidad, total) {
    if (cantidad === total) {
      return cantidad === 1 ? '1 libro en el catálogo' : cantidad + ' libros en el catálogo';
    }
    return 'Se muestran ' + cantidad + ' de ' + total + ' libros';
  }

  /**
   * Pinta la grilla y el estado de la vista a partir del store. Es idempotente:
   * vacía el contenedor de resultados antes de escribir, así que no duplica
   * nodos. El orden de los libros lo trae el store (SU-02).
   */
  function pintarResultados() {
    if (!nodoResultados) {
      return false;
    }

    while (nodoResultados.firstChild) {
      nodoResultados.removeChild(nodoResultados.firstChild);
    }

    var libros = window.Libreria.datos.listarLibros();
    var busqueda = window.Libreria.ui.normalizarTitulo(consulta);

    if (libros.length === 0) {
      mostrarMensaje(MENSAJE_CATALOGO_VACIO);
      return true;
    }

    var encontrados = busqueda === ''
      ? libros
      : libros.filter(function (libro) {
          var titulo = window.Libreria.ui.normalizarTitulo(libro.titulo);
          return titulo.indexOf(busqueda) !== -1;
        });

    if (encontrados.length === 0) {
      mostrarMensaje(PREFIJO_SIN_COINCIDENCIAS + consulta + SUFIJO_SIN_COINCIDENCIAS);
      return true;
    }

    quitarMensaje();

    var consejo = document.createElement('p');
    consejo.className = CLASE_CONSEO;
    consejo.textContent = textoConsejo(encontrados.length, libros.length);
    nodoResultados.appendChild(consejo);
    nodoResultados.appendChild(crearGrilla(encontrados));

    return true;
  }

  /** Crea el buscador por título y conecta su estado con la vista. */
  function crearBuscador() {
    var buscador = window.Libreria.catalogoBuscador.crear({
      valor: consulta,
      alBuscar: function (texto) {
        consulta = texto;
        pintarResultados();
      },
      alCambiar: function (texto) {
        consulta = texto;
        pintarResultados();
      },
      alLimpiar: function () {
        consulta = '';
        pintarResultados();
      }
    });

    return buscador.formulario;
  }

  window.Libreria.vistas.catalogo = {
    /**
     * Renderiza la vista Catálogo: devuelve el fragmento con el buscador y la
     * grilla de libros. La sección ya trae su h1 y su región de mensajes.
     */
    render: function (seccion) {
      var fragmento = document.createDocumentFragment();

      quitarMensaje();
      nodoRegion = seccion ? seccion.querySelector('.region-mensajes') : null;
      nodoResultados = document.createElement('div');
      nodoResultados.className = CLASE_RESULTADOS;

      fragmento.appendChild(crearBuscador());
      fragmento.appendChild(nodoResultados);

      pintarResultados();

      return fragmento;
    },

    /**
     * Repinta la grilla cuando cambia el store, sin tocar el texto del
     * buscador y sin duplicar nodos (RN-LIB-05).
     */
    alCambiarElStore: function () {
      return pintarResultados();
    }
  };
}());
