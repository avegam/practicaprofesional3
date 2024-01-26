// script.js
/*
document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    
    // Obtén todos los enlaces en la página
    const links = document.querySelectorAll('a');
    console.log(links)
    // Agrega un evento de clic a cada enlace
    links.forEach(link => {
      link.addEventListener('click', function (event) {
        event.preventDefault();
  
        const url = link.getAttribute('href');
        console.log(url)
        fetch(url, {
          headers: {
            'x-auth-token': token,
          },
        })
          .then(response => {
            if (response.redirected) {
              // Realizar redirección manualmente
              window.location.href = response.url;
            } else {
              return response.json();
            }
          })
          .then(data => {
            // Manejar la respuesta según sea necesario
            console.log('Datos de la respuesta:', data);
            // Realizar redirección aquí si es necesario
          })
          .catch(error => {
            // Manejar errores
            console.error('Error:', error);
          });
      });
    });
  });
  */