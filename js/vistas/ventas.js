/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/ventas.js
 * Responsabilidad: render y eventos de la vista Ventas.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria, dentro de Libreria.vistas.
 *
 * C-02: la vista escribe su mensaje de estado inicial en la región de mensajes
 * declarada en el documento. La composición y la confirmación de la venta
 * llegan en C-11.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};
  window.Libreria.vistas = window.Libreria.vistas || {};

  var MENSAJE_INICIAL =
    'Todavía no hay ventas registradas. Desde esta vista vas a poder armar ' +
    'una venta con sus renglones y confirmar el total.';

  window.Libreria.vistas.ventas = {
    /**
     * Renderiza la vista Ventas dentro del contenedor recibido.
     * C-11 agregará la composición de la venta y su confirmación.
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
