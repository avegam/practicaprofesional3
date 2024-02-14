function agregarAlCarrito(productoId, cantidad) {
  // Verifica si ya hay un carrito almacenado en las cookies
  let carrito = JSON.parse(getCookie('carrito')) || [];

  // Agrega el nuevo producto al carrito
  carrito.push({ id: productoId, cantidad: cantidad });

  // Guarda el carrito actualizado en las cookies
  setCookie('carrito', JSON.stringify(carrito));

  // Actualiza la visualización del carrito en la página
  mostrarCarrito();
}
function mostrarCarrito3() {
  let carritoContainer = document.getElementById('contenedorProductos');
  carritoContainer.innerHTML = '';
  let carritoContainer2 = document.getElementById('piecarrito');
  carritoContainer2.innerHTML = '';
  cargacarro();

}

function mostrarCarrito() {
  let carrito = JSON.parse(getCookie('carrito')) || [];
  let carritoContainer = document.getElementById('carrito');
  carritoContainer.innerHTML = '';

  carrito.forEach(item => {
    let li = document.createElement('li');
    li.textContent = `Producto ${item.id} - ${item.cantidad}`;
    carritoContainer.appendChild(li);
  });
  
  const vaciarcarro =  document.createElement('button');
  vaciarcarro.textContent = 'vaciar carrito';
  vaciarcarro.onclick = function() {
    borrarCookie("carrito");
  };
  carritoContainer.appendChild(vaciarcarro)
}

function setCookie(nombre, valor, diasExpiracion = 7) {
  let fechaExpiracion = new Date();
  fechaExpiracion.setTime(fechaExpiracion.getTime() + (diasExpiracion * 24 * 60 * 60 * 1000));
  document.cookie = `${nombre}=${valor};expires=${fechaExpiracion.toUTCString()};path=/`;
}

function getCookie(nombre) {
  let nombreCookie = `${nombre}=`;
  let cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(nombreCookie) == 0) {
      return cookie.substring(nombreCookie.length, cookie.length);
    }
  }
  return null;
}

function borrarCookie(nombre) {
  document.cookie = nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  mostrarCarrito();
}

function borrarCookie2(nombre) {
  document.cookie = nombre + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  buscarProductosEnBaseDeDatos("vaciar")
  mostrarCarrito3();
}


function actualizarCantidadEnCarrito(nombre, id, nuevaCantidad,quecarro) {
// Obtén el valor actual de la cookie "carrito"
var carritoCookie = getCookie(nombre);

// Verifica si la cookie "carrito" existe y no está vacía
if (carritoCookie) {
  // Convierte el valor de la cookie a un array de objetos
  var carritoData = JSON.parse(carritoCookie);

  // Busca el índice del elemento con el ID específico en el array
  var indiceElemento = carritoData.findIndex(item => item.id === id);

  // Si se encuentra el elemento, actualiza la cantidad o elimina la línea si la nueva cantidad es 0
  if (indiceElemento !== -1) {
    if (parseInt(nuevaCantidad) === 0) {
      // Elimina la línea si la nueva cantidad es 0
      carritoData.splice(indiceElemento, 1);

    } else {
      // Actualiza la cantidad
      carritoData[indiceElemento].cantidad = nuevaCantidad;
    }

    // Convierte el array de vuelta a JSON
    var nuevoCarritoCookie = nombre + '=' + JSON.stringify(carritoData);

    // Actualiza la cookie "carrito"
    document.cookie = nuevoCarritoCookie + '; path=/;';
  }
}
if (quecarro === "shop" && parseInt(nuevaCantidad) === 0) {
  mostrarCarrito3();
}
if(quecarro === "shop"){
  //mostrarCarrito3();
}

mostrarCarrito();
}
  // Muestra el carrito al cargar la página
  //mostrarCarrito();


  // Función para leer los IDs de la cookie y mostrar u ocultar botones
function verificarBotonesEnCarrito() {
  var carritoCookie = getCookie('carrito');
  console.log('Contenido de la cookie:', carritoCookie);
  if (carritoCookie) {
    var carritoData = JSON.parse(carritoCookie);

    // Obtener todos los IDs presentes en la cookie
    var todosLosIDs = carritoData.map(item => item.id);
    console.log('Todos los IDs:', todosLosIDs);
    // Obtener todos los botones que deseas verificar
    var botones = document.getElementsByClassName('botonCarrito');
    console.log('Número de botones encontrados:', botones.length);
    var botonesArray = Array.from(botones);
    // Verificar y mostrar u ocultar los botones según los IDs
    botonesArray.forEach(boton => {
      var idBoton = boton.getAttribute('data-id');
      var deberiaMostrar = todosLosIDs.includes(idBoton) && Condicion(boton);
     // console.log("Resultado deberia" + deberiaMostrar)
      //console.log("Resultado idboton" + todosLosIDs.includes(idBoton))
      //console.log("Resultado condicion" + Condicion(boton))
      mostrarOcultarBoton(boton, deberiaMostrar);
    });
  }
}

// Función auxiliar para mostrar u ocultar un botón
function mostrarOcultarBoton(boton, deberiaMostrar) {
  boton.style.display = deberiaMostrar ? 'inline-block' : 'none';
}

function Condicion(boton) {
  var atributoOculto = boton.getAttribute('oculto');
  console.log('Valor de atributoOculto:', atributoOculto);
  return atributoOculto !== null && atributoOculto === '0';
}
// Llama a la función al cargar la página
//verificarBotonesEnCarrito();


window.onload = async function() {
  // Código de la primera función
  console.log('Primera función ejecutada');

  mostrarCarrito();
  
  // Código de la segunda función
  console.log('Segunda función ejecutada');

  // Esperar a que el contenido esté completamente cargado
  await esperarContenidoCargado();

  // Verificar los botones en el carrito
  verificarBotonesEnCarrito();
};

async function esperarContenidoCargado() {
  return new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', () => {
      resolve();
    });
  });
}
/*
document.addEventListener('DOMContentLoaded', function() {
  verificarBotonesEnCarrito();
  console.log("eject")
});*/

