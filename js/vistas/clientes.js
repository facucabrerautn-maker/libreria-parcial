/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/clientes.js
 * Responsabilidad: render y eventos de la vista Clientes: alta, validación,
 * mensajes y listado de clientes registrados.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria, dentro de Libreria.vistas.
 *
 * C-10: el submit se intercepta con preventDefault y valida con validarCliente();
 * si hay errores no se escribe nada y cada error queda junto a su control. El
 * alta solo usa el store, que notifica y persiste solo (RN-CLI-03, RN-EX-04).
 * alCambiarElStore() repinta únicamente el listado, sin perder lo escrito en el
 * formulario ni duplicar nodos.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};
  window.Libreria.vistas = window.Libreria.vistas || {};

  var CLASE_CONTENIDO = 'vista-clientes__contenido';
  var CLASE_LISTADO = 'vista-clientes__listado';
  var SELECTOR_REGION = '.region-mensajes';
  var MENSAJE_FALLO = 'No se pudo registrar el cliente: revisá los datos e intentá de nuevo.';

  var nodoRegion = null;
  var nodoListado = null;
  var nodoMensaje = null;
  var limpiarFormulario = null;

  /** Quita el mensaje propio de la vista, sin tocar los mensajes ajenos. */
  function quitarMensaje() {
    if (nodoMensaje && nodoMensaje.parentNode) {
      nodoMensaje.parentNode.removeChild(nodoMensaje);
    }
    nodoMensaje = null;
  }

  /** Escribe un mensaje de resultado en la región de mensajes de la vista. */
  function mostrarResultado(texto, tipo) {
    quitarMensaje();
    if (!nodoRegion) {
      return null;
    }
    nodoMensaje = window.Libreria.ui.mostrarMensaje(nodoRegion, texto, tipo);
    return nodoMensaje;
  }

  /** Repinta solo el listado desde el store, sin duplicar nodos. */
  function pintarListado() {
    if (!nodoListado) {
      return false;
    }
    while (nodoListado.firstChild) {
      nodoListado.removeChild(nodoListado.firstChild);
    }
    nodoListado.appendChild(window.Libreria.clientesListado.crear());
    return true;
  }

  function textoDeAlta(cliente) {
    return 'Cliente «' + cliente.nombre + '» registrado correctamente.';
  }

  /**
   * Maneja el envío: limpia errores previos, valida y, si todo pasa, da de
   * alta en el store, limpia el formulario, informa y refresca el listado.
   */
  function alEnviar(contexto, formulario) {
    var ui = window.Libreria.ui;
    var datos = window.Libreria.datos;

    ui.limpiarErrores(nodoRegion, formulario);

    var errores = window.Libreria.validaciones.validarCliente(datos, contexto);
    if (errores.length > 0) {
      quitarMensaje();
      ui.mostrarErrores(nodoRegion, errores, { formulario: formulario });
      ui.enfocarPrimerError(formulario);
      return false;
    }

    var registro = datos.agregarCliente(contexto);
    if (!registro) {
      mostrarResultado(MENSAJE_FALLO, 'error');
      return false;
    }

    if (limpiarFormulario) {
      limpiarFormulario();
    }
    mostrarResultado(textoDeAlta(registro), 'exito');
    pintarListado();
    return true;
  }

  window.Libreria.vistas.clientes = {
    /**
     * Renderiza la vista Clientes: devuelve el fragmento con el formulario y el
     * listado. La sección ya trae su h1 y su región de mensajes.
     */
    render: function (seccion) {
      var fragmento = document.createDocumentFragment();

      quitarMensaje();
      nodoRegion = seccion ? seccion.querySelector(SELECTOR_REGION) : null;

      var contenido = document.createElement('div');
      contenido.className = CLASE_CONTENIDO;

      var piezas = window.Libreria.clientesFormulario.crear({ alEnviar: alEnviar });
      limpiarFormulario = piezas.limpiar;

      nodoListado = document.createElement('div');
      nodoListado.className = CLASE_LISTADO;

      contenido.appendChild(piezas.formulario);
      contenido.appendChild(nodoListado);
      fragmento.appendChild(contenido);

      pintarListado();

      return fragmento;
    },

    /**
     * Repinta solo el listado cuando cambia el store, sin tocar el formulario
     * y sin duplicar nodos (RN-CLI-03).
     */
    alCambiarElStore: function () {
      return pintarListado();
    }
  };
}());
