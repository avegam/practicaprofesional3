
///////////////////////////////////////VALIDACIONES DE AGREGAR PRODUCTOS////////////////////////////////////////////////////////////////////////////////////////
function validacion() {
              var nombreProducto = document.getElementById("productoanadir").value;
              var imagen = document.getElementById("imagenagregar").value;
              var precio = document.getElementById("valorAgregrar").value;
              var stock = document.getElementById("existenciaAgregrar").value;
              var ingredientes = document.getElementById("ingredientesAgregar").value;
              var uso = document.getElementById("usoagregar").value;

             // Expresion regular para Nombre de Producto
                expresion = /^[a-zA-Z\s]+$/;

           
               // Expresion Regular de Campo uso e ingredientes
               expresionuno = /^[a-zA-Z\s,]+,?$/;

              if (nombreProducto === "") {
                  alert("Por favor, ingrese un nombre de producto");
                  return false;
              }
              else if (!expresion.test(nombreProducto)) {
              window.alert("Error: Campo Nombre Invalido");
              return false;
      }

              if (imagen === "") {
                  alert("Por favor, ingrese una imagen");
                  return false;
              }

              if (precio === "") {
                  alert("Por favor, ingrese un precio");
                  return false;
              }

              if (stock === "") {
                  alert("Por favor, ingrese una cantidad de stock");
                  return false;
              }

              if (ingredientes === "") {
                  alert("Por favor, ingrese los ingredientes");
                  return false;
              }
              else if (!expresionuno.test(ingredientes)) {
            window.alert("Error: Campo Ingredientes Invalido");
            return false;
      }

              if (uso === "") {
                  alert("Por favor, ingrese el uso del producto");
                  return false;
              }
              else if (!expresionuno.test(uso)) {
            window.alert("Error: Campo Uso Invalido");
            return false;
      }

              if (precio === "") {
                  alert("Por favor, ingrese un precio");
                  return false;
              }

              return true;
          }

/////////////////////////////VALIDACIONES DE EDITAR PRODUCTOS//////////////////////////////////////////////////////////////////////////////////////////////
          function validar() {
          var nombreProducto = document.getElementById("productoEditar").value;
          var nombreProducto2 = document.getElementById("productoEditar2").value;
          var imagen = document.getElementById("imagenEditar").value;
          var precio = document.getElementById("valorEditar").value;
          var stock = document.getElementById("stockEditar").value;
          var ingredientes = document.getElementById("ingredientesEditar").value;
          var uso = document.getElementById("usoEditar").value;

          
    // Expresion regular para Nombre de Producto
    expresion = /^[a-zA-Z\s]+$/;

    // Expresion Regular Campo Ingredientes y Uso

    expresiondos = /^[a-zA-Z\s,]+,?$/;
    

          if (nombreProducto === "") {
              alert("Por favor, elija el producto disponible");
              return false;
          } 
          if (nombreProducto2 === "") {
            alert("Por favor, ingrese un nombre de producto");
            return false;
        }else if (!expresion.test(nombreProducto2)) {
            window.alert("Error: Campo Nombre Invalido");
            return false;
        }
         
          if (imagen === "") {
              alert("Por favor elija una imagen de producto");
              return false;
          }

          if (precio === "") {
              alert("Por favor, ingresa el precio");
              return false;
          }

          if (stock === "") {
              alert("Por favor, ingrese una cantidad de stock");
              return false;
          }

          if (ingredientes === "") {
              alert("Por favor, ingrese los ingredientes");
              return false;
          }
          else if (!expresiondos.test(ingredientes)) {
          window.alert("Error: Campo Ingredientes Invalido");
          return false;
      }


          if (uso === "") {
              alert("Por favor, ingrese el uso del producto");
              return false;
          }
          else if (!expresiondos.test(uso)) {
          window.alert("Error: Campo Uso Invalido");
          return false;
      }

          return true;
      }

   
/////////////////////////////VALIDACIONES DE eliminar PRODUCTOS//////////////////////////////////////////////////////////////////////////////////////////////
function validarEliminar() { 
    var nombreproductoEliminar = document.getElementById("productoEliminar").value;

    if (nombreproductoEliminar === "") {
        alert("Por favor, elija el producto disponible");
        return false;
    } 
 }
 