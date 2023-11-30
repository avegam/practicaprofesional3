document.addEventListener('DOMContentLoaded', () => {
  const detalleContainer = document.getElementById('detalle-container');
  //const urlParams = new URLSearchParams(window.location.search);
  //const productId = urlParams.get('id');
  const productId = window.location.pathname.replace('/detalleproducto/', '');

  // Realizar la solicitud al backend para obtener datos
  fetch(`http://localhost:8080/detalle/${productId}`)
    .then(response => response.json())
    .then(data => {
     // Procesar los datos y construir el HTML
     const { nombre, precio, imagen,ingredientes,uso } = data;

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

     const volverButton = document.createElement('button');
     volverButton.classList.add('estilo_volver_PagPrincipal');
     volverButton.textContent = 'Ver todos los productos';
     volverButton.onclick = function() {
      redireccion(); // Agrega la función de redirección que necesites
    };
     // Agregar elementos al contenedor
     rightDiv.appendChild(h3);
     rightDiv.appendChild(precioP);
     rightDiv.appendChild(ingredientesP);
     rightDiv.appendChild(modoDeUsoP);
     rightDiv.appendChild(volverButton);

     detalleContainer.appendChild(leftDiv);
     detalleContainer.appendChild(rightDiv);
    
   })
   .catch(error => console.error('Error al obtener datos:', error));
});