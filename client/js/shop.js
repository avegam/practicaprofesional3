const mercadopago = new MercadoPago("TEST-002e7355-b26c-43b4-880d-29ff8adaa5e9", {
  locale: "es-AR", // The most common are: 'pt-BR', 'es-AR' and 'en-US'
});

//esta funcion toma los ids de las cookies y trae los datos correspondiente de cada una de la base de datos para armar el carrito
function buscarProductosEnBaseDeDatos(cookieData) {
    // Parsea la cookie para obtener un array de objetos
    // Obtén la cookie por su nombre
    if (cookieData != "vaciar") {
      
    
    const productosEnCarrito = JSON.parse(cookieData);
    //lista de productos para mercadopago
    const productosFormateados = [];
    // Itera sobre cada objeto en la cookie
    productosEnCarrito.forEach(producto => {
      const idProducto = producto.id;
        console.log(producto.id)
      // Realiza una solicitud a la base de datos para obtener el producto con la ID correspondiente
      fetch(`http://localhost:8080/detalle/`+ producto.id)
        .then(response => response.json())
        .then(data => {
            // creo variables para cada dato extraido de la base
            const { nombre, precio, imagen} = data;
            
          //esta funcion crea el html del carrito
          crearProducto(imagen,nombre,precio,producto.cantidad)
          console.log(`Producto con ID ${idProducto}:`, data);
          //formato de orden para enviar a mercado pago
          const productoFormateado = {
            title: nombre,
            quantity:  parseInt(producto.cantidad),
            currency_id: 'ARS',
            unit_price:  parseInt(precio),
          };
          productosFormateados.push(productoFormateado);
        })
        .catch(error => {
          console.error(`Error al obtener el producto con ID ${idProducto}:`, error);
        });
    });
    
    setTimeout(function() {
      console.log(productosFormateados)
            // Obtener todos los elementos con la clase "subtotal"
      var elementosSubtotal = document.getElementsByClassName('subtotal');
      console.log(elementosSubtotal[0])
      // Inicializar una variable para almacenar la suma
      var sumaSubtotal = 0;

      // Recorrer la lista de elementos y sumar sus valores
      for (var i = 0; i < elementosSubtotal.length; i++) {
          // Obtener el texto del elemento y extraer el valor numérico
          var valorSubtotal = parseFloat(elementosSubtotal[i].textContent.replace('subtotal: $', ''));
          console.log(valorSubtotal + "prueba")
          // Sumar al total
          sumaSubtotal += valorSubtotal;
      }

      // Mostrar el resultado
      crearpiedecarrito(sumaSubtotal,productosFormateados)
      console.log('La suma total de subtotales es: $' + sumaSubtotal);
    }, 1000);

  } else {
    limpiarcarrito()
    console.log('La cookie no fue encontrada o está vacía.');
  }

  }

function comprarbtn(productosformados){
  // Crea una preferencia de pago

  /*const mp = new MercadoPago('TEST-002e7355-b26c-43b4-880d-29ff8adaa5e9');
  const preference = await mp.Create({
    items: productosformados,
    back_urls: {
      success: 'https://tu-sitio.com/pago-exitoso',
      failure: 'https://tu-sitio.com/pago-fallido',
      pending: 'https://tu-sitio.com/pago-pendiente'
    }
    
  });
  console.log(preference)
  // Abre la ventana de pago
  window.open(preference.body.init_point, '_blank');*/
  // MP


document.getElementById("checkout").addEventListener("click", function () {
  const orderData = productosformados
  console.log(JSON.stringify(orderData))
  fetch("http://localhost:8080/create_preference", {
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
function crearProducto(imagen, nombre, precio,cantidad) {
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
    var agregarCarritoBtn = document.createElement('button');
    agregarCarritoBtn.textContent = 'Agregar al carrito';
    agregarCarritoBtn.onclick = function () {
        agregarAlCarrito(id);
    };

    var inputCantidad = document.createElement('input');
    inputCantidad.type = 'number';
    inputCantidad.id = 'cantidad' + cantidad;
    inputCantidad.value = cantidad;
    inputCantidad.min = '1';

    var actualizarCantidadBtn = document.createElement('button');
    actualizarCantidadBtn.textContent = 'Actualizar Cantidad';
    actualizarCantidadBtn.onclick = function () {
        actualizarCantidad(id);
    };

    var eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.onclick = function () {
        eliminarProducto(id);
    };

    acciones.appendChild(agregarCarritoBtn);
    acciones.appendChild(inputCantidad);
    acciones.appendChild(actualizarCantidadBtn);
    acciones.appendChild(eliminarBtn);

    // Agregar elementos al producto
    producto.appendChild(imagen2);
    producto.appendChild(detalles);
    producto.appendChild(acciones);

    // Agregar producto al contenedor
    contenedorProductos.appendChild(producto);
}

   
      window.onload = function() {
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