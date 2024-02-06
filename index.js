const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

const productoModel = require('./server/modelos/producto'); // Asegúrate de ajustar la ruta según la ubicación de tu modelo
const mercadopago = require("mercadopago");
const jwt = require('jsonwebtoken');
const authorize = require('./server/AutorizacionMiddleware');
const bodyParser=require('body-parser');
const bcrypt= require('bcrypt');
const userModelo= require('./server/modelos/user');
const facturaModelo= require('./server/modelos/factura');

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

// Rutas a Editar Productos
app.get("/editarproductos", function (req, res) {
  const filePath = path.resolve(__dirname, "client", "html","editarproductos.html"); 
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

app.post("/facturita",function (req, res) {
  /*res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });*/
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
      const pedido = "pendiente";
      console.log("factura formato:")
      console.log(items ,idTransaccion,status, status_detail, date_approved, transaction_amount, payment_type_id, payment_method_id, issuer_id, installments, currency_id, transaction_details, payer, charges_details, money_release_date, description)
      const factura = new facturaModelo({
          status, status_detail, date_approved, transaction_amount, payment_type_id,
          payment_method_id, issuer_id, installments, currency_id, transaction_details,
          payer, charges_details, money_release_date, description, idTransaccion, items,pedido
      });

      console.log(factura);

      await factura.save();
      //res.status(200).send("factura cargada");
  } catch (error) {
      console.error('Error al realizar la solicitud:', error);
      //res.status(500).send("Error al cargar factura");
  }
}
app.get("/factura", function (req, res) {
  const filePath = path.resolve(__dirname, "client", "html","factura.html"); 
  res.sendFile(filePath);
});

app.get("/facturab/*", function (req, res) {
  const filePath = path.resolve(__dirname, "client", "html","facturab.html"); 
  res.sendFile(filePath);
});

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

/*fetch(urlpay, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + acctoken
  }
})
  .then(response => response.json())
  .then(data => {
    console.log('Respuesta de la solicitud:', data);
    // Puedes realizar acciones adicionales con la respuesta recibida
    console.log('Respuesta de la solicitud json:',JSON.stringify(data, null, 2)); // 2 indica la cantidad de espacios de indentación
    // Puedes realizar acciones adicionales con la respuesta recibida
    const { status, status_detail,date_approved, transaction_amount, payment_type_id, payment_method_id, issuer_id, installments, currency_id, transaction_details, payer, charges_details, money_release_date,description } = data;
    const idTransaccion = data.id;
    const items = data.additional_info.items;
     const factura = new facturaModelo({ status, status_detail,date_approved, transaction_amount, payment_type_id, payment_method_id, issuer_id, installments, currency_id, transaction_details, payer, charges_details, money_release_date,description ,idTransaccion,items });
     console.log(factura)
     try {
       await factura.save();
       res.status(200).send("factura cargada");
     } catch (error) {
       console.error(error);
       res.status(500).send("Error al cargar factura");
     }
  })
  .catch(error => {
    console.error('Error al realizar la solicitud:', error);
    // Maneja el error de alguna manera adecuada para tu aplicación
  });*/


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


