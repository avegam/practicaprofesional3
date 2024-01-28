const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const productoModel = require('./server/modelos/producto'); // Asegúrate de ajustar la ruta según la ubicación de tu modelo
const mercadopago = require("mercadopago");
const jwt = require('jsonwebtoken');
const authorize = require('./server/AutorizacionMiddleware');


// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
access_token:"TEST-2643009668753140-112518-a9bb2fbc8f1f5ac0960837e56681f5e9-1566400118",
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + '/client/imagenes'));
app.use(express.static(path.join(__dirname, "/client")));
app.use(cors());


// Rutas a Iniciar sesion
app.get("/ingresar", function (req, res) {
  const filePath = path.resolve(__dirname, "client","html", "ingresar.html"); 
  res.sendFile(filePath);
});
// Rutas a ingreso exitoso
app.get("/loginexitoso", function (req, res) {
  const filePath = path.resolve(__dirname, "client","html", "loginexito.html"); 
  res.sendFile(filePath);
});

// Rutas a registrar
app.get("/registrar", function (req, res) {
  const filePath = path.resolve(__dirname,  "client","html", "registrar.html"); 
  res.sendFile(filePath);
});

// Rutas a Index Principal
app.get(["/", "/home"], function (req, res) {
  const filePath = path.resolve(__dirname, "client", "html", "index.html"); 
  res.sendFile(filePath);
});


// Ruta a Productos
app.get("/productos",authorize('Admin'), function (req, res) {
  const filePath = path.resolve(__dirname, "client", "html","productos.html"); 
  res.sendFile(filePath);
});

// Ruta a Productos detallados
app.get("/detalleproducto/*",authorize('Admin'), function (req, res) {
  const filePath = path.resolve(__dirname, "client", "html","detalleproducto.html"); 
  res.sendFile(filePath);
});

// Ruta a Productos detallados
app.get("/modificarproducto/*",authorize('Admin'), function (req, res) {
  const filePath = path.resolve(__dirname, "client", "html","modificarproducto.html"); 
  res.sendFile(filePath);
});

// Ruta a Contacto
app.get("/contacto", function (req, res) {
  const filePath = path.resolve(__dirname, "client","html", "contacto.html"); 
  res.sendFile(filePath);
});

// Rutas a Shop
app.get("/shop", function (req, res) {
  const filePath = path.resolve(__dirname, "client", "html","shop.html"); 
  res.sendFile(filePath);
});

// Rutas a Olvidar Contraseña
app.get("/olvidarcontrasena", function (req, res) {
  const filePath = path.resolve(__dirname, "client", "html","olvidarcontrasena.html"); 
  res.sendFile(filePath);
});




app.post("/create_preference", (req, res) => {
  console.log("quiero ver este")
  console.log(req.body)
  let preference = {
    items: req.body
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

app.post("/facturita", function (req, res) {
  /*res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });*/
    // Manejar la notificación del webhook aquí
    console.log('Notificación recibida:', req.body);
    res.status(200).send('OK');
});

app.get("/feedback", function (req, res) {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
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



// Schema:

const clienteSchema = mongoose.Schema({
    nombre: String,
    apellido: String,
    direccion: String,
    email: String,
    telefono: String
})

const ClienteModel= mongoose.model('clientes',clienteSchema);

// Mostar datos bd:


const mostrar= async()=>{
  const clientes=await ClienteModel.find()
  //console.log(clientes)
}

mostrar()

// Mostar datos bd:


const mostrar2= async()=>{
const producto=await productoModel.find()
//console.log(producto)
}

mostrar2()


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

const bodyParser=require('body-parser');
const bcrypt= require('bcrypt');
const userModelo= require('./server/modelos/user');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



/* REGISTRO DE USUARIO*/ 
app.post('/registrar', async (req, res) => {
  const { Nombre, Apellido, Email, password } = req.body;
 console.log(req.body)
 const Rol = "cliente"
  const user = new userModelo({ Nombre, Apellido, Email, password,Rol });
  console.log(user)
  try {
    await user.save();
    res.status(200).send("Usuario registrado");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario");
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
          return res.status(200).redirect(`/loginexitoso?x-auth-token=${token}`);
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




// Función para generar el token JWT
/*
function generateAuthToken(user) {
  return jwt.sign({ _id: user._id }, secretKey, { expiresIn: '1h' }); // Puedes ajustar la duración del token según tus necesidades
}*/


