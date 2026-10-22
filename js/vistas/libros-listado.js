/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/libros-listado.js
 * Responsabilidad: construir la tabla de libros registrados a partir del
 * store, resolviendo editorial, género y autores por id.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria.
 *
 * C-09: el listado no edita ni borra (IN-07); un libro sin género muestra
 * «Sin clasificar» y las relaciones inexistentes no rompen la tabla
 * (RN-DAT-04, RN-DAT-05).
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  var ENCABEZADOS = ['Título', 'ISBN', 'Editorial', 'Género', 'Autores', 'Precio'];
  var TEXTO_SIN_GENERO = 'Sin clasificar';
  var TEXTO_SIN_AUTORES = 'Sin autores';
  var TEXTO_SIN_EDITORIAL = 'Editorial desconocida';

  function texto(valor) {
    return valor === null || valor === undefined ? '' : String(valor);
  }

  function nombreEditorial(libro) {
    var datos = window.Libreria.datos;
    var editorial = datos ? datos.obtenerEditorial(libro.editorialId) : null;
    var nombre = editorial ? texto(editorial.nombre).trim() : '';
    return nombre === '' ? TEXTO_SIN_EDITORIAL : nombre;
  }

  function nombreGenero(libro) {
    if (!libro.generoId) {
      return TEXTO_SIN_GENERO;
    }
    var datos = window.Libreria.datos;
    var genero = datos ? datos.obtenerGenero(libro.generoId) : null;
    var nombre = genero ? texto(genero.nombre).trim() : '';
    return nombre === '' ? TEXTO_SIN_GENERO : nombre;
  }

  function nombresAutores(libro) {
    var datos = window.Libreria.datos;
    var ids = Array.isArray(libro.autorIds) ? libro.autorIds : [];
    var nombres = ids
      .map(function (id) {
        var autor = datos ? datos.obtenerAutor(id) : null;
        return autor ? texto(autor.nombre).trim() : '';
      })
      .filter(function (nombre) {
        return nombre !== '';
      });
    return nombres.length === 0 ? TEXTO_SIN_AUTORES : nombres.join(', ');
  }

  function fila(libro) {
    return [
      texto(libro.titulo),
      texto(libro.isbn),
      nombreEditorial(libro),
      nombreGenero(libro),
      nombresAutores(libro),
      window.Libreria.ui.formatearMonto(libro.precio)
    ];
  }

  window.Libreria.librosListado = {
    /**
     * Devuelve un fragmento con el título del listado y la tabla de libros.
     * La tabla sale del store ordenado por título (SU-02) y trae su estado
     * vacío cuando no hay libros.
     */
    crear: function () {
      var fragmento = document.createDocumentFragment();

      var titulo = document.createElement('h2');
      titulo.className = 'vista-libros__listado-titulo';
      titulo.textContent = 'Libros registrados';
      fragmento.appendChild(titulo);

      var libros = window.Libreria.datos.listarLibros();
      fragmento.appendChild(
        window.Libreria.ui.crearTabla(ENCABEZADOS, libros.map(fila), {
          claseTabla: 'tabla tabla-libros',
          vacia: 'Todavía no hay libros registrados.'
        })
      );

      return fragmento;
    }
  };
}());
