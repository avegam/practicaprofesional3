document.addEventListener('DOMContentLoaded', () => {
    const datosLista = document.getElementById('contenedor');
  
    // Realizar la solicitud al backend para obtener datos
    fetch('http://localhost:8080/datos')
      .then(response => response.json())
      .then(data => {
        // Procesar los datos y actualizar la interfaz
        data.forEach(documento => {
          // Crear elementos HTML dinámicamente
          const productoDiv = document.createElement('div');
          productoDiv.classList.add('producto');
  
          const imagen = document.createElement('img');
          imagen.src = `../imagenes/${documento.imagen}`;
          imagen.alt = documento.nombre;
  
          const informacionDiv = document.createElement('div');
          informacionDiv.classList.add('informacion');
  
          const tituloP = document.createElement('p');
          tituloP.classList.add('estilo_titulo');
          tituloP.textContent = documento.nombre;
  
          const precioP = document.createElement('p');
          precioP.classList.add('precio');
          precioP.textContent = `$${documento.precio}`;
  
          const detalleButton = document.createElement('button');
          detalleButton.textContent = 'Ver detalle Producto';
          detalleButton.onclick = function() {
            redirecciondetalle(documento._id); // Agrega la función de redirección que necesites
          };

          const Agregarcarrito = document.createElement('button');
          Agregarcarrito.textContent = 'Agregar al carrito';
          Agregarcarrito.onclick = function() {
            agregarAlCarrito(documento._id,"1"); // Agrega la función de redirección que necesites
          };
          // Crear un nuevo elemento LI para el producto
          const productoLi = document.createElement('p');
          productoLi.setAttribute('data-id', '1');
          productoLi.setAttribute('data-cantidad', '0');

          // Añadir el contenido del producto
          productoLi.innerHTML = `<button class="botonCarrito" data-id='${documento._id}' oculto="1" onclick="manejarBotonAgregar(this, 1, 10)">Agregar al Carrito</button>` +
            `<button class="botonCarrito" data-id='${documento._id}' oculto="0" style="display: none;" onclick="restarCantidad(this,'${documento._id}')">-</button>` +
            `<input class="botonCarrito" data-id='${documento._id}' oculto="0" type="number" value="1" min="1" class="cantidad-input" style="display: none;">` +
            `<button class="botonCarrito" data-id='${documento._id}' oculto="0" style="display: none;" onclick="sumarCantidad(this,'${documento._id}')">+</button>`/* +
            `<button class="botonCarrito" data-id='${documento._id}' oculto="0" style="display: none;" onclick="agregarAlCarrito(1, 10)">Actualizar</button>`*/;

          // Añadir el LI al UL
          

          
          // Agregar elementos al DOM
          informacionDiv.appendChild(tituloP);
          informacionDiv.appendChild(precioP);
          informacionDiv.appendChild(detalleButton);
          informacionDiv.appendChild(Agregarcarrito);
          informacionDiv.appendChild(productoLi);
  
          productoDiv.appendChild(imagen);
          productoDiv.appendChild(informacionDiv);
  
          datosLista.appendChild(productoDiv);
        });
      })
      .catch(error => console.error('Error al obtener datos:', error));
  });