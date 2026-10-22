/*
 * Librería — Parcial 1.
 * Módulo: js/storage.js
 * Responsabilidad: lectura y escritura en el almacenamiento local del navegador
 * (Web Storage API) con siembra condicional.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria; no existe ninguna otra variable global.
 *
 * C-07: seis claves con el namespace del proyecto (libreria.*), una por
 * colección. La siembra es CONDICIONAL: una clave que ya existe nunca se
 * vuelve a sembrar, así el usuario no pierde lo que cargó ni ve duplicados
 * (RN-EX-01). Todo acceso a localStorage va dentro de try/catch porque la cuota
 * puede agotarse y el navegador puede bloquear el almacenamiento (RN-EX-05).
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  /* Una clave por colección, con el namespace del proyecto (P-02). */
  var CLAVES = {
    libros: 'libreria.libros',
    clientes: 'libreria.clientes',
    ventas: 'libreria.ventas',
    editoriales: 'libreria.editoriales',
    generos: 'libreria.generos',
    autores: 'libreria.autores'
  };

  /* Clave auxiliar para comprobar si se puede escribir. */
  var CLAVE_PRUEBA = 'libreria.__prueba';

  /** Devuelve el almacenamiento local, o null si el navegador no lo expone. */
  function obtenerAlmacenamiento() {
    try {
      return window.localStorage || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Indica si el almacenamiento local está disponible y admite escrituras.
   * Si la cuota está agotada o el almacenamiento está bloqueado, devuelve false.
   */
  function disponible() {
    var local = obtenerAlmacenamiento();
    if (!local) {
      return false;
    }
    try {
      local.setItem(CLAVE_PRUEBA, '1');
      local.removeItem(CLAVE_PRUEBA);
      return true;
    } catch (error) {
      return false;
    }
  }

  /** Indica si una clave ya existe en el almacenamiento. */
  function existe(clave) {
    var local = obtenerAlmacenamiento();
    if (!local) {
      return false;
    }
    try {
      return local.getItem(clave) !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Lee una colección. Un valor ausente, corrupto o que no sea una lista
   * devuelve una lista vacía en lugar de romper la aplicación.
   */
  function leerColeccion(clave) {
    var local = obtenerAlmacenamiento();
    if (!local) {
      return [];
    }
    var bruto = null;
    try {
      bruto = local.getItem(clave);
    } catch (error) {
      return [];
    }
    if (bruto === null || bruto === undefined || bruto === '') {
      return [];
    }
    try {
      var valor = JSON.parse(bruto);
      return Array.isArray(valor) ? valor : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Escribe una colección. Devuelve false si no se pudo escribir (por ejemplo,
   * por cuota agotada) para que la aplicación pueda avisar al usuario.
   */
  function guardar(clave, valor) {
    var local = obtenerAlmacenamiento();
    if (!local) {
      return false;
    }
    var serializado = null;
    try {
      serializado = JSON.stringify(valor);
    } catch (error) {
      return false;
    }
    try {
      local.setItem(clave, serializado);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Lee las seis colecciones del almacenamiento.
   */
  function leerTodo() {
    return {
      libros: leerColeccion(CLAVES.libros),
      clientes: leerColeccion(CLAVES.clientes),
      ventas: leerColeccion(CLAVES.ventas),
      editoriales: leerColeccion(CLAVES.editoriales),
      generos: leerColeccion(CLAVES.generos),
      autores: leerColeccion(CLAVES.autores)
    };
  }

  /**
   * Siembra condicional y entrega al store las colecciones resultantes.
   * Las claves que ya existen se respetan tal cual; las que faltan se siembran
   * con el seed inicial. Si el almacenamiento no está disponible, el store
   * queda con el seed solo en memoria y la aplicación sigue funcionando.
   */
  function hidratar() {
    var datos = window.Libreria.datos;
    var semilla = datos ? datos.semilla() : null;
    var leidas = leerTodo();
    var resultado = {};

    Object.keys(CLAVES).forEach(function (coleccion) {
      var clave = CLAVES[coleccion];
      if (existe(clave)) {
        resultado[coleccion] = leidas[coleccion];
        return;
      }
      var valores = semilla && semilla[coleccion] ? semilla[coleccion] : [];
      guardar(clave, valores);
      resultado[coleccion] = valores;
    });

    if (datos) {
      datos.cargar(resultado);
    }
    return resultado;
  }

  /** Persiste la colección de libros. */
  function guardarLibros(libros) {
    return guardar(CLAVES.libros, libros);
  }

  /** Persiste la colección de clientes. */
  function guardarClientes(clientes) {
    return guardar(CLAVES.clientes, clientes);
  }

  /** Persiste la colección de ventas. */
  function guardarVentas(ventas) {
    return guardar(CLAVES.ventas, ventas);
  }

  /**
   * Persiste las tres colecciones que la aplicación puede modificar.
   * Devuelve false si alguna escritura falló.
   */
  function guardarTodo() {
    var datos = window.Libreria.datos;
    if (!datos) {
      return false;
    }
    var ok = guardarLibros(datos.listarLibros());
    var clientesOk = guardarClientes(datos.listarClientes());
    var ventasOk = guardarVentas(datos.listarVentas());
    return ok && clientesOk && ventasOk;
  }

  window.Libreria.storage = {
    /** Claves usadas por la aplicación, expuestas para diagnóstico. */
    claves: CLAVES,

    /** Indica si el almacenamiento local admite escrituras. */
    disponible: disponible,

    /** Lee las seis colecciones guardadas. */
    leerTodo: leerTodo,

    /** Siembra lo que falta y entrega las colecciones al store. */
    hidratar: hidratar,

    /** Persiste la colección de libros. */
    guardarLibros: guardarLibros,

    /** Persiste la colección de clientes. */
    guardarClientes: guardarClientes,

    /** Persiste la colección de ventas. */
    guardarVentas: guardarVentas,

    /** Persiste las tres colecciones modificables. */
    guardarTodo: guardarTodo
  };
}());
