// Conexion Base de datos Mongo 
const mongoose=require('mongoose')

const TransactionDetailsSchema = mongoose.Schema({
    _id: false,
    acquirer_reference: { type: String, default: 'vacio' },
    external_resource_url: { type: String, default: 'vacio' },
    financial_institution: { type: String, default: 'vacio' },
    installment_amount: { type: String, default: 'vacio' },
    net_received_amount: { type: String, default: 'vacio' },
    overpaid_amount: { type: String, default: 'vacio' },
    payable_deferral_period: { type: String, default: 'vacio' },
    payment_method_reference_id: { type: String, default: 'vacio' },
    total_paid_amount: { type: String, default: 'vacio' }
});

const PhoneSchema = mongoose.Schema({
    _id: false,
    number: String,
    extension: String,
    area_code: String
});

const idenSchema = mongoose.Schema({
    _id: false,
    number: String,
    type: String
});

const PayerSchema = mongoose.Schema({
    _id: false,
    identification: idenSchema,
    entity_type: String,
    phone: PhoneSchema,
    last_name: { type: String, default: 'vacio' },
    id: { type: String, default: 'vacio' },
    type: { type: String, default: 'vacio' },
    first_name: { type: String, default: 'vacio' },
    email: { type: String, default: 'vacio' }
    // ... otros campos ...
});

const ChargeDetailsSchema = mongoose.Schema({
    _id: false,
    accounts: {
        from: String,
        to: String
    },
    amounts: {
        original: Number,
        refunded: Number
    },
    client_id:{ type: String, default: 'vacio' },
    date_created: { type: String, default: 'vacio' },
    id: { type: String, default: 'vacio' },
    last_updated:{ type: String, default: 'vacio' },
    //metadata: { type: String, default: 'vacio' },
    name: { type: String, default: 'vacio' },
    //refund_charges: { type: String, default: 'vacio' },
    reserve_id: { type: String, default: 'vacio' },
    type: { type: String, default: 'vacio' }
    // ... otros campos ...
});

const ItemSchema = mongoose.Schema({
    _id: false,
    category_id: String,
    description: String,
    id: String,
    picture_url: String,
    quantity: String,
    title: String,
    unit_price: String
});

const FacturaSchema = mongoose.Schema({
    //Datos de la transacción
    idTransaccion: String,
    transaction_amount: String,
    status: String,
    status_detail: String,
    date_approved: String,
    //Detalles del pago:
    payment_type_id: String,
    payment_method_id: String,
    issuer_id: String,
    installments: String,
    currency_id: String,


    Productsitems: String,
    //Cargos y comisiones:

    //Fecha de liberación de fondos:

    money_release_date: String,
    //Datos de facturación:

    description: String,
    transaction_details: TransactionDetailsSchema,
    payer: PayerSchema,
    charges_details: [ChargeDetailsSchema],
    items: [ItemSchema]


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