/*
 * Librería — Parcial 1.
 * Módulo: js/ui.js
 * Responsabilidad: helpers de DOM: creación de elementos, texto seguro,
 * mensajes, foco y formato.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria; no existe ninguna otra variable global.
 *
 * Todo el contenido se inserta como texto en el DOM, con createElement y
 * textContent: nunca se interpola markup como texto (RN-DAT-05). Los helpers
 * son genéricos: no conocen el dominio ni traen datos hardcodeados.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  /** Convierte un valor en texto seguro para insertar en el DOM. */
  function aTexto(valor) {
    return valor === null || valor === undefined ? '' : String(valor);
  }

  /** Crea un elemento con el texto dado como contenido y, si se indica, una clase. */
  function crear(etiqueta, texto, clase) {
    var elemento = document.createElement(etiqueta);
    if (texto !== null && texto !== undefined) {
      elemento.textContent = aTexto(texto);
    }
    if (typeof clase === 'string' && clase !== '') {
      elemento.className = clase;
    }
    return elemento;
  }

  window.Libreria.ui = {
    /** Crea un elemento con texto como contenido y, opcionalmente, una clase. */
    crearElemento: function (etiqueta, texto, clase) {
      return crear(etiqueta, texto, clase);
    },

    /** Crea una tabla con encabezados de columna y filas de celdas de texto. */
    crearTabla: function (encabezados, filas) {
      var tabla = document.createElement('table');
      var cabecera = document.createElement('thead');
      var filaCabecera = document.createElement('tr');

      (encabezados || []).forEach(function (titulo) {
        var celda = crear('th', titulo);
        celda.setAttribute('scope', 'col');
        filaCabecera.appendChild(celda);
      });

      cabecera.appendChild(filaCabecera);
      tabla.appendChild(cabecera);
      var cuerpo = document.createElement('tbody');

      (filas || []).forEach(function (fila) {
        var filaCuerpo = document.createElement('tr');
        (fila || []).forEach(function (valor) {
          filaCuerpo.appendChild(crear('td', valor));
        });
        cuerpo.appendChild(filaCuerpo);
      });

      tabla.appendChild(cuerpo);
      return tabla;
    },

    /** Inserta un mensaje de resultado (éxito, error o información) y lo devuelve. */
    mostrarMensaje: function (contenedor, texto, tipo) {
      var clase = 'mensaje';
      if (typeof tipo === 'string' && tipo !== '') {
        clase += ' mensaje--' + tipo;
      }
      var mensaje = crear('p', texto, clase);
      if (contenedor && typeof contenedor.appendChild === 'function') {
        contenedor.appendChild(mensaje);
      }
      return mensaje;
    },

    /** Inserta la lista de errores de validación; el campo queda en data-campo. */
    mostrarErrores: function (contenedor, errores) {
      var lista = document.createElement('ul');
      lista.className = 'lista-errores';

      (errores || []).forEach(function (error) {
        var item = document.createElement('li');
        if (error && typeof error === 'object') {
          item.setAttribute('data-campo', aTexto(error.campo));
          item.textContent = aTexto(error.mensaje);
        } else {
          item.textContent = aTexto(error);
        }
        lista.appendChild(item);
      });

      if (contenedor && typeof contenedor.appendChild === 'function') {
        contenedor.appendChild(lista);
      }
      return lista;
    },

    /** Mueve el foco al elemento indicado; devuelve true si el foco quedó ahí. */
    moverFoco: function (elemento) {
      if (elemento && typeof elemento.focus === 'function') {
        elemento.focus();
        return true;
      }
      return false;
    },

    /** Mueve el foco al primer control con error dentro del contenedor. */
    enfocarPrimerError: function (contenedor) {
      if (!contenedor || typeof contenedor.querySelector !== 'function') {
        return false;
      }
      var primerError = contenedor.querySelector(
        '[data-campo-error], [aria-invalid="true"], .campo-error'
      );
      return window.Libreria.ui.moverFoco(primerError);
    },

    /** Formatea un importe con dos decimales y sin símbolo de moneda (P-03). */
    formatearMonto: function (monto) {
      var numero = Number(monto);
      if (!Number.isFinite(numero)) {
        return '0.00';
      }
      return numero.toFixed(2);
    },

    /** Formatea una fecha en formato local legible dd/mm/aaaa (P-05). */
    formatearFecha: function (fecha) {
      if (!fecha) {
        return '';
      }
      var momento = fecha instanceof Date ? fecha : new Date(fecha);
      if (Number.isNaN(momento.getTime())) {
        return '';
      }
      var dia = aTexto(momento.getDate());
      var mes = aTexto(momento.getMonth() + 1);
      var anio = aTexto(momento.getFullYear());
      if (dia.length < 2) {
        dia = '0' + dia;
      }
      if (mes.length < 2) {
        mes = '0' + mes;
      }
      return dia + '/' + mes + '/' + anio;
    },

    /** Normaliza un título para compararlo: sin espacios sobrantes y en minúsculas. */
    normalizarTitulo: function (titulo) {
      if (typeof titulo !== 'string') {
        return '';
      }
      return titulo.trim().replace(/\s+/g, ' ').toLowerCase();
    },

    /** Indica si un valor está vacío: nulo, indefinido, texto en blanco o colección vacía. */
    esVacio: function (valor) {
      if (valor === null || valor === undefined) {
        return true;
      }
      if (typeof valor === 'string') {
        return valor.trim() === '';
      }
      if (Array.isArray(valor)) {
        return valor.length === 0;
      }
      return false;
    }
  };
}());
