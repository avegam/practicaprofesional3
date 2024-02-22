function validarPerfil() {
    apellido = document.getElementById("Apellido").value;
    nombre = document.getElementById("Nombre").value;
    Telefono=document.getElementById("Telefono").value;
   

    
    // Expresion  Regular Nombre y Apellido

    expresion = /^[a-zA-Z]+$/;

    // Expresion Regural Contraseña

    expclave=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/;

    // Expresion Regular Telefono
    exptelefono=/^[0-9]{10}$/

    
    // Validacion Campo Nombre:
    if (nombre == "") {
        window.alert("El campo nombre no puede estar vacio");
        return false;
    }
    else if (!expresion.test(nombre)) {
        window.alert("Error: Nombre Invalido");
        return false;
    }

 // Validacion Campo Apellido

 if (apellido == "") {
    window.alert("El campo apellido no puede estar vacio");
    return false;
}
if (!expresion.test(apellido)) {
    window.alert("Error: Apellido invalido");
    return false;
}

// Validacion Campo Telefono
if (Telefono == "") {
    window.alert("El campo telefono no puede estar vacio");
    return false;
}
if (!exptelefono.test(Telefono)) {
    window.alert("Error: Telefono invalido");
    return false;
}

}


    