/*
 * Librería — Parcial 1.
 * Módulo: js/datos.js
 * Responsabilidad: estado en memoria (store) y operaciones de dominio.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria; no existe ninguna otra variable global
 * y el namespace no guarda estado de negocio (el estado es privado del módulo).
 *
 * El store es la única fuente de verdad de la aplicación: guarda las seis
 * colecciones del modelo (libros, clientes, ventas, editoriales, géneros y
 * autores) y avisa a los suscriptores cuando cambian (RN-EX-02).
 *
 * C-04: incorpora el seed (6 libros, 2 editoriales, 2 géneros, 3 autores y
 * 3 clientes), los identificadores estables con prefijo y correlativo de tres
 * dígitos (DD-06), el alta de libros, clientes y ventas, y la suscripción.
 *
 * Dependencia: usa los criterios de normalización de js/validaciones.js, que se
 * carga antes que este módulo. No hay ciclo: validaciones no conoce el store.
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};

  /* Prefijos de los identificadores (DD-06). */
  var PREFIJOS = {
    libros: 'LIB',
    clientes: 'CLI',
    ventas: 'VEN',
    renglones: 'REN'
  };

  /*
   * Seed inicial (RN-DAT-02). Los precios de LIB-001 y LIB-002 reproducen el
   * caso manual nº 5: dos unidades a 1500 y una a 2000 dan un total de 5000.
   * LIB-002 y LIB-005 van sin género para ejercitar la etiqueta «Sin clasificar».
   */
  var SEMILLA = {
    editoriales: [
      { id: 'EDI-001', nombre: 'Editorial Aurora' },
      { id: 'EDI-002', nombre: 'Editorial del Río' }
    ],
    generos: [
      { id: 'GEN-001', nombre: 'Novela' },
      { id: 'GEN-002', nombre: 'Ensayo' }
    ],
    autores: [
      { id: 'AUT-001', nombre: 'Elena Marchetti' },
      { id: 'AUT-002', nombre: 'Joaquín Buffarini' },
      { id: 'AUT-003', nombre: 'Rocío Sandoval' }
    ],
    libros: [
      {
        id: 'LIB-001',
        titulo: 'El faro de las salinas',
        isbn: '978-8001-0001-1',
        isbnNorm: '978800100011',
        precio: 1500,
        editorialId: 'EDI-001',
        generoId: 'GEN-001',
        autorIds: ['AUT-001']
      },
      {
        id: 'LIB-002',
        titulo: 'Cuentos del delta',
        isbn: '978-8001-0002-2',
        isbnNorm: '978800100022',
        precio: 2000,
        editorialId: 'EDI-002',
        generoId: null,
        autorIds: ['AUT-002', 'AUT-003']
      },
      {
        id: 'LIB-003',
        titulo: 'Manual de cartografía',
        isbn: '978-8001-0003-3',
        isbnNorm: '978800100033',
        precio: 2500,
        editorialId: 'EDI-001',
        generoId: 'GEN-002',
        autorIds: ['AUT-003']
      },
      {
        id: 'LIB-004',
        titulo: 'La casa de los vientos',
        isbn: '978-8001-0004-4',
        isbnNorm: '978800100044',
        precio: 1800,
        editorialId: 'EDI-002',
        generoId: 'GEN-001',
        autorIds: ['AUT-001', 'AUT-002']
      },
      {
        id: 'LIB-005',
        titulo: 'Notas de un viajero',
        isbn: '978-8001-0005-5',
        isbnNorm: '978800100055',
        precio: 1200,
        editorialId: 'EDI-001',
        generoId: null,
        autorIds: ['AUT-002']
      },
      {
        id: 'LIB-006',
        titulo: 'Atlas de lo imaginado',
        isbn: '978-8001-0006-6',
        isbnNorm: '978800100066',
        precio: 3200,
        editorialId: 'EDI-002',
        generoId: 'GEN-002',
        autorIds: ['AUT-001']
      }
    ],
    clientes: [
      {
        id: 'CLI-001',
        nombre: 'Ana Beatriz Ferrer',
        email: 'ana.ferrer@example.com',
        emailNorm: 'ana.ferrer@example.com'
      },
      {
        id: 'CLI-002',
        nombre: 'Carlos Hernán Medina',
        email: 'carlos.medina@example.com',
        emailNorm: 'carlos.medina@example.com'
      },
      {
        id: 'CLI-003',
        nombre: 'Lucía Torres',
        email: 'lucia.torres@example.com',
        emailNorm: 'lucia.torres@example.com'
      }
    ],
    ventas: []
  };

  /* Estado privado del módulo: la única fuente de verdad. */
  var estado = {
    libros: [],
    clientes: [],
    ventas: [],
    editoriales: [],
    generos: [],
    autores: []
  };

  var oyentes = [];

  /** Copia profunda de un valor JSON. */
  function copiar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  /** Texto recortado de un valor cualquiera. */
  function texto(valor) {
    if (valor === null || valor === undefined) {
      return '';
    }
    return String(valor).trim();
  }

  /** Compara dos textos de forma estable para el español. */
  function compararTexto(a, b) {
    var x = texto(a);
    var y = texto(b);
    if (x === y) {
      return 0;
    }
    return x.localeCompare(y, 'es');
  }

  /** Identificador correlativo: máximo existente + 1, con tres dígitos (DD-06). */
  function siguienteId(prefijo, coleccion) {
    var maximo = 0;
    (coleccion || []).forEach(function (item) {
      if (!item || typeof item.id !== 'string') {
        return;
      }
      var coincidencia = new RegExp('^' + prefijo + '-(\\d+)$').exec(item.id);
      if (!coincidencia) {
        return;
      }
      var valor = parseInt(coincidencia[1], 10);
      if (Number.isFinite(valor) && valor > maximo) {
        maximo = valor;
      }
    });
    return prefijo + '-' + String(maximo + 1).padStart(3, '0');
  }

  /** Busca un registro por id dentro de una colección. */
  function buscar(coleccion, id) {
    var clave = texto(id);
    if (clave === '') {
      return null;
    }
    for (var i = 0; i < coleccion.length; i += 1) {
      if (coleccion[i] && coleccion[i].id === clave) {
        return coleccion[i];
      }
    }
    return null;
  }

  /** Ordena por texto ascendente y desempata por id. */
  function porTexto(campo) {
    return function (a, b) {
      var diferencia = compararTexto(a[campo], b[campo]);
      if (diferencia !== 0) {
        return diferencia;
      }
      return compararTexto(a.id, b.id);
    };
  }

  /** Ordena por fecha descendente y desempata por id descendente (SU-03). */
  function porFechaDescendente(a, b) {
    var fa = texto(a.fecha);
    var fb = texto(b.fecha);
    if (fa !== fb) {
      return fa < fb ? 1 : -1;
    }
    return compararTexto(b.id, a.id);
  }

  /** Avisa a los suscriptores; un oyente con error no rompe el store. */
  function notificar() {
    oyentes.slice().forEach(function (oyente) {
      try {
        oyente();
      } catch (error) {
        /* Un oyente roto no puede dejar el store a medias. */
      }
    });
  }

  /** Reemplaza el estado completo y avisa a los suscriptores. */
  function cargarEstado(colecciones) {
    var entrada = colecciones || {};
    estado.libros = copiar(entrada.libros || []);
    estado.clientes = copiar(entrada.clientes || []);
    estado.ventas = copiar(entrada.ventas || []);
    estado.editoriales = copiar(entrada.editoriales || []);
    estado.generos = copiar(entrada.generos || []);
    estado.autores = copiar(entrada.autores || []);
    notificar();
    return estado;
  }

  /** Alta de libro: asigna id, normaliza el ISBN y rechaza duplicados. */
  function agregarLibro(libro) {
    if (!libro || typeof libro !== 'object') {
      return null;
    }
    var reglas = window.Libreria.validaciones;
    var isbnNorm = reglas.normalizarIsbn(libro.isbn);
    if (isbnNorm === '') {
      return null;
    }
    var duplicado = estado.libros.some(function (existente) {
      var referencia =
        existente.isbnNorm && existente.isbnNorm !== ''
          ? existente.isbnNorm
          : reglas.normalizarIsbn(existente.isbn);
      return referencia === isbnNorm;
    });
    if (duplicado) {
      return null;
    }

    var registro = copiar(libro);
    var id = texto(registro.id);
    registro.id = id !== '' && !buscar(estado.libros, id) ? id : siguienteId(PREFIJOS.libros, estado.libros);
    registro.titulo = texto(registro.titulo);
    registro.isbn = texto(registro.isbn);
    registro.isbnNorm = isbnNorm;
    registro.precio = Number(registro.precio);
    if (!Number.isFinite(registro.precio) || registro.precio <= 0) {
      return null;
    }
    registro.editorialId = texto(registro.editorialId);
    registro.generoId = registro.generoId ? texto(registro.generoId) : null;
    registro.autorIds = Array.isArray(registro.autorIds) ? registro.autorIds.slice() : [];

    estado.libros.push(registro);
    notificar();
    return registro;
  }

  /** Alta de cliente: asigna id, normaliza el email y rechaza duplicados. */
  function agregarCliente(cliente) {
    if (!cliente || typeof cliente !== 'object') {
      return null;
    }
    var reglas = window.Libreria.validaciones;
    var emailNorm = reglas.normalizarEmail(cliente.email);
    if (emailNorm === '') {
      return null;
    }
    var duplicado = estado.clientes.some(function (existente) {
      var referencia =
        existente.emailNorm && existente.emailNorm !== ''
          ? existente.emailNorm
          : reglas.normalizarEmail(existente.email);
      return referencia === emailNorm;
    });
    if (duplicado) {
      return null;
    }

    var registro = copiar(cliente);
    var id = texto(registro.id);
    registro.id =
      id !== '' && !buscar(estado.clientes, id) ? id : siguienteId(PREFIJOS.clientes, estado.clientes);
    registro.nombre = texto(registro.nombre);
    registro.email = texto(registro.email);
    registro.emailNorm = emailNorm;

    estado.clientes.push(registro);
    notificar();
    return registro;
  }

  /**
   * Alta de venta: asigna id y fecha, identifica los renglones y calcula los
   * subtotales y el total a partir de los importes ya congelados (RN-VEN-04).
   * El precio unitario NO se vuelve a leer del catálogo (RN-VEN-07).
   */
  function agregarVenta(venta) {
    if (!venta || typeof venta !== 'object') {
      return null;
    }
    var renglones = Array.isArray(venta.renglones) ? venta.renglones : [];
    if (renglones.length === 0) {
      return null;
    }
    var reglas = window.Libreria.validaciones;

    var registro = copiar(venta);
    var id = texto(registro.id);
    registro.id =
      id !== '' && !buscar(estado.ventas, id) ? id : siguienteId(PREFIJOS.ventas, estado.ventas);
    registro.fecha = texto(registro.fecha) || new Date().toISOString();
    registro.clienteId = texto(registro.clienteId);
    registro.clienteNombre = texto(registro.clienteNombre);

    var usados = {};
    var contador = 0;
    registro.renglones = renglones.map(function (renglon) {
      var copia = copiar(renglon);
      var idRenglon = texto(copia.id);
      if (idRenglon === '' || usados[idRenglon]) {
        do {
          contador += 1;
          idRenglon = PREFIJOS.renglones + '-' + String(contador).padStart(3, '0');
        } while (usados[idRenglon]);
      }
      usados[idRenglon] = true;
      copia.id = idRenglon;
      copia.cantidad = Number(copia.cantidad);
      copia.precioUnitario = Number(copia.precioUnitario);
      copia.subtotal = reglas.calcularSubtotal(copia);
      return copia;
    });

    registro.total = reglas.calcularTotal(registro.renglones);

    estado.ventas.push(registro);
    notificar();
    return registro;
  }

  window.Libreria.datos = {
    /**
     * Copia profunda de la semilla inicial. El llamador puede modificarla sin
     * afectar al store.
     */
    semilla: function () {
      return copiar(SEMILLA);
    },

    /**
     * Reemplaza el estado del store con las colecciones dadas y avisa a los
     * suscriptores. Es el punto de entrada de la hidratación (C-07).
     */
    cargar: function (colecciones) {
      return cargarEstado(colecciones);
    },

    /**
     * Vuelve a cargar la semilla en memoria.
     */
    restablecer: function () {
      return cargarEstado(SEMILLA);
    },

    /** Libros ordenados por título ascendente (SU-02). */
    listarLibros: function () {
      return estado.libros.slice().sort(porTexto('titulo'));
    },

    /** Editoriales ordenadas por nombre. */
    listarEditoriales: function () {
      return estado.editoriales.slice().sort(porTexto('nombre'));
    },

    /** Géneros ordenados por nombre. */
    listarGeneros: function () {
      return estado.generos.slice().sort(porTexto('nombre'));
    },

    /** Autores ordenados por nombre. */
    listarAutores: function () {
      return estado.autores.slice().sort(porTexto('nombre'));
    },

    /** Clientes ordenados por nombre ascendente. */
    listarClientes: function () {
      return estado.clientes.slice().sort(porTexto('nombre'));
    },

    /** Ventas ordenadas de más reciente a más antigua (SU-03). */
    listarVentas: function () {
      return estado.ventas.slice().sort(porFechaDescendente);
    },

    /** Libro con el identificador dado, o null si no existe. */
    obtenerLibro: function (id) {
      return buscar(estado.libros, id);
    },

    /** Cliente con el identificador dado, o null si no existe. */
    obtenerCliente: function (id) {
      return buscar(estado.clientes, id);
    },

    /** Venta con el identificador dado, o null si no existe. */
    obtenerVenta: function (id) {
      return buscar(estado.ventas, id);
    },

    /** Editorial con el identificador dado, o null si no existe. */
    obtenerEditorial: function (id) {
      return buscar(estado.editoriales, id);
    },

    /** Género con el identificador dado, o null si no existe. */
    obtenerGenero: function (id) {
      return buscar(estado.generos, id);
    },

    /** Autor con el identificador dado, o null si no existe. */
    obtenerAutor: function (id) {
      return buscar(estado.autores, id);
    },

    /** Agrega un libro al store y notifica a los suscriptores. */
    agregarLibro: agregarLibro,

    /** Agrega un cliente al store y notifica a los suscriptores. */
    agregarCliente: agregarCliente,

    /** Agrega una venta al store y notifica a los suscriptores. */
    agregarVenta: agregarVenta,

    /**
     * Registra un oyente que se avisa cuando cambia el store.
     * Devuelve la función que lo da de baja.
     */
    suscribir: function (oyente) {
      if (typeof oyente !== 'function') {
        return function () {};
      }
      oyentes.push(oyente);
      return function () {
        var indice = oyentes.indexOf(oyente);
        if (indice >= 0) {
          oyentes.splice(indice, 1);
        }
      };
    }
  };
}());
