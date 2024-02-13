const mercadopago = new MercadoPago("TEST-002e7355-b26c-43b4-880d-29ff8adaa5e9", {
  locale: "es-AR", // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

//esta funcion toma los ids de las cookies y trae los datos correspondiente de cada una de la base de datos para armar el carrito
function buscarProductosEnBaseDeDatos(cookieData) {
  if (cookieData != "vaciar") {
      const productosEnCarrito = JSON.parse(cookieData);
      const productosFormateados = [];
      const fetchPromises = [];

      productosEnCarrito.forEach(producto => {
          const idProducto = producto.id;
          const fetchPromise = fetch(`/detalle/` + producto.id)
              .then(response => response.json())
              .then(data => {
                  const { nombre, precio, imagen } = data;
                  crearProducto(idProducto, imagen, nombre, precio, producto.cantidad);
                  const productoFormateado = {
                      title: nombre,
                      quantity: parseInt(producto.cantidad),
                      currency_id: 'ARS',
                      unit_price: parseInt(precio),
                  };
                  productosFormateados.push(productoFormateado);
              })
              .catch(error => {
                  console.error(`Error al obtener el producto con ID ${idProducto}:`, error);
              });
          fetchPromises.push(fetchPromise);
      });

      Promise.all(fetchPromises)
          .then(() => {
              
                  var elementosSubtotal = document.getElementsByClassName('subtotal');
                  var sumaSubtotal = 0;

                  for (var i = 0; i < elementosSubtotal.length; i++) {
                      var valorSubtotal = parseFloat(elementosSubtotal[i].textContent.replace('subtotal: $', ''));
                      sumaSubtotal += valorSubtotal;
                  }

                  crearpiedecarrito(sumaSubtotal, productosFormateados);
                  console.log('La suma total de subtotales es: $' + sumaSubtotal);
              
          });
  }
}

function comprarbtn(productosformados){

document.getElementById("checkout").addEventListener("click", function () {
  const orderData = productosformados
  console.log(JSON.stringify(orderData))
  fetch("/create_preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (preference) {
      createCheckoutButton(preference.id);
    })
    .catch(function () {
      alert("Unexpected error");
    });
});


}


function createCheckoutButton(preferenceId) {
  // Initialize the checkout
  const bricksBuilder = mercadopago.bricks();

  const renderComponent = async (bricksBuilder) => {
    if (window.checkoutButton) window.checkoutButton.unmount();
    await bricksBuilder.create(
      "wallet",
      "button-checkout", // class/id where the payment button will be displayed
      {
        initialization: {
          preferenceId: preferenceId,
        },
        callbacks: {
          onError: (error) => console.error(error),
          onReady: () => {},
        },
      }
    );
  };
  window.checkoutButton = renderComponent(bricksBuilder);
}

function limpiarcarrito(){
  var miElemento = document.getElementById("contenedorProductos");

  // Limpiar todos los hijos
  miElemento.innerHTML = "";
  var miElemento = document.getElementById("piecarrito");

  // Limpiar todos los hijos
  miElemento.innerHTML = "";
  
}

function crearpiedecarrito(sumaprecio,productoformateado){
  var contenedorpiedecarro = document.getElementById('piecarrito');
  //var piedecarro = document.createElement('div');
  var resultadoprecio = document.createElement('p');
  resultadoprecio.textContent = 'precio final: ' + sumaprecio;
  var Vaciarcarrito = document.createElement('button');
  Vaciarcarrito.textContent = 'vaciar carrito';
  Vaciarcarrito.onclick = function () {
      borrarCookie2("carrito");
  };
  var comprarboton = document.createElement('button');
    comprarboton.textContent = 'comprar';
    comprarboton.setAttribute('id', 'checkout');
    comprarboton.onclick = function () {
        comprarbtn(productoformateado);
  };
  
  contenedorpiedecarro.appendChild(resultadoprecio);
  contenedorpiedecarro.appendChild(Vaciarcarrito);
  contenedorpiedecarro.appendChild(comprarboton);


 }
//crea el html del carrito con los datos parametrizados
function crearProducto(idProducto,imagen, nombre, precio,cantidad) {
    var contenedorProductos = document.getElementById('contenedorProductos');

    // Crear elementos del producto
    var producto = document.createElement('div');
    producto.classList.add('producto');

    var imagen2 = document.createElement('img');
    imagen2.src = `../imagenes/` + imagen;
    imagen2.alt = 'Producto ' + imagen;

    var detalles = document.createElement('div');
    var nombreProducto = document.createElement('p');
    nombreProducto.textContent = 'Nombre del Producto ' + nombre;
    var precioProducto = document.createElement('p');
    precioProducto.textContent = 'Precio: $' + precio;
    var subtotaltext = document.createElement('p');
    subtotaltext.textContent = 'subtotal: $' + (precio * cantidad);
    subtotaltext.setAttribute('class', 'subtotal');

    detalles.appendChild(nombreProducto);
    detalles.appendChild(precioProducto);
    detalles.appendChild(subtotaltext);

    var acciones = document.createElement('div');
    
    const productoLi = document.createElement('p');
          productoLi.setAttribute('data-id', '1');
          productoLi.setAttribute('data-cantidad', '0');

          // Añadir el contenido del producto
          productoLi.innerHTML = /*`<button class="botonCarrito" data-id='${idProducto}' oculto="1" onclick="manejarBotonAgregar(this, 1, 10)">Agregar al Carrito</button>` +*/
            `<button class="botonCarrito" data-id='${idProducto}' oculto="0" style="display: inline;" onclick="restarCantidad(this,'${idProducto}','shop')">-</button>` +
            `<input class="botonCarrito" data-id='${idProducto}' oculto="0" type="number" value="1" min="1" class="cantidad-input" style="display: inline;">` +
            `<button class="botonCarrito" data-id='${idProducto}' oculto="0" style="display: inline;" onclick="sumarCantidad(this,'${idProducto}','shop')">+</button>` +
            `<button class="botonCarrito" data-id='${idProducto}' oculto="0" style="display: inline;" onclick="actualizarCantidadEnCarrito('carrito','${idProducto}','0','shop')">Eliminar</button>`;


    acciones.appendChild(productoLi);


    // Agregar elementos al producto
    producto.appendChild(imagen2);
    producto.appendChild(detalles);
    producto.appendChild(acciones);

    // Agregar producto al contenedor
    contenedorProductos.appendChild(producto);
}
function cargacarro(){
  // Código de la primera función

  console.log('tu función ejecutada');
  const cookieNombre = 'carrito';
  const cookieData = getCookie(cookieNombre);
  if (cookieData) {
      buscarProductosEnBaseDeDatos(cookieData);
    } else {
      console.log('La cookie no fue encontrada o está vacía.');
    }

};
window.onload = function() {
  cargacarro();
};