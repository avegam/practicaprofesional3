// Función para manejar el botón de agregar al carrito
  function manejarBotonAgregar(button, id, cantidad) {
    // Ocultar el botón de agregar y mostrar los elementos de cantidad
    button.style.display = 'none';
    button.nextElementSibling.style.display = 'inline-block';
    button.nextElementSibling.nextElementSibling.style.display = 'inline-block';
    button.nextElementSibling.nextElementSibling.nextElementSibling.style.display = 'inline-block';
    button.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.style.display = 'inline-block';
  }

  // Función para restar la cantidad
  function restarCantidad(button, id) {
    // Obtener el elemento de cantidad y restar 1 si es mayor que 0
    var cantidadInput = button.nextElementSibling;
    cantidadInput.value = Math.max(parseInt(cantidadInput.value) - 1, 0);
  
    // Actualizar la cantidad en la cookie solo si es mayor que 0
    if (parseInt(cantidadInput.value) >= -1) {
      actualizarCantidadEnCarrito("carrito", id, cantidadInput.value);
    }
  verificarBotonesEnCarrito()
}

  // Función para sumar la cantidad
  function sumarCantidad(button, id) {
    // Obtener el elemento de cantidad y sumar 1
    var cantidadInput = button.previousElementSibling;
    cantidadInput.value = parseInt(cantidadInput.value) + 1;
    actualizarCantidadEnCarrito("carrito",id,cantidadInput.value);
  }

  /* Función para agregar al carrito (actualizar)
  function agregarAlCarrito(id, cantidad) {
    // Puedes implementar la lógica para agregar el producto al carrito aquí
    // Por ahora, simplemente mostraremos un mensaje en la consola
    console.log('Producto actualizado en el carrito - ID:', id, 'Cantidad:', cantidadInput.value);
  }*/