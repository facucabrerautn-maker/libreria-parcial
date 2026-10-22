/*
 * Librería — Parcial 1.
 * Módulo: js/storage.js
 * Responsabilidad: lectura y escritura en el almacenamiento local del navegador
 * (Web Storage API) con siembra condicional.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria; no existe ninguna otra variable global.
 *
 * En este change (C-01) el módulo NO accede al almacenamiento: queda con el
 * contrato declarado y cuerpos neutros. El acceso real —con try/catch, aviso de
 * cuota agotada y siembra condicional a que la clave no exista todavía— llega
 * en C-07.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  window.Libreria.storage = {
    /**
     * Lee todas las colecciones guardadas en el almacenamiento local. C-07.
     */
    leerTodo: function () {
      return null;
    },

    /**
     * Entrega al store las colecciones leídas. C-07.
     */
    hidratar: function () {
      return null;
    },

    /**
     * Persiste la colección de libros. C-07.
     */
    guardarLibros: function (libros) {
      return null;
    },

    /**
     * Persiste la colección de clientes. C-07.
     */
    guardarClientes: function (clientes) {
      return null;
    },

    /**
     * Persiste la colección de ventas. C-07.
     */
    guardarVentas: function (ventas) {
      return null;
    }
  };
}());
