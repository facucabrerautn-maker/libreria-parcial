/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/historial.js
 * Responsabilidad: render y eventos de la vista Historial.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria, dentro de Libreria.vistas.
 *
 * C-02: la vista escribe su mensaje de estado inicial en la región de mensajes
 * declarada en el documento. El historial de ventas y el detalle de sus
 * renglones llegan en C-12.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};
  window.Libreria.vistas = window.Libreria.vistas || {};

  var MENSAJE_INICIAL =
    'El historial todavía no tiene ventas registradas. Se va llenando con ' +
    'cada venta que confirmes, y cada una guardará su precio y sus renglones.';

  window.Libreria.vistas.historial = {
    /**
     * Renderiza la vista Historial dentro del contenedor recibido.
     * C-12 agregará el historial de ventas y el detalle de sus renglones.
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
