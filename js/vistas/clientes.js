/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/clientes.js
 * Responsabilidad: render y eventos de la vista Clientes.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria, dentro de Libreria.vistas.
 *
 * C-02: la vista escribe su mensaje de estado inicial en la región de mensajes
 * declarada en el documento. El listado y el formulario de alta de clientes
 * llegan en C-10.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};
  window.Libreria.vistas = window.Libreria.vistas || {};

  var MENSAJE_INICIAL =
    'Todavía no hay clientes registrados. Desde esta vista vas a poder ' +
    'registrar clientes nuevos y consultar los que ya cargaste.';

  window.Libreria.vistas.clientes = {
    /**
     * Renderiza la vista Clientes dentro del contenedor recibido.
     * C-10 agregará el listado y el formulario de alta.
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
