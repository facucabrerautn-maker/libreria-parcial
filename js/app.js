/*
 * Librería — Parcial 1.
 * Módulo: js/app.js
 * Responsabilidad: bootstrap, resolución de ruta por hash y montaje de la vista activa.
 * Scripts clásicos con IIFE (Chrome bloquea los módulos ES bajo file:// por CORS);
 * el contrato se publica en el namespace único window.Libreria.
 * C-02: resuelve el hash contra RUTAS, normaliza la URL, monta la vista, marca el
 * enlace activo y mueve el foco. La siembra y la persistencia llegan en C-04 y C-07.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  /* Tabla literal de rutas: nombre de ruta -> identificador de la sección. */
  var RUTAS = {
    catalogo: 'vista-catalogo',
    libros: 'vista-libros',
    clientes: 'vista-clientes',
    ventas: 'vista-ventas',
    historial: 'vista-historial'
  };

  var RUTA_INICIAL = 'catalogo';
  var SELECTOR_ENLACES = 'nav a[href]';
  var SELECTOR_REGION = '.region-mensajes';
  var CLASE_REGION = 'region-mensajes';
  var CLASE_ACTIVA = 'enlace-nav--activo';

  /* Estado privado: ruta montada y si el arranque ya corrió. */
  var rutaMontada = null;
  var arranqueHecho = false;

  /* Función pura: resuelve un hash contra RUTAS sin leer location ni el DOM. */
  function resolverRuta(hash) {
    var texto = typeof hash === 'string' ? hash : '';
    var sinAlmohadilla = texto.charAt(0) === '#' ? texto.slice(1) : texto;
    var nombre = sinAlmohadilla.replace(/^\/+/, '').toLowerCase();

    if (Object.prototype.hasOwnProperty.call(RUTAS, nombre)) {
      return { nombre: nombre, seccion: RUTAS[nombre], desconocida: false };
    }

    return { nombre: RUTA_INICIAL, seccion: RUTAS[RUTA_INICIAL], desconocida: true };
  }

  /* Devuelve la sección de la vista pedida, o null si el documento no la tiene. */
  function obtenerSeccion(nombreVista, contenedor) {
    if (contenedor && contenedor.id === RUTAS[nombreVista]) {
      return contenedor;
    }
    return document.getElementById(RUTAS[nombreVista]);
  }

  /*
   * Desmonta una sección: quita el contenido que renderizó la vista y limpia su
   * región, pero conserva el h1 y la región declarados en el documento.
   */
  function vaciarContenido(seccion) {
    var nodos = Array.prototype.slice.call(seccion.childNodes);
    nodos.forEach(function (nodo) {
      if (nodo.nodeType === 1 && nodo.tagName === 'H1') {
        return;
      }
      if (nodo.nodeType === 1 && nodo.classList.contains(CLASE_REGION)) {
        while (nodo.firstChild) {
          nodo.removeChild(nodo.firstChild);
        }
        return;
      }
      seccion.removeChild(nodo);
    });
  }

  /* Pone aria-current y la clase de estado activo solo en el enlace de la vista. */
  function marcarEnlaceActivo(nombreVista) {
    var enlaces = document.querySelectorAll(SELECTOR_ENLACES);
    Array.prototype.forEach.call(enlaces, function (enlace) {
      var href = enlace.getAttribute('href') || '';
      var nombre = href.charAt(0) === '#' ? href.slice(1).replace(/^\/+/, '') : '';
      if (nombre === nombreVista) {
        enlace.setAttribute('aria-current', 'page');
        enlace.classList.add(CLASE_ACTIVA);
      } else {
        enlace.removeAttribute('aria-current');
        enlace.classList.remove(CLASE_ACTIVA);
      }
    });
  }

  /*
   * Monta la vista pedida: desmonta la anterior, delega el render en el módulo de
   * la vista, marca el enlace activo y mueve el foco al h1 (respaldo en main).
   */
  function montarVista(nombreVista, contenedor) {
    var seccion = obtenerSeccion(nombreVista, contenedor);
    if (!seccion) {
      return null;
    }

    var secciones = document.querySelectorAll('main section');
    Array.prototype.forEach.call(secciones, function (otra) {
      vaciarContenido(otra);
      otra.hidden = true;
    });

    vaciarContenido(seccion);
    seccion.hidden = false;

    var modulo = (window.Libreria.vistas || {})[nombreVista];
    if (modulo && typeof modulo.render === 'function') {
      var fragmento = modulo.render(seccion);
      if (fragmento && fragmento.childNodes && fragmento.childNodes.length) {
        seccion.appendChild(fragmento);
      }
    }

    marcarEnlaceActivo(nombreVista);
    rutaMontada = nombreVista;

    var encabezado = seccion.querySelector('h1');
    if (!window.Libreria.ui.moverFoco(encabezado)) {
      window.Libreria.ui.moverFoco(document.querySelector('main'));
    }

    return seccion;
  }

  /* Redacta el aviso visible de ruta desconocida o ausente. */
  function textoAvisoRuta(hashSolicitado) {
    var limpio = typeof hashSolicitado === 'string' ? hashSolicitado : '';
    if (limpio === '' || limpio === '#' || limpio === '#/') {
      return 'No se indicó ninguna ruta: se muestra la vista Catálogo.';
    }
    return 'La ruta solicitada «' + limpio +
      '» no existe: se muestra la vista Catálogo.';
  }

  /* Escribe el aviso visible de ruta desconocida en la región del catálogo. */
  function avisarRutaDesconocida(hashSolicitado) {
    var seccion = document.getElementById(RUTAS[RUTA_INICIAL]);
    var region = seccion ? seccion.querySelector(SELECTOR_REGION) : null;
    if (!region) {
      return null;
    }
    return window.Libreria.ui.mostrarMensaje(region, textoAvisoRuta(hashSolicitado), 'aviso');
  }

  /*
   * Aplica el hash pedido: normaliza la URL, monta la vista si corresponde y
   * avisa cuando la ruta no existe.
   */
  function aplicarRuta(hashSolicitado) {
    var ruta = resolverRuta(hashSolicitado);
    var hashEsperado = '#/' + ruta.nombre;

    if (hashSolicitado !== hashEsperado) {
      location.replace(hashEsperado);
    }

    if (ruta.nombre !== rutaMontada) {
      montarVista(ruta.nombre);
    }

    if (ruta.desconocida) {
      avisarRutaDesconocida(hashSolicitado);
    }

    return ruta.nombre;
  }

  /* Única escucha global: el cambio de ruta por hash. */
  function alCambiarHash() {
    aplicarRuta(location.hash);
  }

  /* Punto de entrada: ruta inicial, escucha de hashchange y montaje. */
  function iniciar() {
    if (arranqueHecho) {
      return rutaMontada;
    }
    arranqueHecho = true;

    window.addEventListener('hashchange', alCambiarHash);

    return aplicarRuta(location.hash);
  }

  window.Libreria.app = {
    iniciar: iniciar,
    montarVista: montarVista
  };

  window.Libreria.app.iniciar();
}());
