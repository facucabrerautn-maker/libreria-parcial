(function () {
  'use strict';
  window.Libreria = window.Libreria || {};
  window.Libreria.vistas = window.Libreria.vistas || {};
  var ui = window.Libreria.ui, d = window.Libreria.datos, v = window.Libreria.validaciones, s = window.Libreria.storage, SEL = '.region-mensajes';
  var IC = 'venta-cliente', IL = 'venta-libro', IQ = 'venta-cantidad';
  var IA = 'venta-agregar', ICONF = 'venta-confirmar', IT = 'tabla-renglones';
  var nR,nF,nC,nL,nQ,nA,nConf,nT,nTot,nMsg,borrador={clienteId:'',renglones:[]},proc=false;
  function qm() { if (nMsg && nMsg.parentNode) nMsg.parentNode.removeChild(nMsg); nMsg = null; }
  function mr(t, tipo) { qm(); if (!nR) return null; nMsg = ui.mostrarMensaje(nR, t, tipo); }
  function na(i) { var a = d.obtenerAutor(i); return a ? a.nombre : ''; }
  function ne(i) { var e = d.obtenerEditorial(i); return e ? e.nombre : ''; }
  function al(l) { if (!l || !Array.isArray(l.autorIds)) return ''; return l.autorIds.map(function (i) { return na(i); }).join(', '); }
  function ir(lid) { for (var i = 0; i < borrador.renglones.length; i += 1) if (borrador.renglones[i].libroId === lid) return i; return -1; }
  function tb() { return v.calcularTotal(borrador.renglones); }
  function ac() { if (!nConf) return; nConf.disabled = proc || borrador.clienteId === '' || borrador.renglones.length === 0; }
  function pr() {
    if (!nT || !nTot) return;
    while (nT.firstChild) nT.removeChild(nT.firstChild);
    var enc = ['Libro', 'ISBN', 'Autores', 'Editorial', 'Cantidad', 'Precio unitario', 'Subtotal', 'Quitar'];
    var tab = document.createElement('table');
    tab.className = 'tabla tabla-renglones';
    var th = document.createElement('thead');
    var trc = document.createElement('tr');
    enc.forEach(function (t) { var c = ui.crearElemento('th', t, ''); c.setAttribute('scope', 'col'); trc.appendChild(c); });
    th.appendChild(trc); tab.appendChild(th);
    var tbdy = document.createElement('tbody');
    borrador.renglones.forEach(function (r) {
      var inp = document.createElement('input');
      inp.type = 'number'; inp.min = '1'; inp.step = '1';
      inp.value = String(r.cantidad); inp.dataset.libroId = r.libroId; inp.className = 'numero';
      var btn = ui.crearElemento('button', 'Quitar', 'boton--secundario');
      btn.type = 'button'; btn.dataset.libroId = r.libroId;
      var tr = document.createElement('tr');
      [r.titulo, r.isbn, r.autores, r.editorial, inp, ui.formatearMonto(r.precioUnitario), ui.formatearMonto(r.subtotal), btn].forEach(function (val) {
        var td = document.createElement('td');
        if (typeof val === 'object' && val !== null) td.appendChild(val); else td.textContent = String(val);
        tr.appendChild(td);
      });
      tbdy.appendChild(tr);
    });
    tab.appendChild(tbdy);
    if (borrador.renglones.length === 0) {
      var trv = document.createElement('tr');
      var tdv = ui.crearElemento('td', 'No hay renglones en la venta aún.', 'vacia');
      tdv.setAttribute('colspan', String(enc.length)); trv.appendChild(tdv); tbdy.appendChild(trv);
    }
    nT.appendChild(tab);
    nTot.textContent = ui.formatearMonto(tb());
    ac();
  }
  function ps() {
    var ca = nC.value, la = nL.value;
    while (nC.firstChild) nC.removeChild(nC.firstChild);
    var vac = ui.crearElemento('option', '— Elegí un cliente —', ''); vac.value = '';
    nC.appendChild(vac);
    d.listarClientes().forEach(function (c) { var o = ui.crearElemento('option', c.nombre, ''); o.value = c.id; nC.appendChild(o); });
    if (d.listarClientes().some(function (c) { return c.id === ca; })) nC.value = ca;
    borrador.clienteId = nC.value;
    while (nL.firstChild) nL.removeChild(nL.firstChild);
    var vac2 = ui.crearElemento('option', '— Elegí un libro —', ''); vac2.value = '';
    nL.appendChild(vac2);
    d.listarLibros().forEach(function (l) { var o = ui.crearElemento('option', l.titulo + ' (' + ui.formatearMonto(l.precio) + ')', ''); o.value = l.id; nL.appendChild(o); });
    if (d.listarLibros().some(function (l) { return l.id === la; })) nL.value = la;
  }
  function le() { ui.limpiarErrores(nR, nF); }
  function aa() {
    le(); qm();
    var lid = nL.value, cant = Number(nQ.value);
    var lib = lid !== '' ? d.obtenerLibro(lid) : null;
    var errs = [];
    if (lid === '') errs.push({ campo: IL, mensaje: 'Elegí un libro de la lista.' });
    else if (!lib) errs.push({ campo: IL, mensaje: 'El libro elegido no existe.' });
    if (!Number.isInteger(cant) || cant <= 0) errs.push({ campo: IQ, mensaje: 'La cantidad debe ser un entero mayor que cero.' });
    if (errs.length > 0) { ui.mostrarErrores(nR, errs, { formulario: nF }); ui.enfocarPrimerError(nF); return; }
    var ix = ir(lid);
    if (ix >= 0) {
      borrador.renglones[ix].cantidad += 1;
      borrador.renglones[ix].subtotal = v.calcularSubtotal(borrador.renglones[ix]);
      mr('Se incrementó la cantidad de «' + lib.titulo + '».', 'aviso');
    } else {
      borrador.renglones.push({
        id: '', libroId: lid, titulo: lib.titulo, isbn: lib.isbn,
        autores: al(lib), editorial: ne(lib.editorialId),
        cantidad: cant, precioUnitario: lib.precio,
        subtotal: v.calcularSubtotal({ cantidad: cant, precioUnitario: lib.precio })
      });
      mr('Se agregó «' + lib.titulo + '» a la venta.', 'aviso');
    }
    nQ.value = '1'; pr();
  }
  function aq(evt) {
    var b = evt.target;
    if (!b || !b.dataset || !b.dataset.libroId) return;
    var ix = ir(b.dataset.libroId);
    if (ix < 0) return;
    borrador.renglones.splice(ix, 1); pr();
  }
  function acant(evt) {
    var i = evt.target;
    if (!i || !i.dataset || !i.dataset.libroId) return;
    var ix = ir(i.dataset.libroId);
    if (ix < 0) return;
    var c = Number(i.value);
    if (!Number.isInteger(c) || c <= 0) { i.value = String(borrador.renglones[ix].cantidad); return; }
    borrador.renglones[ix].cantidad = c;
    borrador.renglones[ix].subtotal = v.calcularSubtotal(borrador.renglones[ix]);
    pr();
  }
  function acf() {
    le(); qm();
    var errs = v.validarVenta(d, { clienteId: borrador.clienteId, renglones: borrador.renglones });
    if (errs.length > 0) { ui.mostrarErrores(nR, errs, { formulario: nF }); ui.enfocarPrimerError(nF); return; }
    proc = true; ac();
    var cli = d.obtenerCliente(borrador.clienteId);
    var ven = {
      id: '', fecha: new Date().toISOString(),
      clienteId: borrador.clienteId,
      clienteNombre: cli ? cli.nombre : '',
      renglones: borrador.renglones.slice(),
      total: tb()
    };
    var reg = d.agregarVenta(ven);
    if (!reg) {
      mr('No se pudo registrar la venta: revisá los datos e intentá de nuevo.', 'error');
      proc = false; ac(); return;
    }
    if (!s.guardarVentas(d.listarVentas())) {
      mr('La venta se registró en esta sesión pero no se pudo guardar de forma persistente.', 'error');
    }
    borrador.clienteId = ''; borrador.renglones = [];
    nC.value = ''; nQ.value = '1';
    pr();
    proc = false; ac();
      mr('Venta «' + reg.id + '» confirmada correctamente.', 'exito');
  }
  window.Libreria.vistas.ventas = {
    render: function (sec) {
      var frag = document.createDocumentFragment();
      qm();
      nR = sec ? sec.querySelector(SEL) : null;
      nMsg = null;
      borrador = { clienteId: '', renglones: [] };
      proc = false;
      var cont = document.createElement('div');
      cont.className = 'vista-ventas__contenido';
      var form = document.createElement('form');
      form.id = 'form-venta'; form.name = 'form-venta';
      function campo(lt, fi, ctrl) {
        var dv = document.createElement('div'); dv.className = 'campo';
        var lab = ui.crearElemento('label', lt, '');
        lab.setAttribute('for', fi);
        dv.appendChild(lab); dv.appendChild(ctrl);
        return dv;
      }
      nC = document.createElement('select'); nC.id = IC; nC.name = IC;
      nL = document.createElement('select'); nL.id = IL; nL.name = IL;
      nQ = document.createElement('input');
      nQ.type = 'number'; nQ.id = IQ; nQ.name = IQ;
      nQ.min = '1'; nQ.step = '1'; nQ.value = '1';
      nA = ui.crearElemento('button', 'Agregar renglón', 'boton');
      nA.type = 'button'; nA.id = IA;
      form.appendChild(campo('Cliente', IC, nC));
      form.appendChild(campo('Libro', IL, nL));
      form.appendChild(campo('Cantidad', IQ, nQ));
      var af=document.createElement('div');af.className='campo';af.appendChild(nA);form.appendChild(af);
      nT = document.createElement('div');
      nT.id = IT; nT.className = 'tabla-contenedor';
      var res = document.createElement('div'); res.className = 'panel-resumen';
      var lin = document.createElement('div');
      lin.className = 'panel-resumen__linea panel-resumen__total';
      var lb = ui.crearElemento('span', 'Total', 'panel-resumen__etiqueta');
      nTot = ui.crearElemento('span', '0.00', 'panel-resumen__valor');
      lin.appendChild(lb); lin.appendChild(nTot);
      nConf = ui.crearElemento('button', 'Confirmar venta', 'boton');
      nConf.type = 'button'; nConf.id = ICONF;
      nConf.disabled = true;
      var ar=document.createElement('div');ar.className='panel-resumen__acciones';ar.appendChild(nConf);
      res.appendChild(lin); res.appendChild(ar);
      cont.appendChild(form); cont.appendChild(nT); cont.appendChild(res);
      frag.appendChild(cont);
      ps(); pr(); nC.addEventListener('change', function () { borrador.clienteId = nC.value; ac(); });
      nA.addEventListener('click', aa);
      nConf.addEventListener('click', acf);
      nT.addEventListener('click', function (e) {
        var b = e.target;
        if (b && b.type === 'button' && b.dataset && b.dataset.libroId) aq(e);
      });
      nT.addEventListener('change', function (e) {
        var i = e.target;
        if (i && i.type === 'number' && i.dataset && i.dataset.libroId) acant(e);
      });
      return frag;
    },
    alCambiarElStore: function () {
      ps();
      return true;
    }
  };
}());
