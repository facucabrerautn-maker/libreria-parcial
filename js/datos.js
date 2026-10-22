/*
 * Librería — Parcial 1.
 * Módulo: js/datos.js
 * Responsabilidad: estado en memoria (store) y operaciones de dominio.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria; no existe ninguna otra variable global
 * y el namespace no guarda estado de negocio (el estado es privado del módulo).
 *
 * En este change (C-01) el store está vacío: no hay seed, ni entidades, ni datos
 * hardcodeados. El seed inicial (6 libros, 2 editoriales, 2 géneros, 3 autores y
 * 3 clientes) llega en C-04 y la persistencia en C-07.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  window.Libreria.datos = {
    /**
     * Colección de libros en memoria. C-04.
     */
    listarLibros: function () {
      return [];
    },

    /**
     * Colección de clientes en memoria. C-04.
     */
    listarClientes: function () {
      return [];
    },

    /**
     * Colección de ventas en memoria. C-04.
     */
    listarVentas: function () {
      return [];
    },

    /**
     * Libro con el identificador dado, o null si no existe. C-04.
     */
    obtenerLibro: function (id) {
      return null;
    },

    /**
     * Cliente con el identificador dado, o null si no existe. C-04.
     */
    obtenerCliente: function (id) {
      return null;
    },

    /**
     * Agrega un libro al store y notifica a los suscriptores. C-04.
     */
    agregarLibro: function (libro) {
      return null;
    },

    /**
     * Agrega un cliente al store y notifica a los suscriptores. C-04.
     */
    agregarCliente: function (cliente) {
      return null;
    },

    /**
     * Agrega una venta al store y notifica a los suscriptores. C-04.
     */
    agregarVenta: function (venta) {
      return null;
    },

    /**
     * Registra un oyente que se avisa cuando cambia el store. C-04.
     */
    suscribir: function (oyente) {
      return null;
    }
  };
}());
