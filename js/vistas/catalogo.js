/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/catalogo.js
 * Responsabilidad: render y eventos de la vista Catálogo.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria, dentro de Libreria.vistas.
 *
 * C-02: la vista escribe su mensaje de estado inicial en la región de mensajes
 * declarada en el documento. El catálogo generado a partir del store, con su
 * filtro por título, llega en C-08.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};
  window.Libreria.vistas = window.Libreria.vistas || {};

  var MENSAJE_INICIAL =
    'El catálogo todavía no tiene libros cargados. En esta vista vas a ver ' +
    'todos los títulos disponibles para consultar cuando se carguen.';

  window.Libreria.vistas.catalogo = {
    /**
     * Renderiza la vista Catálogo dentro del contenedor recibido.
     * C-08 agregará el catálogo con su filtro por título.
     */
    render: function (contenedor) {
      var fragmento = document.createDocumentFragment();
      var region = contenedor
        ? contenedor.querySelector('.region-mensajes')
        : null;

      if (region) {
        window.Libreria.ui.mostrarMensaje(region, MENSAJE_INICIAL, 'vacio');
      }

      return fragmento;
    }
  };
}());
