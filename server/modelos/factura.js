// Conexion Base de datos Mongo 
const mongoose=require('mongoose')

const FacturaSchema = mongoose.Schema({
    //Datos de la transacción
    idTransaccion: String,
    transaction_amount: String,
    status: String,
    status_detail: String,
    date_approved: String,
    //Detalles del pago:
    payment_type_id: String,
    payment_type_id: String,
    payment_method_id: String,
    issuer_id: String,
    installments: String,
    currency_id: String,
    transaction_details: String,
    //Detalles del comprador:
    payer: String,
    //Detalles del artículo(s):

    Productsitems: String,
    //Cargos y comisiones:

    charges_details: String,
    //Fecha de liberación de fondos:

    money_release_date: String,
    //Datos de facturación:

    description: String

  })
  
  const FacturacionModel= mongoose.model('factura',FacturaSchema);

  module.exports = FacturacionModel;


/*  Datos de la transacción:

id: Identificador único de la transacción.
status: Estado de la transacción (por ejemplo, "approved").
status_detail: Detalle del estado de la transacción (por ejemplo, "accredited").
date_approved: Fecha y hora en que se aprobó la transacción.
transaction_amount: Monto total de la transacción.
Detalles del pago:

payment_type_id: Identificador del tipo de pago (por ejemplo, "account_money").
payment_method_id: Identificador del método de pago (por ejemplo, "account_money").
issuer_id: Identificador del emisor del método de pago.
installments: Número de cuotas (si es aplicable).
currency_id: Identificador de la moneda (por ejemplo, "ARS").
transaction_details: Detalles adicionales de la transacción, como el monto neto recibido, el monto total pagado, etc.
Detalles del comprador:

payer: Información sobre el comprador, como su identificación, nombre, email, etc.
Detalles del artículo(s):

additional_info.items: Array que contiene detalles de los artículos comprados, incluyendo title, quantity, unit_price, etc.
Cargos y comisiones:

charges_details: Detalles de cargos, incluyendo información sobre comisiones de Mercado Pago.
Fecha de liberación de fondos:

money_release_date: Fecha en que se liberarán los fondos.
Datos de facturación:

description: Descripción general de la transacción (puede ser el título de un artículo o una descripción más detallada).
*/