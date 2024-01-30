document.addEventListener('DOMContentLoaded', () => {
    const detalleContainer = document.getElementById('detalle-container');
    const productId = window.location.pathname.replace('/detalleproducto/', '').replace('/modificarproducto/', '');
    console.log(productId)
    // Realizar la solicitud al backend para obtener datos
    fetch(`/detalle/${productId}`)
      .then(response => response.json())
      .then(data => {
        const { nombre, precio, imagen, ingredientes, uso } = data;
  
        detalleContainer.classList.add('container', 'flex');
  
        const leftDiv = document.createElement('div');
        leftDiv.classList.add('left');
  
        const mainImageDiv = document.createElement('div');
        mainImageDiv.classList.add('main_image');
  
        const img = document.createElement('img');
        img.src = `../imagenes/${imagen}`;
        img.classList.add('slide');
  
        mainImageDiv.appendChild(img);
        leftDiv.appendChild(mainImageDiv);
  
        const rightDiv = document.createElement('div');
        rightDiv.classList.add('right');
  
        const h3 = document.createElement('h3');
        h3.textContent = nombre;
  
        const precioP = document.createElement('p');
        precioP.classList.add('precio');
        precioP.textContent = `$${precio}`;
  
        const ingredientesP = document.createElement('p');
        ingredientesP.textContent = `INGREDIENTES: ${ingredientes}`;
  
        const modoDeUsoP = document.createElement('p');
        modoDeUsoP.textContent = `MODO DE USO:  ${uso}`;
  
        const editarForm = document.createElement('form');
        editarForm.addEventListener('submit', function (event) {
          event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
          // Aquí puedes agregar lógica para enviar los datos actualizados al servidor
          const nuevosDatos = {
            nombre: event.target.nombre.value,
            precio: event.target.precio.value,
            ingredientes: event.target.ingredientes.value,
            uso: event.target.uso.value,
          };
          // Realizar la solicitud al servidor para actualizar los datos
          // fetch(`/actualizar/${productId}`, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(nuevosDatos),
          // })
          //   .then(response => response.json())
          //   .then(data => console.log('Datos actualizados:', data))
          //   .catch(error => console.error('Error al actualizar datos:', error));
        });
  
        const nombreInput = document.createElement('input');
        nombreInput.type = 'text';
        nombreInput.name = 'nombre';
        nombreInput.value = nombre;
  
        const precioInput = document.createElement('input');
        precioInput.type = 'text';
        precioInput.name = 'precio';
        precioInput.value = precio;
  
        const ingredientesInput = document.createElement('textarea');
        ingredientesInput.name = 'ingredientes';
        ingredientesInput.value = ingredientes;
  
        const usoInput = document.createElement('textarea');
        usoInput.name = 'uso';
        usoInput.value = uso;
  
        const enviarButton = document.createElement('button');
        enviarButton.type = 'submit';
        enviarButton.textContent = 'Guardar cambios';
  
        // Agregar elementos al formulario
        editarForm.appendChild(nombreInput);
        editarForm.appendChild(precioInput);
        editarForm.appendChild(ingredientesInput);
        editarForm.appendChild(usoInput);
        editarForm.appendChild(enviarButton);
  
        const volverButton = document.createElement('button');
        volverButton.classList.add('estilo_volver_PagPrincipal');
        volverButton.textContent = 'Ver todos los productos';
        volverButton.onclick = function () {
          redireccion(); // Agrega la función de redirección que necesites
        };
  
        // Agregar elementos al contenedor
        rightDiv.appendChild(h3);
        rightDiv.appendChild(precioP);
        rightDiv.appendChild(ingredientesP);
        rightDiv.appendChild(modoDeUsoP);
        rightDiv.appendChild(editarForm);
        rightDiv.appendChild(volverButton);
  
        detalleContainer.appendChild(leftDiv);
        detalleContainer.appendChild(rightDiv);
      })
      .catch(error => console.error('Error al obtener datos:', error));
  });