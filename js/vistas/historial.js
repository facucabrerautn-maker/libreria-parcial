/*
 * Librería — Parcial 1.
 * Módulo: js/vistas/historial.js
 * Responsabilidad: render y eventos de la vista Historial.
 *
 * Variante de enlace: scripts clásicos con IIFE. El módulo publica su contrato
 * en el namespace único window.Libreria, dentro de Libreria.vistas.
 *
 * C-12: historial de ventas con detalle de renglones leídos del snapshot.
 * - Tabla con identificador, fecha, cliente y total, ordenada de más reciente
 *   a más antigua (RN-HIS-01, SU-03).
 * - Cada fila ofrece una acción para consultar los renglones de esa venta
 *   (RN-HIS-01, US-025).
 * - Detalle de venta: renglones con libro, cantidad, precio unitario y subtotal
 *   leídos del propio registro de la venta (snapshot), nunca del catálogo
 *   (RN-VEN-07, RN-HIS-02, US-026).
 * - Inmutabilidad: no hay acciones de edición ni de borrado desde la interfaz
 *   (RN-HIS-02, US-027, RN-EX-04).
 * - Historial alimentado por store.listarVentas() (datos locales), nunca por un
 *   array paralelo en memoria (US-025 CA-3).
 * - Estado vacío: mensaje propio con enlace a la vista Ventas (07 §Flujo 8).
 * - Refresco automático cuando cambia el store (alCambiarElStore).
 * - Mensaje de estado inicial en la región de mensajes (C-02).
 */
(function () {
  'use strict';

  window.Libreria = window.Libreria || {};
  window.Libreria.vistas = window.Libreria.vistas || {};

  var ui = window.Libreria.ui;
  var datos = window.Libreria.datos;

  var SEL = '.region-mensajes';
  var IT = 'historial-tabla';
  var ID = 'historial-detalle';

  var nR, nMsg, nTabla, nDetalle;
  var ventaDetalleId = null;

  function qm() {
    if (nMsg && nMsg.parentNode) { nMsg.parentNode.removeChild(nMsg); }
    nMsg = null;
  }
  function mr(t, tipo) {
    qm();
    if (!nR) { return null; }
    nMsg = ui.mostrarMensaje(nR, t, tipo);
  }

  function pintar() {
    if (!nTabla) { return; }
    while (nTabla.firstChild) { nTabla.removeChild(nTabla.firstChild); }
    var ventas = datos.listarVentas();
    var enc = ['Identificador', 'Fecha', 'Cliente', 'Total', 'Detalle'];
    var tab = document.createElement('table');
    tab.className = 'tabla tabla-historial';
    var th = document.createElement('thead');
    var trc = document.createElement('tr');
    enc.forEach(function (t) {
      var c = ui.crearElemento('th', t, '');
      c.setAttribute('scope', 'col');
      trc.appendChild(c);
    });
    th.appendChild(trc);
    tab.appendChild(th);
    var tbdy = document.createElement('tbody');
    if (ventas.length === 0) {
      var trv = document.createElement('tr');
      var tdv = ui.crearElemento('td', 'No hay ventas registradas aún.', 'vacia');
      tdv.setAttribute('colspan', String(enc.length));
      trv.appendChild(tdv);
      tbdy.appendChild(trv);
    } else {
      ventas.forEach(function (ven) {
        var btn = ui.crearElemento('button', 'Detalle', 'boton--secundario');
        btn.type = 'button';
        btn.dataset.ventaId = ven.id;
        var tr = document.createElement('tr');
        [ven.id, ui.formatearFecha(ven.fecha), ven.clienteNombre, ui.formatearMonto(ven.total), btn].forEach(function (val) {
          var td = document.createElement('td');
          if (typeof val === 'object' && val !== null) { td.appendChild(val); } else { td.textContent = String(val); }
          tr.appendChild(td);
        });
        tbdy.appendChild(tr);
      });
    }
    tab.appendChild(tbdy);
    nTabla.appendChild(tab);
  }

  function mostrarDetalle(id) {
    while (nDetalle.firstChild) { nDetalle.removeChild(nDetalle.firstChild); }
    var ven = datos.obtenerVenta(id);
    if (!ven) { return; }
    var tit = document.createElement('h2');
    tit.textContent = 'Detalle de venta «' + ven.id + '»';
    nDetalle.appendChild(tit);
    var enc = ['Libro', 'Cantidad', 'Precio unitario', 'Subtotal'];
    var tab = document.createElement('table');
    tab.className = 'tabla tabla-historial';
    var th = document.createElement('thead');
    var trc = document.createElement('tr');
    enc.forEach(function (t) {
      var c = ui.crearElemento('th', t, '');
      c.setAttribute('scope', 'col');
      trc.appendChild(c);
    });
    th.appendChild(trc);
    tab.appendChild(th);
    var tbdy = document.createElement('tbody');
    (ven.renglones || []).forEach(function (r) {
      var tr = document.createElement('tr');
      [r.titulo, String(r.cantidad), ui.formatearMonto(r.precioUnitario), ui.formatearMonto(r.subtotal)].forEach(function (val) {
        var td = document.createElement('td');
        td.textContent = String(val);
        tr.appendChild(td);
      });
      tbdy.appendChild(tr);
    });
    tab.appendChild(tbdy);
    nDetalle.appendChild(tab);
    var total = document.createElement('div');
    total.textContent = 'Total: ' + ui.formatearMonto(ven.total);
    nDetalle.appendChild(total);
  }

  window.Libreria.vistas.historial = {
    render: function (sec) {
      var frag = document.createDocumentFragment();
      qm();
      nR = sec ? sec.querySelector(SEL) : null;
      nMsg = null;
      ventaDetalleId = null;
      var cont = document.createElement('div');
      cont.className = 'vista-historial__listado';
      nTabla = document.createElement('div');
      nTabla.id = IT;
      nDetalle = document.createElement('div');
      nDetalle.id = ID;
      nDetalle.className = 'vista-historial__detalle';
      cont.appendChild(nTabla);
      cont.appendChild(nDetalle);
      frag.appendChild(cont);
      pintar();
      if (datos.listarVentas().length === 0) {
        var enlace = document.createElement('a');
        enlace.href = '#/ventas';
        enlace.textContent = 'Ir a Ventas';
        var contMsg = document.createElement('div');
        contMsg.appendChild(ui.crearElemento('p', 'El historial todavía no tiene ventas registradas. Cada venta confirmada aparecerá aquí con su precio y sus renglones congelados.', 'mensaje mensaje--vacio'));
        contMsg.appendChild(enlace);
        nR.appendChild(contMsg);
      }
      nTabla.addEventListener('click', function (e) {
        var b = e.target;
        if (b && b.type === 'button' && b.dataset && b.dataset.ventaId) {
          ventaDetalleId = b.dataset.ventaId;
          mostrarDetalle(ventaDetalleId);
        }
      });
      return frag;
    },
    alCambiarElStore: function () {
      pintar();
      if (ventaDetalleId) { mostrarDetalle(ventaDetalleId); }
      return true;
    }
  };
}());
