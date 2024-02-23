
const facturaId = window.location.pathname.replace('/facturab/', '');
fetch(`/detallefactura/${facturaId}`)
    .then(response => response.json())
    .then(data => { 
    // Obtener el contenedor de la tabla
const tablaProductos = document.getElementById("productos");

// Crear la tabla
const tabla = document.createElement("table");

// Crear la fila de encabezado
const encabezado = document.createElement("tr");
encabezado.innerHTML = "<th>Producto</th><th>Cantidad</th><th>Precio Unitario</th><th>Subtotal</th>";
tabla.appendChild(encabezado);
// Inicializar la variable para el precio total
let precioTotal = 0;

// Iterar sobre los elementos en items y agregar filas a la tabla
data.items.forEach((item, index) => {
  const fila = document.createElement("tr");
  // Calcular el subtotal
  const subtotal = item.quantity * item.unit_price;
  // Agregar el subtotal al precio total
  precioTotal += subtotal;
  fila.innerHTML = `<td>${item.title}</td><td id="cantidadProducto${index + 1}">${item.quantity}</td><td id="precioProducto${index + 1}">${item.unit_price}</td><td id="subtotalProducto${index + 1}">${subtotal}</td>`;
  tabla.appendChild(fila);
});
// Agregar la fila del precio total
const filaTotal = document.createElement("tr");
filaTotal.innerHTML = `<td colspan="3"><strong>Total</strong></td><td>${precioTotal}</td>`;
tabla.appendChild(filaTotal);

// Agregar la tabla al contenedor
tablaProductos.appendChild(tabla);

// Datos del cliente dentro de la respuesta
const datosCliente = {
  nombre: data.nombre + ' ' + data.apellido,
  tipo: data.payer.identification.type,
  numero: data.payer.identification.number,
  email: data.mail,
  telefono : data.telefono
};

// Obtener el elemento del div
const divDatosCliente = document.getElementById("datos-cliente");

// Actualizar el contenido del div con los datos del cliente
divDatosCliente.innerHTML = `
  <strong>Datos del Cliente:</strong>
  <p>Nombre: ${datosCliente.nombre}</p>
  <p>Documento: ${datosCliente.tipo}</p>
  <p>Numero: ${datosCliente.numero}</p>
  <p>Email: ${datosCliente.email}</p>
`;

// Obtener el elemento del div
const divDatosFactura = document.getElementById("datos-factura");

// Datos de la factura dentro de la respuesta
const datosFactura = {
  numero: data.idTransaccion, // Puedes ajustar según la estructura real de tus datos
  fechaEmision: data.money_release_date, // Puedes ajustar según la estructura real de tus datos
  tipo: "Factura B" // Puedes ajustar según la estructura real de tus datos
};

// Actualizar el contenido del div con los datos de la factura
divDatosFactura.innerHTML = `
  <p><strong>Número de Factura:</strong> ${datosFactura.numero}</p>
  <p><strong>Fecha de Emisión:</strong> ${datosFactura.fechaEmision}</p>
  <p><strong>Tipo de Factura:</strong> ${datosFactura.tipo}</p>
`;
})
   .catch(error => console.error('Error al obtener datos:', error));


   // Función para volver (puedes personalizar según tu aplicación)
    function volver() {
    location.href = "/factura";
  }
    // Función para imprimir la factura
    function imprimirFactura() {
      window.print();
    }

   