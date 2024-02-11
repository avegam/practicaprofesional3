function Validacion() {
    
    nombre = document.getElementById("productoanadir").value;
    ingredientes= document.getElementById("ingredientesAgregar").value;
    uso = document.getElementById("usoagregar").value;
    

    

    // Expresion  Regular Nombre del producto

    expresion = /^[a-zA-Z]+$/;

   
    // Validacion Campo Nombre del producto:
    if (nombre == "") {
        window.alert("El campo nombre no puede estar vacio");
        return false;
    }
    else if (!expresion.test(nombre)) {
        window.alert("Error: Nombre Invalido");
        return false;
    }

 // Validacion Campo ingredientes

 if (ingredientes == "") {
    window.alert("El campo ingrediente no puede estar vacio");
    return false;
}
if (!expresion.test(ingredientes)) {
    window.alert("Error: Formato invalido");
    return false;
}


 // Validacion Campo uso

 if (uso == "") {
    window.alert("El campo uso no puede estar vacio");
    return false;
}
if (!expresion.test(uso)) {
    window.alert("Error: Formato invalido");
    return false;
}


}


    