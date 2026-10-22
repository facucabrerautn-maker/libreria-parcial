/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/libros-formulario.js
 * Responsabilidad: armar el formulario de alta, leer sus valores y limpiarlo.
 * C-09: selectores desde los datos locales; «Sin clasificar» usa value="".
 */
(function () {
  'use strict';
  window.Libreria = window.Libreria || {};

  var CLASE_CONTROL = 'control';
  var CLASE_AUTORES = 'control vista-libros__autores';

  function crearCampo(id, etiqueta, control, ayuda) {
    var campo = document.createElement('div');
    campo.className = 'campo';
    var label = document.createElement('label');
    label.className = 'campo__etiqueta';
    label.setAttribute('for', id);
    label.textContent = etiqueta;
    control.id = id;
    campo.appendChild(label);
    campo.appendChild(control);
    if (ayuda) {
      var textoAyuda = document.createElement('p');
      textoAyuda.className = 'campo__ayuda';
      textoAyuda.id = id + '-ayuda';
      textoAyuda.textContent = ayuda;
      campo.appendChild(textoAyuda);
      control.setAttribute('aria-describedby', textoAyuda.id);
    }
    return campo;
  }

  function crearEntrada(id, nombre, etiqueta, tipo, requerido, atributos) {
    var control = document.createElement('input');
    control.name = nombre;
    control.type = tipo;
    control.className = CLASE_CONTROL;
    if (requerido) { control.setAttribute('required', ''); }
    (atributos || []).forEach(function (atributo) {
      control.setAttribute(atributo[0], atributo[1]);
    });
    return { control: control, campo: crearCampo(id, etiqueta, control) };
  }

  function crearSelect(id, nombre, etiqueta, opciones, configuracion) {
    var config = configuracion || {};
    var control = document.createElement('select');
    control.name = nombre;
    control.className = config.multiple ? CLASE_AUTORES : CLASE_CONTROL;
    if (config.requerido) { control.setAttribute('required', ''); }
    if (config.multiple) { control.setAttribute('multiple', ''); }
    if (config.tamano) { control.setAttribute('size', String(config.tamano)); }
    (opciones || []).forEach(function (opcion) {
      var item = document.createElement('option');
      item.value = opcion.valor;
      item.textContent = opcion.texto;
      control.appendChild(item);
    });
    return { control: control, campo: crearCampo(id, etiqueta, control, config.ayuda) };
  }

  function opcionesEditoriales(datos) {
    var opciones = [{ valor: '', texto: 'Elegí una editorial' }];
    datos.listarEditoriales().forEach(function (editorial) {
      opciones.push({ valor: editorial.id, texto: editorial.nombre });
    });
    return opciones;
  }

  function opcionesGeneros(datos) {
    var opciones = [{ valor: '', texto: 'Sin clasificar' }];
    datos.listarGeneros().forEach(function (genero) {
      opciones.push({ valor: genero.id, texto: genero.nombre });
    });
    return opciones;
  }

  function opcionesAutores(datos) {
    return datos.listarAutores().map(function (autor) {
      return { valor: autor.id, texto: autor.nombre };
    });
  }

  function valorDe(formulario, nombre) {
    var control = formulario.querySelector('[name="' + nombre + '"]');
    if (!control) { return ''; }
    var valor = control.value;
    return valor === null || valor === undefined ? '' : String(valor).trim();
  }

  function autoresSeleccionados(formulario) {
    var select = formulario.querySelector('[name="autorIds"]');
    var ids = [];
    if (!select || !select.options) { return ids; }
    Array.prototype.forEach.call(select.options, function (opcion) {
      if (opcion.selected) { ids.push(opcion.value); }
    });
    return ids;
  }

  function leer(formulario) {
    var generoId = valorDe(formulario, 'generoId');
    return {
      titulo: valorDe(formulario, 'titulo'),
      isbn: valorDe(formulario, 'isbn'),
      precio: valorDe(formulario, 'precio'),
      editorialId: valorDe(formulario, 'editorialId'),
      generoId: generoId === '' ? null : generoId,
      autorIds: autoresSeleccionados(formulario)
    };
  }

  function limpiar(formulario) {
    ['titulo', 'isbn', 'precio', 'editorialId', 'generoId'].forEach(function (nombre) {
      var control = formulario.querySelector('[name="' + nombre + '"]');
      if (control) { control.value = ''; }
    });
    var select = formulario.querySelector('[name="autorIds"]');
    if (select && select.options) {
      Array.prototype.forEach.call(select.options, function (opcion) {
        opcion.selected = false;
      });
    }
  }

  function armarFormulario(datos, alEnviar) {
    var formulario = document.createElement('form');
    formulario.className = 'formulario vista-libros__formulario';
    // Los atributos HTML quedan como barrera declarativa; la validación con
    // mensajes por campo la resuelve validarLibro() en el submit.
    formulario.setAttribute('novalidate', '');

    var titulo = document.createElement('h2');
    titulo.className = 'formulario__titulo';
    titulo.textContent = 'Registrar libro';
    formulario.appendChild(titulo);

    formulario.appendChild(crearEntrada('libro-titulo', 'titulo', 'Título', 'text', true).campo);
    formulario.appendChild(crearEntrada('libro-isbn', 'isbn', 'ISBN', 'text', true).campo);
    formulario.appendChild(crearEntrada('libro-precio', 'precio', 'Precio', 'number', true, [
      ['min', '0.01'], ['step', '0.01'], ['inputmode', 'decimal']
    ]).campo);
    formulario.appendChild(crearSelect('libro-editorial', 'editorialId', 'Editorial',
      opcionesEditoriales(datos), { requerido: true }).campo);
    formulario.appendChild(crearSelect('libro-genero', 'generoId', 'Género',
      opcionesGeneros(datos), {}).campo);

    var autores = opcionesAutores(datos);
    formulario.appendChild(crearSelect('libro-autores', 'autorIds', 'Autores', autores, {
      multiple: true,
      requerido: true,
      tamano: Math.max(3, Math.min(autores.length || 3, 6)),
      ayuda: 'Usá Ctrl (o Cmd) para elegir más de un autor.'
    }).campo);

    var acciones = document.createElement('div');
    acciones.className = 'campo__acciones';
    var boton = document.createElement('button');
    boton.type = 'submit';
    boton.className = 'boton boton--primario';
    boton.textContent = 'Registrar libro';
    acciones.appendChild(boton);
    formulario.appendChild(acciones);

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      if (typeof alEnviar === 'function') { alEnviar(leer(formulario), formulario, evento); }
    });
    return formulario;
  }

  window.Libreria.librosFormulario = {
    crear: function (opciones) {
      var ajustes = opciones || {};
      var formulario = armarFormulario(window.Libreria.datos, ajustes.alEnviar);
      return {
        formulario: formulario,
        leer: function () { return leer(formulario); },
        limpiar: function () { limpiar(formulario); }
      };
    }
  };
}());
