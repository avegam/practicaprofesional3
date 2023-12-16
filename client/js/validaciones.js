function validar() {
    apellido = document.getElementById("Apellido").value;
    nombre = document.getElementById("Nombre").value;
    email = document.getElementById("Email").value;
    contraseña=document.getElementById("txtPassword").value;

    // Expresion Regular Correo Electronico

    expReg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    // Expresion  Regular Nombre y Apellido

    expresion = /^[a-zA-Z]+$/;

    // Expresion Regural Contraseña

    expclave=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/;

    // Validacion Campo Nombre:
    if (nombre == "") {
        window.alert("El campo nombre no puede estar vacio");
        return false;
    }
    else if (!expresion.test(nombre)) {
        window.alert("Error: Nombre Invalido");
        return false;
    }

 // Validacion Campo Apellico

 if (apellido == "") {
    window.alert("El campo apellido no puede estar vacio");
    return false;
}
if (!expresion.test(apellido)) {
    window.alert("Error: Apellido invalido");
    return false;
}

// Validacion Campo Email
    if (email == "") {
        window.alert("El campo Email no puede estar vacio");
        return false;

    }
    else if (!expReg.test(email)) {
        window.alert("Error: Email Invalido")
        return false;
    }

    // Validacion Campo Contraseña
    if (contraseña == "") {
        window.alert("El campo Contraseña no puede estar vacio");
        return false;

    }
    else if (!expclave.test(contraseña)) {
        window.alert("Error: Contraseña Invalida debe contener Al menos 8 carácteres,Al menos una letra, Al menos una letra mayuscula, Al menos un número ")
        return false;
    }

}


    