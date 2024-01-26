// Redirecciones a pagina de detalles de productos
function redirecciondetalle(id) {
    location.href = "http://localhost:8080/detalleproducto/" + id;
}
// Redirecciones a pagina de todos los  producto
function redireccion() {
    location.href = "http://localhost:8080/productos";
}
/*
// Función para obtener el token
function obtenerToken() {
  return localStorage.getItem('token') || '';
}

// Función para realizar una solicitud con el token
async function realizarSolicitud(url) {
  const token = obtenerToken();

  try {
    const response = await fetch(url, {
      method: 'GET', // O el método que necesites
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    const data = await response.json();
    // Manejar la respuesta según sea necesario
    console.log('Respuesta:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Redirección a la página de detalles de productos
function redirecciondetalle(id) {
  realizarSolicitud(`http://localhost:8080/detalleproducto/${id}`);
}

// Redirección a la página de todos los productos
function redireccion() {
  realizarSolicitud('http://localhost:8080/productos');
}
*/

