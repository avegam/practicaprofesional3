
    // Obtener elementos del DOM
    var dropdown = document.getElementById('dropdown');

    // Mostrar el menú desplegable al pasar el cursor sobre el texto del usuario
    dropdown.addEventListener('mouseover', function() {
        var dropdownContent = document.getElementById('dropdownContent');
       dropdownContent.style.display = 'block';
    });

    // Ocultar el menú desplegable al sacar el cursor del texto del usuario
    dropdown.addEventListener('mouseout', function() {
        var dropdownContent = document.getElementById('dropdownContent');
       dropdownContent.style.display = 'none';
    });
 
