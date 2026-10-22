/*
 * Librería — Parcial 1.
 * Módulo: js/validaciones.js
 * Responsabilidad: funciones puras de validación del dominio.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria; no existe ninguna otra variable global.
 *
 * Son funciones puras: reciben datos, devuelven resultados y no tocan el DOM
 * ni dejan estado.
 *
 * Los dos criterios de normalización quedan explícitos y separados desde ya
 * (DD-05, IN-04): normalizarIsbn() quita espacios y guiones; normalizarEmail()
 * quita solo espacios exteriores. No comparten una función genérica, porque un
 * solo criterio rompería uno de los dos (RN-LIB-04, RN-CLI-02).
 *
 * En este change (C-01) los validadores devuelven la lista vacía de errores y
 * los cálculos de importes devuelven cero. Las reglas completas (RN-LIB-03,
 * RN-CLI-02, RN-VEN-01, RN-VEN-05) llegan en C-06.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  window.Libreria.validaciones = {
    /**
     * Errores de alta de un libro, uno por campo. C-06.
     */
    validarLibro: function (datos, contexto) {
      return [];
    },

    /**
     * Errores de alta de un cliente, uno por campo. C-06.
     */
    validarCliente: function (datos, contexto) {
      return [];
    },

    /**
     * Errores de una venta por confirmar. C-06.
     */
    validarVenta: function (datos, contexto) {
      return [];
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
     * Subtotal de un renglón: cantidad por precio unitario, con dos decimales
     * (RN-VEN-04). C-06.
     */
    calcularSubtotal: function (renglones) {
      return 0;
    },

    /**
     * Total de la venta: suma de los subtotales, con dos decimales (RN-VEN-04).
     * C-06.
     */
    calcularTotal: function (venta) {
      return 0;
    }
  };
}());
