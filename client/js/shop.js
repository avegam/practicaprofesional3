const mercadopago = new MercadoPago("TEST-002e7355-b26c-43b4-880d-29ff8adaa5e9", {
  locale: "es-AR", // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

//esta funcion toma los ids de las cookies y trae los datos correspondiente de cada una de la base de datos para armar el carrito
function buscarProductosEnBaseDeDatos(cookieData,pie) {
  if (cookieData != "vaciar") {
      const productosEnCarrito = JSON.parse(cookieData);
      const productosFormateados = [];
      const fetchPromises = [];
 // Agarra el token del carrito y busca los datos del producto en la base de datos
      productosEnCarrito.forEach(producto => {
          const idProducto = producto.id;
          const fetchPromise = fetch(`/detalle/` + producto.id)
              .then(response => response.json())
              .then(data => {
                  const { nombre, precio, imagen } = data;
                  if(pie != "solopie"){
                  crearProducto(idProducto, imagen, nombre, precio, producto.cantidad);
                  }
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
              sumaSubtotales(productosFormateados)
                  
              
          });
  }
}
 // Funcion para summar el subtotal del producto seleccionado
function sumaSubtotales(productosFormateados){
  var elementosSubtotal = document.getElementsByClassName('subtotal');
  var sumaSubtotal = 0;

  for (var i = 0; i < elementosSubtotal.length; i++) {
      var valorSubtotal = parseFloat(elementosSubtotal[i].textContent.replace('subtotal: $', ''));
      sumaSubtotal += valorSubtotal;
  }
  
  crearpiedecarrito(sumaSubtotal, productosFormateados);
  console.log('La suma total de subtotales es: $' + sumaSubtotal);
}
 // Funcion comprar que te manda a mercado pago
async function comprarbtn(productosformados){
      //document.getElementById("checkout").addEventListener("click", function () {
        const orderData = productosformados
        // Datos adicionales
        const userIDElement = document.getElementById("ID");
        
  if (userIDElement !== null) {
    // Accede a la propiedad 'textContent' solo si el elemento no es nulo
    // Obtener el contenido del atributo textContent
    const userID = userIDElement.textContent;
    console.log("add " + JSON.stringify(userID))
    const requestBody = {
      item: orderData,
      additional: userID
    };
    console.log(JSON.stringify(orderData))
    fetch("/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
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
} else { // le pide al usuario que se logue en el sistema para poder comprar el producto
  window.alert("Por favor, inicia sesión o regístrate para continuar."); 
                                                                        
}

    
    
  //});
  
  
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
  /*async function getUserData() {
    // Obtener el elemento <p> por su ID
    const userIDElement = document.getElementById("ID");
  
    // Obtener el contenido del atributo textContent
    const userID = userIDElement.textContent;
  
    // Hacer una solicitud fetch para obtener los datos del usuario
    return fetch(`/usuario/${userID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo obtener los datos del usuario');
        }
        return response.json();
      })
      .then(userData => {
        // userData contiene los datos del usuario
        return userData;
      })
      .catch(error => {
        console.error('Error al obtener los datos del usuario:', error);
      });
  }*/

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
    // Limpiar todos los hijos
    contenedorpiedecarro.innerHTML = "";
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
    precioProducto.setAttribute('class', 'precio');
    precioProducto.setAttribute('data-id', idProducto);

    var subtotaltext = document.createElement('p');
    subtotaltext.textContent = 'subtotal: $' + (precio * cantidad);
    subtotaltext.setAttribute('class', 'subtotal');
    subtotaltext.setAttribute('data-id', idProducto);

    detalles.appendChild(nombreProducto);
    detalles.appendChild(precioProducto);
    detalles.appendChild(subtotaltext);

    var acciones = document.createElement('div');
    
    const productoLi = document.createElement('p');
          productoLi.setAttribute('data-id', '1');
          productoLi.setAttribute('data-cantidad', '0');

          // Añadir el contenido del producto, botones
          productoLi.innerHTML = /*`<button class="botonCarrito" data-id='${idProducto}' oculto="1" onclick="manejarBotonAgregar(this, 1, 10)">Agregar al Carrito</button>` +*/
            `<button class="botonCarrito" data-id='${idProducto}' oculto="0" style="display: inline;" onclick="restarCantidad(this,'${idProducto}','shop')">-</button>` +
            `<input class="botonCarrito" data-id='${idProducto}' oculto="0" type="number" value="${cantidad}" min="1" class="cantidad-input" style="display: inline;">` +
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
      buscarProductosEnBaseDeDatos(cookieData,"si");
    } else {
      console.log('La cookie no fue encontrada o está vacía.');
    }

};
window.onload = function() {
  cargacarro();
};