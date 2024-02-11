function llenarTabla(textoComparacion, idTabla) {
    fetch(`/facturadatos`)
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById(idTabla);

           // Campos específicos que deseas mostrar, incluyendo los del campo "payer"
            const camposAMostrar = ["idTransaccion", "transaction_amount", "status", "status_detail", "transaction_details.net_received_amount","payer.identification.type", "payer.identification.number", "payer.phone.number", "payer.email", "pedido"];
            const camposAMostrara = ["id Transaccion", "Monto total", "Estado", "Detalle estado", "Monto neto", "Documento","Numero", "Telefono", "email", "pedido"];

            // Crear la fila de encabezado
            const filaEncabezado = tabla.insertRow();

            // Llenar la fila de encabezado con los nombres de los campos específicos
            camposAMostrara.forEach(campo => {
                const th = document.createElement("th");
                th.textContent = campo;
                filaEncabezado.appendChild(th);
            });

            // Agregar botones al encabezado
            const th1 = document.createElement("th");
            th1.textContent = "Factura";
            filaEncabezado.appendChild(th1);

            const th2 = document.createElement("th");
            th2.textContent = "Entregar/Pendiente";
            filaEncabezado.appendChild(th2);

            // Iterar sobre los objetos en el array y agregar filas a la tabla
            data.forEach(objeto => {
                if (obtenerValor(objeto, "pedido") === textoComparacion) {
                    const filaDatos = tabla.insertRow();

                    camposAMostrar.forEach(campo => {
                        const td = document.createElement("td");
                        const valorColumna = obtenerValor(objeto, campo);
                        td.textContent = valorColumna;
                        filaDatos.appendChild(td);
                    });

                    // Crear un botón para ver la factura
                    const td1 = document.createElement("td");
                    var botonVerFactura = document.createElement('button');
                    botonVerFactura.innerHTML = 'Ver Factura';

                    // Agregar un evento de clic al botón para redireccionar a una página específica
                    botonVerFactura.addEventListener('click', function () {
                        const id = obtenerValor(objeto, "idTransaccion");
                        // Redirección a página de la factura
                        location.href = "/facturab/" + id;
                    });
                    td1.appendChild(botonVerFactura);
                    filaDatos.appendChild(td1);

                    // Crear botones para entregar y rechazar
                    const td2 = document.createElement("td");
                    var botonEntregar = crearBoton(obtenerValor(objeto, "idTransaccion"),"Entregar", "entregado");
                    var botonRechazar = crearBoton(obtenerValor(objeto, "idTransaccion"),"Rechazar", "rechazado");

                    td2.appendChild(botonEntregar);
                    td2.appendChild(botonRechazar);
                    filaDatos.appendChild(td2);
                }
            });
        })
        .catch(error => console.error('Error al obtener datos:', error));

    function crearBoton(idTransaccion,texto, estado) {
        var boton = document.createElement('button');
        boton.innerHTML = texto;

        boton.onclick = function () {
            editarFactura(idTransaccion, estado);
            limpiarTabla("facturaTable");
            limpiarTabla("facturaTableentregados");
            limpiarTabla("facturaTablerechazados");
            llenarTabla("pendiente", "facturaTable");
            llenarTabla("entregado", "facturaTableentregados");
            llenarTabla("rechazado", "facturaTablerechazados");
        };

        return boton;
    }
}

// Ejemplo de uso
limpiarTabla("facturaTable");
limpiarTabla("facturaTableentregados");
limpiarTabla("facturaTablerechazados");
llenarTabla("pendiente", "facturaTable");
llenarTabla("entregado", "facturaTableentregados");
llenarTabla("rechazado", "facturaTablerechazados");

function limpiarTabla(idTabla) {
    const tabla = document.getElementById(idTabla);
    // Elimina todas las filas de la tabla
    while (tabla.rows.length > 0) {
        tabla.deleteRow(0);
    }
}
// Función para obtener el valor de una propiedad anidada
function obtenerValor(objeto, propiedad) {
    const propiedades = propiedad.split('.');
    return propiedades.reduce((valor, prop) => valor[prop], objeto);
}


//editar pedidos

async function editarFactura(idFactura, nuevoCampo) {
    try {
    const respuesta = await fetch(`/pedido/${idFactura}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nuevoCampo }),
    });

    if (!respuesta.ok) {
      const error = await respuesta.json();
      console.error('Error al editar factura:', error);
    } else {
      const facturaActualizada = await respuesta.json();
      console.log('Factura actualizada:', facturaActualizada);
      // Aquí puedes realizar acciones adicionales después de la actualización
    }
  } catch (error) {
    console.error('Error de red:', error);
  }
}

