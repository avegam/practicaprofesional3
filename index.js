
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const productoModel = require('./server/modelos/producto'); // Asegúrate de ajustar la ruta según la ubicación de tu modelo
const mercadopago = require("mercadopago"); // mercado pago
const jwt = require('jsonwebtoken'); // token de login
const {authorize, checkUser } = require('./server/AutorizacionMiddleware'); // Verifica si el usuario esta logueado  y rol
const bodyParser=require('body-parser'); 
const bcrypt= require('bcrypt'); // Encriptar contraseña 
const userModelo= require('./server/modelos/user'); // Modelo de base de datos
const hashPassword = require('./server/utiluser');  // Encriptacion contrase en base de datos
const facturaModelo= require('./server/modelos/factura'); // Modelo de base de datos
const contactoModelo= require('./server/modelos/contacto'); // Modelo de base de datos
const multer  = require('multer'); // Subir archivos
const fetch = require('node-fetch'); // Im
const nodemailer = require('nodemailer'); // Importa nodemailer para enviar correos electrónicos con contraseña

// Token de Mercado Pago

// view engine
// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
access_token:"TEST-2643009668753140-112518-a9bb2fbc8f1f5ac0960837e56681f5e9-1566400118",
});

app.set('view engine', 'ejs'); // Aplica para que se utilice ejs en archivos
// Especificar la ubicación de las vistas
app.set('views', path.join(__dirname, 'client', 'html'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/client/imagenes'));
app.use(express.static(path.join(__dirname, "/client")));
app.use(cors());

app.get('*', checkUser); //

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/imagenes') // Guarda los archivos en la carpeta 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Asigna un nombre único al archivo
  }
});

// Configuracion de archivos para subir a la pagina
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB
  }
});

// Rutas a Iniciar sesion
app.get('/ingresar', (req, res) => res.render('ingresar'));
// Rutas a ingreso exitoso
app.get('/loginexitoso', (req, res) => res.render('loginexito'));
// Rutas a registrar
app.get('/registrar', (req, res) => res.render('registrar'));
// Rutas a Index Principal
app.get(["/", "/home"], (req, res) => res.render('index'));
// Ruta a Productos
app.get('/productos', (req, res) => res.render('productos'));
// Ruta a Productos detallados
app.get('/detalleproducto/*', (req, res) => res.render('detalleproducto'));
// Ruta a Productos detallados
app.get('/registrar', (req, res) => res.render('registrar')); 
// Ruta a Contacto
app.get('/contacto', (req, res) => res.render('contacto'));
// Rutas a Shop
app.get('/shop', (req, res) => res.render('shop'));
// Rutas a Olvidar Contraseña
app.get('/olvidarcontrasena', (req, res) => res.render('olvidarcontrasena'));
//  Vista Administrador 
app.get('/administrador',authorize('Admin'), (req, res) => res.render('administrador'));
// Rutas a Editar Productos
app.get('/editarproductos',authorize('Admin'), (req, res) => res.render('editarproductos'));
// Rutas a Pedidos pendientes (Inventario)
app.get('/factura', authorize('Admin'), (req, res) => res.render('factura'));
// Rutas a Pedidos entregados (Inventario)
app.get('/facturaentregado', authorize('Admin'), (req, res) => res.render('facturaentregado'));
// Rutas a Pedidos rechazados (Inventario)
app.get('/facturarechazado', authorize('Admin'), (req, res) => res.render('facturarechazado'));
// Rutas a Factura
app.get('/facturab', authorize('Admin'), (req, res) => res.render('facturab'));
// Rutas a Perfil usuario
app.get('/perfil', (req, res) => res.render('perfil'));
// Rutas a Cambiar Contraseña
app.get('/cambiarContrasena', (req, res) => res.render('cambiarContrasena'));

// Rutas a Editar Contacto
app.get('/editarcontacto', (req, res) => res.render('editarcontacto'));
// Rutas a error
app.get('/errorPage', (req, res) => res.render('error'));
// Rutas a error
app.get('/exitoMes', (req, res) => res.render('Exitomes'));

app.get('/logout', async (req, res) => {
  res.cookie('Token', '', { maxAge: 1 });
  res.redirect('/');
});



app.post("/create_preference", (req, res) => {
  console.log("quiero ver este")
  console.log(req.body.item)
  console.log(req.body.additional)
  let preference = {
    items: req.body.item,   // Items todos los productos que el usuario esta comprando
    metadata:{id_user: req.body.additional}   // Adicaciona: Seria datos del usuario
    , 
    // Url estado del pago realizado
    back_urls: {
      success: "https://practicap3.onrender.com/home",    
      failure: "https://practicap3.onrender.com/home",
      pending: "",  
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      res.json({
        id: response.body.id,
      });
      
    })
    .catch(function (error) {
      console.log(error);
    });
});



// Configura el puerto utilizado segun la pagina este online o local 
const port = process.env.PORT || 8080;
app.listen(8080, () => {
  console.log(`The server is now running on Port ${port}`);
});



// Conexion Base de datos Mongo DB 
const mongoose=require('mongoose')


const user = 'practica3';
const password = 'practica3';
const dbame = 'hygge-db';
const uri = `mongodb+srv://${user}:${password}@cluster0.zklcrmn.mongodb.net/${dbame}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }) 
  .then(()=> console.log('conectado a mongodb')) 
  .catch(e => console.log('error de conexión', e))




// Todos los datos que me devulve mercado pago los escribe en la factura

app.post("/facturita",function (req, res) {
    // Manejar la notificación del webhook aquí
    console.log('Notificación recibida:', req.body);
    res.status(200).send('OK');
    const cosita = req.body.data.id  // Lee el id del dato que manda mercado pago
    const urlpay = `https://api.mercadopago.com/v1/payments/${cosita}`;  // arma una url con el id de cosita
    const acctoken = 'TEST-2643009668753140-112518-a9bb2fbc8f1f5ac0960837e56681f5e9-1566400118'; // token de mercado pago
    fetchDataAndSave(urlpay, acctoken, res); 
});

// Toma todos los datos de mercado pago
async function fetchDataAndSave(urlpay, acctoken, res) {
  try { 
      const response = await fetch(urlpay, {
          method: 'GET',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + acctoken
          }
      });

      const data = await response.json();

      console.log('Respuesta de la solicitud:', data);
      console.log('Respuesta de la solicitud json:', JSON.stringify(data, null, 2));
      const jsonData = JSON.stringify(data, null, 2);
      const dataObject = JSON.parse(jsonData);  
      // Guardamos los datos que nos devuelve mercado pago en variables
      const { status, status_detail, date_approved, transaction_amount, payment_type_id, payment_method_id, issuer_id, installments, currency_id, transaction_details, payer, charges_details, money_release_date, description } = dataObject;
      const idTransaccion = data.id;
      const items = data.additional_info.items;
      const id_user = data.metadata.id_user; // 
     // Hacer una solicitud fetch para obtener los datos del usuario
      const usuario = await getUserData(id_user);
      const nombre = usuario.Nombre ;
      const apellido = usuario.Apellido;
      const mail = usuario.Email;
      const telefono = usuario.Telefono;
      const pedido = "pendiente";
      //console.log("factura formato:")
      //console.log(items ,idTransaccion,status, status_detail, date_approved, transaction_amount, payment_type_id, payment_method_id, issuer_id, installments, currency_id, transaction_details, payer, charges_details, money_release_date, description)
      
      // ARMA LA FACTURA
      const factura = new facturaModelo({
          status, status_detail, date_approved, transaction_amount, payment_type_id,
          payment_method_id, issuer_id, installments, currency_id, transaction_details,
          payer, charges_details, money_release_date, description, idTransaccion, items,pedido,nombre,apellido,mail,telefono
      });

      console.log(factura);
      // GUARDA LA FACTURA EN LA BASE DE DATOS
      await factura.save();
      //res.status(200).send("factura cargada");
  } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      //res.status(500).send("Error al cargar factura");
  }
}

async function getUserData(userID) {

  // Hacer una solicitud fetch para obtener los datos del usuario
  return fetch(`https://practicap3.onrender.com/usuario/${userID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo obtener los datos del usuario');
      }
      return response.json();
    })
    .then(userData => {
      // userData contiene los datos del usuario
      return userData;
    })
    .catch(error => {
      console.error('Error al obtener los datos del usuario:', error);
    });
}

// Ruta para factura 
app.get('/facturab/*', authorize('Admin'), (req, res) => res.render('facturab'));


// Ruta para obtener datos de factura desde MongoDB
app.get('/facturadatos', async (req, res) => {
  try {
    const documentos = await facturaModelo.find({}); // busca todos los en la base de datos
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
  
});

// Ruta para obtener datos de la factura filtrados por ID
app.get('/detallefactura/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const documento = await facturaModelo.findOne({idTransaccion: id}); // realiza la busqueda en la base de datos
    if (!documento) {
      return res.status(404).json({ mensaje: 'factura no encontrado' });
    }
    res.json(documento); // mensaje exitoso
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});

// Ruta para editar un campo de la factura por ID para cambiar el estado de la facutara, pendiente, entregado, rechazado
app.patch('/pedido/:id', async (req, res) => {
  const id = req.params.id;
  const nuevoCampo = req.body.nuevoCampo; // Asegúr  tener el nuevo valor en el cuerpo de la solicitud
  console.log(nuevoCampo)
  try {
    // Encuentra el documento existente en la Base de datos por ID y actualiza el campo especificado
    const documento = await facturaModelo.findOneAndUpdate(
      { idTransaccion: id },
      { $set: { pedido: nuevoCampo } },
      { new: true } // Esto devuelve el documento actualizado
    );

    if (!documento) {
      return res.status(404).json({ mensaje: 'Factura no encontrado' });
    }

    res.json(documento);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar datos en la base de datos' });
  }
});


// mercado pago 
app.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

// Ruta para obtener datos de todos los productos desde MongoDB
app.get('/datos', async (req, res) => {
  try {
    const documentos = await productoModel.find({});
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
  
});

// Ruta para obtener detalle del productos filtrados por ID
app.get('/detalle/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const documento = await productoModel.findById(id);
    if (!documento) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(documento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});

// Ruta para obtener datos del usuario filtrados por ID
app.get('/usuario/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const documento = await userModelo.findById(id);
    if (!documento) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(documento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});

// Editar perfil del usuario
app.post('/editarperfil', async (req, res) => {
  const perfilId = req.body.id; // Obtén el ID del Perfil Usuario seleccionado desde el cuerpo de la solicitud POST
  const { Nombre, Apellido, Telefono } = req.body;
  
  try {            // Busca en la base de datos el usuario por id y lo actualiza
    await userModelo.findByIdAndUpdate(perfilId, { 
      Nombre, Apellido, Telefono  
    });
    res.status(200).redirect("/exitoMes?exitoso=Perfil actualizado");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/errorPage?error=Error al actualizar el Perfil");
  }
});


// CAMBIAR CONTRASEÑA DEL USUARIO

app.post('/Cambiarpass', async (req, res) => {
  const perfilId = req.body.id; // Obtén el ID del usuario seleccionado desde el cuerpo de la solicitud POST para cambiar la clave
  const { password,password2,password3 } = req.body;
  

  try { // Busca en la base de datos el  id usuario
    const user = await userModelo.findById(perfilId);

    console.log(user);

    if (!user) {  // si no existe muestra el error
      return res.status(500).redirect("/errorPage?error=Error: el usuario no existe");
    }
    // chequea que la contraseña sea correcta
    const result = await user.isCorrectPassword(password);
    if (!result) { // si la contraseña es incorrecta muestra el siguiente mensaje
      return res.status(400).redirect("/errorPage?error=La contraseña actual no es correcta");
    }
    if (result) { // si la clave actual es correcta 
      user.password = password2; // pone la clave nueva en el modelo del usuario
      const hashedPassword = await hashPassword(user); // encripta la clave nueva en la base de datos
      // Actualiza el documento en la base de datos
    await userModelo.updateOne({ _id: perfilId }, { $set: { password: hashedPassword } }); // guarda la clave nueva

    res.status(200).redirect("/exitoMes?exitoso=Contraseña actualizada exitosamente"); // redirecciona a pagina
  } 
 }
 catch (error) {
    console.error(error);
    res.status(500).redirect("/errorPage?error=Error al cambiar la contraseña");
  }    
});

 
// insertar productos mediante un archivo json
const fs = require('fs').promises;  // Módulo de sistema de archivos de Node.js

async function insertarProductos() {
  try {
    // Leer el contenido del archivo productos.json
    const contenidoJSON = await fs.readFile('server/productosbase.json', 'utf-8');
    const productosjson = JSON.parse(contenidoJSON);

    // Insertar cada producto en la base de datos
    for (const productojson of productosjson) {
      const nuevoProducto = new productoModel(productojson);
      await nuevoProducto.save();
    }

    console.log('Productos insertados correctamente');
  } catch (error) {
    console.error('Error al insertar productos:', error);
  }
}

// Ruta para obtener los datos de productos de Mongo db
app.get('/datos', async (req, res) => {
  try {
    const documentos = await productoModel.find({});
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
  
});

//insertarProductos();

// Busca los datos de la empresa en la base de datos
app.get('/datoscontactos', async (req, res) => {
  try {
    const documentos = await contactoModelo.findOne({ Contacto: "este" }); // Busco por la palabra "este" el contacto
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
  
});

// Editar los datos de contacto de la empresa 
app.post('/editarcontacto', async (req, res) => {
  const {Telefono,Email,Ubicacion } = req.body;
  console.log(req.body)
  console.log(Telefono + " " + Email + Ubicacion)
  try {
    await contactoModelo.findOneAndUpdate({ Contacto: "este" }, { // busca por campo contacto este y Actualiza los datos y 
      Telefono,
      Email,
      Ubicacion
    }, { new: true }); // Devuelve el documento actualizado
    res.status(200).redirect("/exitoMes?exitoso=contacto actualizado");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/errorPage?error=Error al actualizar el contacto");
  }
});

// insertar contacto mediante un archivo json
async function insertarcontacto() {
  try {
    // Leer el contenido del archivo productos.json
    const contenidoJSON = await fs.readFile('server/contactobase.json', 'utf-8');
    const contactosjson = JSON.parse(contenidoJSON);

    // Insertar cada contacto en la base de datos
    for (const contactojson of contactosjson) {
      const nuevocontacto = new contactoModelo(contactojson);
      await nuevocontacto.save(); // guarda el contacto 
    }

    console.log('contacto insertados correctamente');
  } catch (error) {
    console.error('Error al insertar contacto:', error);
  }
}

//insertarcontacto();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Carga el nuevo producto desde la vista editar productos administrador
app.post('/nuevoproducto',upload.single('imagen'), async (req, res) => {
  const { nombre, precio, stock,ingredientes,uso } = req.body;
  
  // El nombre del archivo subido estará en req.file.filename
  // Envía el nombre del archivo en la respuesta
  const imagen = req.file.filename;
 console.log(req.body)
  const producto = new productoModel({ nombre, precio, imagen, stock,ingredientes,uso}); // Crea un modelo nuevo de productos con sus campos
  console.log(producto)
  try {
    await producto.save(); // Se guarda en la base de datos los productos de la linea 497
    res.status(200).redirect("/exitoMes?exitoso=producto registrado");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/errorPage?error=Error al registrar el producto");
  }
});

// Editar los productos 
app.post('/editarproducto', upload.single('imagen'), async (req, res) => {
  const productoId = req.body.productoEditar; // Obtén el ID del producto seleccionado desde el cuerpo de la solicitud POST
  const { nombre, precio, stock, ingredientes, uso } = req.body;
  const imagen = req.file ? req.file.filename : null; // Si se proporciona una nueva imagen, actualizarla
  
  try {
    await productoModel.findByIdAndUpdate(productoId, { // busca y te acualiza el productos seleccionado
      nombre,
      precio,
      imagen,
      stock,
      ingredientes,
      uso
    });
    res.status(200).redirect("/exitoMes?exitoso=Producto actualizado");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/errorPage?error=Error al actualizar el producto");
  }
});

// Eliminar Producto
app.post('/eliminarproducto', async (req, res) => {
  try {
    console.log(req.body)        // productoEliminar seria el id de la lista de productos que se ven en el administrador
    const productoId = req.body.productoEliminar; // Obtén el ID del producto seleccionado desde el cuerpo de la solicitud POST
    console.log(productoId)
    await productoModel.findByIdAndDelete(productoId); // Elimina de la base de datos
    res.status(200).redirect("/exitoMes?exitoso=Producto eliminado");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/errorPage?error=Error al eliminar el producto");
  }
});


/* REGISTRO DE USUARIO*/ 
app.post('/registrar', async (req, res) => {
  const { Nombre, Apellido, Email, password,Telefono } = req.body; // completa el usuario los datos que se le piden
 console.log(req.body)
  const Rol = "cliente"
  const user = new userModelo({ Nombre, Apellido, Email, password,Rol,Telefono }); // te crea el modelo de usuario con los datos cargados
  console.log(user)
  try {
    await user.save(); // guarda en la base de datos los datos del usuario
    res.status(200).redirect("/exitoMes?exitoso=Usuario registrado");
  } catch (error) {
    console.error(error);
    //res.status(500).send("Error al registrar el usuario: " + error);
    res.status(500).redirect("/errorPage?error=Error al registrar el usuario: " + error);
  }
});


//AUTENTICACION DE LOGIN USUARIO
const secretKey = 'tu_clave_secreta'; // Reemplaza con tu clave secreta

app.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;
 console.log(req.body);
  console.log(email);

  try {
    const user = await userModelo.findOne({ Email: email }); // busca en la base de datos el email

    console.log(user);

    if (!user) {
      return res.status(500).redirect("/errorPage?error=Error: el usuario no existe");
    }

    const result = await user.isCorrectPassword(password); // llama a la funcion iscorrectpassword para chequear la clave si es correcta

    if (result) {
      // Autenticado correctamente, generando el token
      //const token = generateAuthToken(user);
      user.generateAuthToken()
        .then(token => {
          console.log(token);
          // Continúa con el código que utiliza el token aquí
          //return res.status(200).redirect(`/loginexitoso?x-auth-token=${token}`);
          // Establecer la cookie
           res.cookie('Token', token, { maxAge: 9000000, httpOnly: true });
           console.log("este rol?"+ user.Rol)
           

           if (user.Rol === "Admin") {
            return res.status(200).redirect('/editarproductos'); // admin al producto
          } else {
            return res.status(200).redirect('/'); // Cliente te envia pagina principal 
          }
        })
        .catch(error => {
          console.error('Error al generar el token:', error);
        });

      
    } else {
      return res.status(500).redirect("/errorPage?error=Usuario y/o contraseña incorrecta"); 
    }
  } catch (error) {
    console.error(error);
    return res.status(500).redirect("/errorPage?error=Error al autenticar el usuario");
  }
});


// OLVIDAR CONTRASEÑA 
app.post('/olvidarpass', async (req, res) => {
  const { Email } = req.body; 
  console.log(Email) // te pide el correo electronico
  try {
    // Busca el usuario por su dirección de correo electrónico en la base de datos
    const user = await userModelo.findOne({Email});

    if (!user) { // si el email no existe te manda el mensaje de usuario no encontrado
      return res.status(404).send("Usuario no encontrado");
    }

    // Genera una nueva contraseña aleatorea
    const nuevaContraseñaTemporal = generarContraseñaAleatoria();

    // Actualiza la contraseña  del usuario en el modelo
    user.password = nuevaContraseñaTemporal;
    //await user.save();
    const hashedPassword = await hashPassword(user); // encripta la clave 
    // Actualiza la contraseña nueva en la base de datos 
  await userModelo.updateOne({ _id: user.id }, { $set: { password: hashedPassword } });

    // Envía un correo electrónico al usuario con la nueva contraseña temporal
    await enviarCorreoElectrónico(Email, nuevaContraseñaTemporal);

    res.status(200).redirect("/exitoMes?exitoso=Se ha enviado una nueva contraseña temporal al correo electrónico proporcionado");
  } catch (error) {
    console.error(error);
    res.status(500).redirect("/errorPage?error=Error al procesar la solicitud");
  }
});
 
// Generar contraseña aleatorea que se envia al correo
function generarContraseñaAleatoria() {
  const longitud = 10;
  const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
  const letrasMayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digitos = '0123456789';
  const caracteresEspeciales = '$@$!%*?&#.$($)$-$_';
  const caracteres = letrasMinusculas + letrasMayusculas + digitos + caracteresEspeciales;
  let contraseña = '';

  // Agregar al menos un carácter de letras minusculas
  contraseña += letrasMinusculas.charAt(Math.floor(Math.random() * letrasMinusculas.length));
   // Agregar al menos un carácter de letras Mayusculas
  contraseña += letrasMayusculas.charAt(Math.floor(Math.random() * letrasMayusculas.length));
  // Agregar al menos un carácter de digitos
  contraseña += digitos.charAt(Math.floor(Math.random() * digitos.length));
  // Agregar al menos un carácter especial
  contraseña += caracteresEspeciales.charAt(Math.floor(Math.random() * caracteresEspeciales.length));

  // Completar el resto de la contraseña con caracteres aleatorios
  for (let i = 0; i < longitud - 4; i++) { // 4 caracteres ya han sido añadidos
    contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  
  // Asegurarse de que la contraseña esté mezclada
  contraseña = contraseña.split('').sort(function(){return 0.5-Math.random()}).join('');
  
  return contraseña;  // Devulve la contraseña mezclada
}


// Función para enviar un correo electrónico al usuario
async function enviarCorreoElectrónico(destinatario, nuevaContraseña) {
  // Configuracion  del transporte de nodemailer con las credenciales  de correo electrónico 
  let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'practicaprofesional33@hotmail.com',
      pass: 'Ifts2023'
    }
  });

  // Configura el correo electrónico a enviar
  let mailOptions = {
    from: 'practicaprofesional33@hotmail.com',
    to: destinatario,
    subject: 'Restablecimiento de contraseña',
    text: `Se ha restablecido tu contraseña. Tu nueva contraseña es: ${nuevaContraseña} por favor cambiarla despues del primer uso`
  };

  // Envía el correo electrónico
  await transporter.sendMail(mailOptions);
}
