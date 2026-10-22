/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/catalogo-buscador.js
 * Responsabilidad: armar el buscador por título de la vista Catálogo.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria.
 *
 * El buscador es un formulario con landmark de búsqueda (role="search"),
 * label asociado por for, un único control de texto y dos botones: Buscar
 * (submit) y Limpiar (reset). El módulo no sabe nada del store ni de la
 * grilla: solo arma el formulario y avisa por callbacks qué pasó. Eso deja el
 * estado del filtro en la vista, que es su dueña (RN-CAT-02, RN-LIB-05).
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  var ID_BUSCADOR = 'catalogo-buscar';
  var NOMBRE_BUSCADOR = 'buscar';
  var CLASE_BUSCADOR = 'vista-catalogo__filtros';
  var TEXTO_BUSCAR = 'Buscar';
  var TEXTO_LIMPIAR = 'Limpiar';

  /** Texto recortado del control de búsqueda. */
  function valorRecortado(entrada) {
    var valor = entrada.value;
    return valor === null || valor === undefined ? '' : String(valor).trim();
  }

  /** Crea el campo de texto con su etiqueta asociada. */
  function crearCampo(valorInicial) {
    var campo = document.createElement('div');
    campo.className = 'campo';

    var etiqueta = document.createElement('label');
    etiqueta.className = 'campo__etiqueta';
    etiqueta.setAttribute('for', ID_BUSCADOR);
    etiqueta.textContent = 'Buscar por título';

    var entrada = document.createElement('input');
    entrada.id = ID_BUSCADOR;
    entrada.name = NOMBRE_BUSCADOR;
    entrada.type = 'search';
    entrada.className = 'control';
    entrada.setAttribute('autocomplete', 'off');
    entrada.value = valorInicial === undefined ? '' : valorInicial;

    campo.appendChild(etiqueta);
    campo.appendChild(entrada);
    return { campo: campo, entrada: entrada };
  }

  /** Crea el grupo de botones Buscar y Limpiar. */
  function crearAcciones() {
    var acciones = document.createElement('div');
    acciones.className = 'campo__acciones';

    var botonBuscar = document.createElement('button');
    botonBuscar.type = 'submit';
    botonBuscar.className = 'boton boton--primario';
    botonBuscar.textContent = TEXTO_BUSCAR;

    var botonLimpiar = document.createElement('button');
    botonLimpiar.type = 'reset';
    botonLimpiar.className = 'boton boton--secundario';
    botonLimpiar.textContent = TEXTO_LIMPIAR;

    acciones.appendChild(botonBuscar);
    acciones.appendChild(botonLimpiar);
    return acciones;
  }

  window.Libreria.catalogoBuscador = {
    /**
     * Arma el buscador y conecta sus eventos.
     *
     * opciones.valor      — texto inicial del control.
     * opciones.alBuscar   — se llama al enviar el formulario (texto recortado).
     * opciones.alCambiar  — se llama en vivo mientras se escribe (texto recortado).
     * opciones.alLimpiar  — se llama al pulsar Limpiar, con el control ya vacío.
     *
     * Devuelve { formulario, entrada } para que la vista los use en su render.
     */
    crear: function (opciones) {
      var ajustes = opciones || {};

      var formulario = document.createElement('form');
      formulario.className = CLASE_BUSCADOR;
      formulario.setAttribute('role', 'search');
      formulario.setAttribute('aria-label', 'Buscar en el catálogo');

      var piezas = crearCampo(ajustes.valor);
      formulario.appendChild(piezas.campo);
      formulario.appendChild(crearAcciones());

      formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        if (ajustes.alBuscar) {
          ajustes.alBuscar(valorRecortado(piezas.entrada));
        }
      });

      formulario.addEventListener('reset', function (evento) {
        evento.preventDefault();
        piezas.entrada.value = '';
        if (ajustes.alLimpiar) {
          ajustes.alLimpiar();
        }
      });

      piezas.entrada.addEventListener('input', function () {
        if (ajustes.alCambiar) {
          ajustes.alCambiar(valorRecortado(piezas.entrada));
        }
      });

      return { formulario: formulario, entrada: piezas.entrada };
    }
  };
}());
