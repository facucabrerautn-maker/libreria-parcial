/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/clientes-listado.js
 * Responsabilidad: construir la tabla de clientes registrados a partir del
 * store.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria.
 *
 * C-10: el listado muestra nombre y email; no edita ni borra (IN-07). La tabla
 * trae caption y estado vacío propio.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  var ENCABEZADOS = ['Nombre completo', 'Email'];
  var CAPTION = 'Clientes registrados';
  var TEXTO_VACIO = 'Todavía no hay clientes registrados.';

  window.Libreria.clientesListado = {
    /**
     * Devuelve la tabla de clientes dentro de su contenedor con scroll propio.
     * La tabla sale del store, ordenada por nombre desde datos.listarClientes().
     */
    crear: function () {
      var clientes = window.Libreria.datos.listarClientes();
      var filas = clientes.map(function (cliente) {
        return [cliente.nombre, cliente.email];
      });
      return window.Libreria.ui.crearTabla(ENCABEZADOS, filas, {
        claseTabla: 'tabla tabla-clientes',
        titulo: CAPTION,
        vacia: TEXTO_VACIO
      });
    }
  };
}());
