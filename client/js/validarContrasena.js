function validarContrasena() {
    contraseñaactual=document.getElementById("txtPasswordactual").value;
    contraseña=document.getElementById("txtPassword").value;
    contraseña2=document.getElementById("txtPassword2").value;
    


    // Expresion Regural Contraseña

    expclave=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&#.$($)$-$_])[A-Za-z\d$@$!%*?&#.$($)$-$_]{8,15}$/;


// Validacion Campo Contraseña Actual
    
if (contraseñaactual == "") {
    window.alert("El campo Contraseña no puede estar vacio");
    return false;

}
else if (!expclave.test(contraseñaactual)) {
    window.alert("Error: Contraseña Invalida debe contener Al menos 8 carácteres,Al menos una letra, Al menos una letra mayuscula, Al menos un número ")
    return false;
}

// Validacion Campo Contraseña Nueva

    if (contraseña == "") {
        window.alert("El campo Contraseña Nueva no puede estar vacio");
        return false;

    }

    if (contraseña == contraseñaactual) {
        window.alert("El campo contraseña nueva no puede ser igual al campo contraseña actual");
        return false;

    }

    if (!expclave.test(contraseña)) {
        window.alert("Error: Contraseña Nueva Invalida debe contener Al menos 8 carácteres,Al menos una letra, Al menos una letra mayuscula, Al menos un número ")
        return false;
    }

    // Validacion Campo Confirmar Contraseña 
    if (contraseña2 == "") {
        window.alert("El campo Confirmar Contraseña no puede estar vacio");
        return false;

    } else if (contraseña != contraseña2) {
        window.alert("La confirmación de contraseña no coincide con la contraseña nueva ingresada. Por favor, vuelva a ingresarla.")
        return false;
    }

}


    