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
 *
 * C-05: la tabla se devuelve dentro de un contenedor con desplazamiento propio
 * (RN-ACC-04) y admite título y estado vacío; los errores de validación se
 * escriben junto al campo que falló y se le asocian con aria-invalid y
 * aria-describedby (RN-ACC-02, RN-ACC-05, RN-EX-03).
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

  /** Ejecuta un recorrido sobre cualquier lista de nodos (array o NodeList). */
  function recorrer(nodos, fn) {
    Array.prototype.forEach.call(nodos || [], fn);
  }

  /**
   * Escribe el mensaje de un error junto al control que falló y asocia el texto
   * al control con aria-invalid y aria-describedby (RN-ACC-05, RN-EX-03).
   */
  function marcarCampo(formulario, campo, mensaje, repetidos) {
    var control = formulario.querySelector('[name="' + campo + '"]');
    if (!control) {
      return null;
    }

    repetidos[campo] = (repetidos[campo] || 0) + 1;
    var id = repetidos[campo] > 1 ? 'error-' + campo + '-' + repetidos[campo] : 'error-' + campo;

    var texto = crear('p', mensaje, 'campo__error');
    texto.id = id;
    var envoltura = control.closest ? control.closest('.campo') : null;
    if (envoltura) {
      envoltura.appendChild(texto);
    } else if (control.parentNode) {
      control.parentNode.appendChild(texto);
    }

    control.setAttribute('aria-invalid', 'true');
    var previo = control.getAttribute('aria-describedby');
    control.setAttribute('aria-describedby', previo ? previo + ' ' + id : id);
    return texto;
  }

  window.Libreria.ui = {
    /** Crea un elemento con texto como contenido y, opcionalmente, una clase. */
    crearElemento: function (etiqueta, texto, clase) {
      return crear(etiqueta, texto, clase);
    },

    /**
     * Crea una tabla con encabezados de columna y filas de celdas de texto.
     * Devuelve el contenedor `.tabla-contenedor`, que scrola en horizontal si
     * la tabla no entra (RN-ACC-04). Con `opciones.vacia` y sin filas, muestra
     * el estado vacío dentro de la tabla.
     */
    crearTabla: function (encabezados, filas, opciones) {
      var config = opciones || {};
      var titulos = encabezados || [];
      var contenido = filas || [];

      var contenedor = document.createElement('div');
      contenedor.className = 'tabla-contenedor';

      var tabla = document.createElement('table');
      tabla.className = config.claseTabla ? config.claseTabla : 'tabla';

      if (config.titulo) {
        var leyenda = document.createElement('caption');
        leyenda.textContent = aTexto(config.titulo);
        tabla.appendChild(leyenda);
      }

      var cabecera = document.createElement('thead');
      var filaCabecera = document.createElement('tr');
      titulos.forEach(function (titulo) {
        var celda = crear('th', titulo);
        celda.setAttribute('scope', 'col');
        filaCabecera.appendChild(celda);
      });
      cabecera.appendChild(filaCabecera);
      tabla.appendChild(cabecera);

      var cuerpo = document.createElement('tbody');
      if (contenido.length === 0) {
        if (config.vacia) {
          var filaVacia = document.createElement('tr');
          var celdaVacia = crear('td', config.vacia, 'vacia');
          celdaVacia.setAttribute('colspan', String(titulos.length || 1));
          filaVacia.appendChild(celdaVacia);
          cuerpo.appendChild(filaVacia);
        }
      } else {
        contenido.forEach(function (fila) {
          var filaCuerpo = document.createElement('tr');
          (fila || []).forEach(function (valor) {
            filaCuerpo.appendChild(crear('td', valor));
          });
          cuerpo.appendChild(filaCuerpo);
        });
      }
      tabla.appendChild(cuerpo);

      contenedor.appendChild(tabla);
      return contenedor;
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

    /**
     * Inserta la lista de errores de validación. Cada error queda junto a su
     * campo (dentro de `.campo`) y asociado con aria-invalid y aria-describedby.
     * Con `opciones.formulario` se marca además el control que falló.
     */
    mostrarErrores: function (contenedor, errores, opciones) {
      var config = opciones || {};
      var formulario = config.formulario || null;
      var repetidos = {};

      var lista = document.createElement('ul');
      lista.className = 'lista-errores';

      (errores || []).forEach(function (error) {
        var campo = error && error.campo ? aTexto(error.campo) : '';
        var mensaje = error && error.mensaje !== undefined ? aTexto(error.mensaje) : aTexto(error);
        var item = document.createElement('li');
        item.setAttribute('data-campo', campo);
        item.textContent = mensaje;
        lista.appendChild(item);
        if (formulario && campo !== '') {
          marcarCampo(formulario, campo, mensaje, repetidos);
        }
      });

      if (contenedor && typeof contenedor.appendChild === 'function') {
        contenedor.appendChild(lista);
      }
      return lista;
    },

    /**
     * Borra los mensajes de error anteriores y desmarca los controles, para
     * poder volver a validar sin arrastrar el estado del intento previo.
     */
    limpiarErrores: function (contenedor, formulario) {
      var ids = [];
      if (formulario) {
        recorrer(formulario.querySelectorAll('.campo__error'), function (nodo) {
          var id = nodo.getAttribute('id');
          if (id) {
            ids.push(id);
          }
          if (nodo.parentNode) {
            nodo.parentNode.removeChild(nodo);
          }
        });
        recorrer(formulario.querySelectorAll('[aria-invalid="true"]'), function (control) {
          control.removeAttribute('aria-invalid');
          var descrito = control.getAttribute('aria-describedby');
          if (!descrito) {
            return;
          }
          var quedan = descrito.split(/\s+/).filter(function (token) {
            return token !== '' && ids.indexOf(token) === -1;
          });
          if (quedan.length > 0) {
            control.setAttribute('aria-describedby', quedan.join(' '));
          } else {
            control.removeAttribute('aria-describedby');
          }
        });
      }
      if (contenedor && typeof contenedor.querySelectorAll === 'function') {
        recorrer(contenedor.querySelectorAll('.lista-errores'), function (nodo) {
          if (nodo.parentNode) {
            nodo.parentNode.removeChild(nodo);
          }
        });
      }
      return true;
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
      var primerError = contenedor.querySelector('[aria-invalid="true"]');
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
