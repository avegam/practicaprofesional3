const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const productoModel = require('./server/modelos/producto'); // Asegúrate de ajustar la ruta según la ubicación de tu modelo
const mercadopago = require("mercadopago");
const jwt = require('jsonwebtoken');
const {authorize, checkUser } = require('./server/AutorizacionMiddleware');
const bodyParser=require('body-parser');
const bcrypt= require('bcrypt');
const userModelo= require('./server/modelos/user');
const { checkExistingEmail, hashPassword }=require('./server/utiluser');
const facturaModelo= require('./server/modelos/factura');
const contactoModelo= require('./server/modelos/contacto');
const multer  = require('multer');
const fetch = require('node-fetch');
const nodemailer = require('nodemailer'); // Importa nodemailer para enviar correos electrónicos

// view engine
// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
access_token:"TEST-2643009668753140-112518-a9bb2fbc8f1f5ac0960837e56681f5e9-1566400118",
});

app.set('view engine', 'ejs');
// Especificar la ubicación de las vistas
app.set('views', path.join(__dirname, 'client', 'html'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/client/imagenes'));
app.use(express.static(path.join(__dirname, "/client")));
app.use(cors());

app.get('*', checkUser);

// Configurar multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/imagenes') // Guarda los archivos en la carpeta 'uploads'
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Asigna un nombre único al archivo
  }
});
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

app.get('/logout', async (req, res) => {
  res.cookie('Token', '', { maxAge: 1 });
  res.redirect('/');
});



app.post("/create_preference", (req, res) => {
  console.log("quiero ver este")
  console.log(req.body.item)
  console.log(req.body.additional)
  let preference = {
    items: req.body.item,
    metadata:{id_user: req.body.additional}
    ,
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




const port = process.env.PORT || 8080;
app.listen(8080, () => {
  console.log(`The server is now running on Port ${port}`);
});



/* PONER LA IP EN MONGO DB */


// Conexion Base de datos Mongo DB CODIGO LUCAS
const mongoose=require('mongoose')

const user = 'practica3';
const password = 'practica3';
const dbame = 'hygge-db';
const uri = `mongodb+srv://${user}:${password}@cluster0.zklcrmn.mongodb.net/${dbame}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('conectado a mongodb')) 
  .catch(e => console.log('error de conexión', e))


// Mostar datos bd:


app.post("/facturita",function (req, res) {
    // Manejar la notificación del webhook aquí
    console.log('Notificación recibida:', req.body);
    res.status(200).send('OK');
    const cosita = req.body.data.id
    const urlpay = `https://api.mercadopago.com/v1/payments/${cosita}`;
    const acctoken = 'TEST-2643009668753140-112518-a9bb2fbc8f1f5ac0960837e56681f5e9-1566400118'; // Reemplaza con tu token
    fetchDataAndSave(urlpay, acctoken, res);
});

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
      const { status, status_detail, date_approved, transaction_amount, payment_type_id, payment_method_id, issuer_id, installments, currency_id, transaction_details, payer, charges_details, money_release_date, description } = dataObject;
      const idTransaccion = data.id;
      const items = data.additional_info.items;
      const id_user = data.metadata.id_user;
     // Hacer una solicitud fetch para obtener los datos del usuario
      const usuario = await getUserData(id_user);
      const nombre = usuario.Nombre ;
      const apellido = usuario.Apellido;
      const mail = usuario.Email;
      const telefono = usuario.Telefono;
      const pedido = "pendiente";
      //console.log("factura formato:")
      //console.log(items ,idTransaccion,status, status_detail, date_approved, transaction_amount, payment_type_id, payment_method_id, issuer_id, installments, currency_id, transaction_details, payer, charges_details, money_release_date, description)
      const factura = new facturaModelo({
          status, status_detail, date_approved, transaction_amount, payment_type_id,
          payment_method_id, issuer_id, installments, currency_id, transaction_details,
          payer, charges_details, money_release_date, description, idTransaccion, items,pedido,nombre,apellido,mail,telefono
      });

      console.log(factura);

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

app.get('/facturab/*', authorize('Admin'), (req, res) => res.render('facturab'));


// Ruta para obtener datos desde MongoDB
app.get('/facturadatos', async (req, res) => {
  try {
    const documentos = await facturaModelo.find({});
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
  
});

// Ruta para obtener datos filtrados por ID
app.get('/detallefactura/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const documento = await facturaModelo.findOne({idTransaccion: id});
    if (!documento) {
      return res.status(404).json({ mensaje: 'factura no encontrado' });
    }
    res.json(documento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});

// Ruta para editar un campo de la factura por ID
app.patch('/pedido/:id', async (req, res) => {
  const id = req.params.id;
  const nuevoCampo = req.body.nuevoCampo; // Asegúrate de tener el nuevo valor en el cuerpo de la solicitud
  console.log(nuevoCampo)
  try {
    // Encuentra el documento existente por ID y actualiza el campo especificado
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



app.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
});

// Ruta para obtener datos desde MongoDB
app.get('/datos', async (req, res) => {
  try {
    const documentos = await productoModel.find({});
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
  
});

// Ruta para obtener datos filtrados por ID
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

// Ruta para obtener datos filtrados por ID
app.get('/usuario/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const documento = await userModelo.findById(id);
    if (!documento) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(documento);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
});

app.post('/editarperfil', async (req, res) => {
  const perfilId = req.body.id; // Obtén el ID del producto seleccionado desde el cuerpo de la solicitud POST
  const { Nombre, Apellido, Telefono } = req.body;
  
  try {
    await userModelo.findByIdAndUpdate(perfilId, {
      Nombre, Apellido, Telefono
    });
    res.status(200).send("Perfil actualizado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el Perfil");
  }
});


app.post('/Cambiarpass', async (req, res) => {
  const perfilId = req.body.id; // Obtén el ID del producto seleccionado desde el cuerpo de la solicitud POST
  const { password,password2,password3 } = req.body;
  

  try {
    const user = await userModelo.findById(perfilId);

    console.log(user);

    if (!user) {
      return res.status(500).send("Error: el usuario no existe");
    }

    const result = await user.isCorrectPassword(password);
    if (!result) {
      return res.status(400).send("La contraseña actual no es correcta");
    }
    if (result) {
      user.password = password2;
      const hashedPassword = await hashPassword(user);
      // Actualiza el documento en la base de datos sin ejecutar los hooks pre-save
    await userModelo.updateOne({ _id: perfilId }, { $set: { password: hashedPassword } });

    res.status(200).send("Contraseña actualizada exitosamente");
  } 
 }
 catch (error) {
    console.error(error);
    res.status(500).send("Error al cambiar la contraseña");
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
app.get('/datos', async (req, res) => {
  try {
    const documentos = await productoModel.find({});
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
  
});

//insertarProductos();
app.get('/datoscontactos', async (req, res) => {
  try {
    const documentos = await contactoModelo.findOne({ Contacto: "este" });
    res.json(documentos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos desde la base de datos' });
  }
  
});

app.post('/editarcontacto', async (req, res) => {
  const {Telefono,Email,Ubicacion } = req.body;
  console.log(req.body)
  console.log(Telefono + " " + Email + Ubicacion)
  try {
    await contactoModelo.findOneAndUpdate({ Contacto: "este" }, {
      Telefono,
      Email,
      Ubicacion
    }, { new: true }); // Devuelve el documento actualizado
    res.status(200).send("contacto actualizado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el contacto");
  }
});

async function insertarcontacto() {
  try {
    // Leer el contenido del archivo productos.json
    const contenidoJSON = await fs.readFile('server/contactobase.json', 'utf-8');
    const contactosjson = JSON.parse(contenidoJSON);

    // Insertar cada producto en la base de datos
    for (const contactojson of contactosjson) {
      const nuevocontacto = new contactoModelo(contactojson);
      await nuevocontacto.save();
    }

    console.log('contacto insertados correctamente');
  } catch (error) {
    console.error('Error al insertar contacto:', error);
  }
}

//insertarcontacto();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/nuevoproducto',upload.single('imagen'), async (req, res) => {
  const { nombre, precio, stock,ingredientes,uso } = req.body;
    // El nombre del archivo subido estará en req.file.filename
  // Envía el nombre del archivo en la respuesta
  const imagen = req.file.filename;
 console.log(req.body)
  const producto = new productoModel({ nombre, precio, imagen, stock,ingredientes,uso});
  console.log(producto)
  try {
    await producto.save();
    res.status(200).send("producto registrado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el producto");
  }
});

app.post('/editarproducto', upload.single('imagen'), async (req, res) => {
  const productoId = req.body.productoEditar; // Obtén el ID del producto seleccionado desde el cuerpo de la solicitud POST
  const { nombre, precio, stock, ingredientes, uso } = req.body;
  const imagen = req.file ? req.file.filename : null; // Si se proporciona una nueva imagen, actualizarla
  
  try {
    await productoModel.findByIdAndUpdate(productoId, {
      nombre,
      precio,
      imagen,
      stock,
      ingredientes,
      uso
    });
    res.status(200).send("Producto actualizado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar el producto");
  }
});

app.post('/eliminarproducto', async (req, res) => {
  try {
    console.log(req.body)
    const productoId = req.body.productoEliminar; // Obtén el ID del producto seleccionado desde el cuerpo de la solicitud POST
    console.log(productoId)
    await productoModel.findByIdAndDelete(productoId);
    res.status(200).send("Producto eliminado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al eliminar el producto");
  }
});


/* REGISTRO DE USUARIO*/ 
app.post('/registrar', async (req, res) => {
  const { Nombre, Apellido, Email, password,Telefono } = req.body;
 console.log(req.body)
 const Rol = "cliente"
  const user = new userModelo({ Nombre, Apellido, Email, password,Rol,Telefono });
  console.log(user)
  try {
    await user.save();
    res.status(200).send("Usuario registrado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario: " + error);
  }
});


/* AUTENTICACION DE USUARIO  pero en serio*/
const secretKey = 'tu_clave_secreta'; // Reemplaza con tu clave secreta

app.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;
console.log(req.body);
  console.log(email);

  try {
    const user = await userModelo.findOne({ Email: email });

    console.log(user);

    if (!user) {
      return res.status(500).send("Error: el usuario no existe");
    }

    const result = await user.isCorrectPassword(password);

    if (result) {
      // Autenticado correctamente, generando el token
      //const token = generateAuthToken(user);
      user.generateAuthToken()
        .then(token => {
          console.log(token);
          // Continúa con el código que utiliza el token aquí
          //return res.status(200).redirect(`/loginexitoso?x-auth-token=${token}`);
          // Establecer la cookie
           res.cookie('Token', token, { maxAge: 900000, httpOnly: true });
           console.log("este rol?"+ user.Rol)
           
           if (user.Rol === "Admin") {
            return res.status(200).redirect('/editarproductos');
          } else {
            return res.status(200).redirect('/');
          }
        })
        .catch(error => {
          console.error('Error al generar el token:', error);
        });

      
    } else {
      return res.status(500).send("Usuario y/o contraseña incorrecta");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al autenticar el usuario");
  }
});



app.post('/olvidarpass', async (req, res) => {
  const { Email } = req.body;
  console.log(Email)
  try {
    // Busca el usuario por su dirección de correo electrónico
    const user = await userModelo.findOne({Email});

    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Genera una nueva contraseña temporal
    const nuevaContraseñaTemporal = generarContraseñaAleatoria();

    // Actualiza la contraseña del usuario en la base de datos
    user.password = nuevaContraseñaTemporal;
    //await user.save();
    const hashedPassword = await hashPassword(user);
    // Actualiza el documento en la base de datos sin ejecutar los hooks pre-save
  await userModelo.updateOne({ _id: user.id }, { $set: { password: hashedPassword } });

    // Envía un correo electrónico al usuario con la nueva contraseña temporal
    await enviarCorreoElectrónico(Email, nuevaContraseñaTemporal);

    res.status(200).send("Se ha enviado una nueva contraseña temporal al correo electrónico proporcionado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al procesar la solicitud");
  }
});

function generarContraseñaAleatoria() {
  const longitud = 10;
  const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
  const letrasMayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const digitos = '0123456789';
  const caracteresEspeciales = '$@$!%*?&#.$($)$-$_';
  const caracteres = letrasMinusculas + letrasMayusculas + digitos + caracteresEspeciales;
  let contraseña = '';

  // Agregar al menos un carácter de cada tipo requerido
  contraseña += letrasMinusculas.charAt(Math.floor(Math.random() * letrasMinusculas.length));
  contraseña += letrasMayusculas.charAt(Math.floor(Math.random() * letrasMayusculas.length));
  contraseña += digitos.charAt(Math.floor(Math.random() * digitos.length));
  contraseña += caracteresEspeciales.charAt(Math.floor(Math.random() * caracteresEspeciales.length));

  // Completar el resto de la contraseña con caracteres aleatorios
  for (let i = 0; i < longitud - 4; i++) { // 4 caracteres ya han sido añadidos
    contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  
  // Asegurarse de que la contraseña esté mezclada
  contraseña = contraseña.split('').sort(function(){return 0.5-Math.random()}).join('');
  
  return contraseña;
}


// Función para enviar un correo electrónico al usuario
async function enviarCorreoElectrónico(destinatario, nuevaContraseña) {
  // Configura el transporte de nodemailer (debes configurarlo con tus credenciales de correo electrónico)
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
