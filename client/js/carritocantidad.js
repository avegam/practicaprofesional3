// Función para manejar el botón de agregar al carrito
  function manejarBotonAgregar(button, condicion) {
    if(condicion){
     // Ocultar el botón de agregar y mostrar los elementos de cantidad
    button.style.display = 'none';
    button.nextElementSibling.style.display = 'inline-block';
    button.nextElementSibling.nextElementSibling.style.display = 'inline-block';
    button.nextElementSibling.nextElementSibling.nextElementSibling.style.display = 'inline-block';
    //button.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.display = 'inline-block'; 
    } else {
      // Ocultar el botón de agregar y mostrar los elementos de cantidad
      button.style.display = 'inline-block';
      button.nextElementSibling.style.display = 'none';
      button.nextElementSibling.nextElementSibling.style.display = 'none';
      button.nextElementSibling.nextElementSibling.nextElementSibling.style.display = 'none';
      //button.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.display = 'inline-block';}

    }
  }

  // Función para restar la cantidad
  function restarCantidad(button, id,quecarro) {
    // Obtener el elemento de cantidad y restar 1 si es mayor que 0
    var cantidadInput = button.nextElementSibling;
    cantidadInput.value = Math.max(parseInt(cantidadInput.value) - 1, 0);
  
    // Actualizar la cantidad en la cookie solo si es mayor que 0
    if (parseInt(cantidadInput.value) >= -1) {
      actualizarCantidadEnCarrito("carrito", id, cantidadInput.value,quecarro);
    }
    if(quecarro === "shop"){
      console.log("estuve aqui")
      actualizarSubtotal(id)
      const carrito = getCookie("carrito")
      buscarProductosEnBaseDeDatos(carrito,"solopie")
    }
  verificarBotonesEnCarrito(quecarro)
}

  // Función para sumar la cantidad
  function sumarCantidad(button, id,quecarro) {
    // Obtener el elemento de cantidad y sumar 1
    var cantidadInput = button.previousElementSibling;
    cantidadInput.value = parseInt(cantidadInput.value) + 1;
    actualizarCantidadEnCarrito("carrito",id,cantidadInput.value,quecarro);
    if(quecarro === "shop"){
      actualizarSubtotal(id)
      const carrito = getCookie("carrito")
      buscarProductosEnBaseDeDatos(carrito,"solopie")
    }
    verificarBotonesEnCarrito(quecarro)
  }


  function actualizarSubtotal(idProducto) {
    // Obtener el precio del producto
    var precioProducto = parseFloat(document.querySelector('.precio[data-id="' + idProducto + '"]').innerText.replace('Precio: $', ''));

    // Obtener la cantidad del producto
    var cantidadProducto = parseInt(document.querySelector('input[data-id="' + idProducto + '"]').value);

    // Calcular el subtotal
    var subtotal = precioProducto * cantidadProducto;

    // Actualizar el elemento HTML del subtotal
    document.querySelector('.subtotal[data-id="' + idProducto + '"]').innerText = 'subtotal: $' + subtotal;
}




  