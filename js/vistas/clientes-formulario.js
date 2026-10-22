/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/clientes-formulario.js
 * Responsabilidad: armar el formulario de alta de clientes, leer sus valores
 * y limpiarlo.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria.
 *
 * C-10: nombre completo en un solo campo (RN-CLI-01, P-07) y email con
 * type="email". Los name coinciden con los campos de validarCliente().
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  var CLASE_FORMULARIO = 'formulario vista-clientes__formulario';

  /** Arma un campo con su etiqueta asociada y el control recibido. */
  function crearCampo(id, etiqueta, control) {
    var campo = document.createElement('div');
    campo.className = 'campo';

    var label = document.createElement('label');
    label.className = 'campo__etiqueta';
    label.setAttribute('for', id);
    label.textContent = etiqueta;

    control.id = id;
    campo.appendChild(label);
    campo.appendChild(control);
    return campo;
  }

  /** Crea una entrada de texto obligatoria con autocompletado declarativo. */
  function crearEntrada(id, nombre, etiqueta, tipo, autocompletado) {
    var control = document.createElement('input');
    control.name = nombre;
    control.type = tipo;
    control.className = 'control';
    control.setAttribute('required', '');
    control.setAttribute('autocomplete', autocompletado);
    return crearCampo(id, etiqueta, control);
  }

  /** Lee el valor de un control tal como lo escribió la persona. */
  function valorDe(formulario, nombre) {
    var control = formulario ? formulario.querySelector('[name="' + nombre + '"]') : null;
    if (!control) {
      return '';
    }
    var valor = control.value;
    return valor === null || valor === undefined ? '' : String(valor);
  }

  function leer(formulario) {
    return { nombre: valorDe(formulario, 'nombre'), email: valorDe(formulario, 'email') };
  }

  /** Vacía los dos controles del formulario. */
  function limpiar(formulario) {
    ['nombre', 'email'].forEach(function (nombre) {
      var control = formulario ? formulario.querySelector('[name="' + nombre + '"]') : null;
      if (control) {
        control.value = '';
      }
    });
  }

  /** Arma el formulario de alta y engancha su submit a la vista. */
  function armarFormulario(alEnviar) {
    var formulario = document.createElement('form');
    formulario.className = CLASE_FORMULARIO;
    // Los atributos HTML quedan como barrera declarativa; la validación con
    // mensajes por campo la resuelve validarCliente() en el submit.
    formulario.setAttribute('novalidate', '');

    var titulo = document.createElement('h2');
    titulo.className = 'formulario__titulo';
    titulo.textContent = 'Registrar cliente';
    formulario.appendChild(titulo);

    formulario.appendChild(
      crearEntrada('cliente-nombre', 'nombre', 'Nombre completo', 'text', 'name')
    );
    formulario.appendChild(
      crearEntrada('cliente-email', 'email', 'Email', 'email', 'email')
    );

    var acciones = document.createElement('div');
    acciones.className = 'campo__acciones';
    var boton = document.createElement('button');
    boton.type = 'submit';
    boton.className = 'boton boton--primario';
    boton.textContent = 'Registrar cliente';
    acciones.appendChild(boton);
    formulario.appendChild(acciones);

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      if (typeof alEnviar === 'function') {
        alEnviar(leer(formulario), formulario, evento);
      }
    });
    return formulario;
  }

  window.Libreria.clientesFormulario = {
    /**
     * Crea el formulario de alta. `opciones.alEnviar` recibe
     * (contexto, formulario, evento) en cada submit.
     */
    crear: function (opciones) {
      var ajustes = opciones || {};
      var formulario = armarFormulario(ajustes.alEnviar);
      return {
        formulario: formulario,
        leer: function () { return leer(formulario); },
        limpiar: function () { limpiar(formulario); }
      };
    }
  };
}());
