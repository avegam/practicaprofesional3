function validacionEditarContacto () {
    
    Telefono=document.getElementById("telefonoeditar").value;
    Email = document.getElementById("editarEmail").value;
    Ubicacion = document.getElementById("ubicacioneditar").value;
    

    // Expresion Regular Correo Electronico

    expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    
    // Expresion  Regular Ubicacion

    expresion = /^[a-zA-Z]+$/;


    // Expresion Regular Telefono
    exptelefono=/^[0-9]{10}$/

    

// Validacion Campo Telefono
if (Telefono == "") {
    window.alert("El campo telefono no puede estar vacio");
    return false;
}
if (!exptelefono.test(Telefono)) {
    window.alert("Error: Telefono invalido");
    return false;
}

// Validacion Campo Email
if (Email == "") {
    window.alert("El campo Email no puede estar vacio");
    return false;

}
else if (!expReg.test(Email)) {
    window.alert("Error: Email Invalido")
    return false;
}

// Validacion Campo Ubicacion:
if (Ubicacion == "") {
    window.alert("El campo ubicacion no puede estar vacio");
    return false;
}
else if (!expresion.test(Ubicacion)) {
    window.alert("Error: Ubicacion Invalido");
    return false;
}

}

