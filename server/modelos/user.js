// Conexion Base de datos Mongo 
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const saltRounds=10;
/*
const  UserSchema=new mongoose.Schema({
    email:{type: String, required: true, unique:true},
    password:{type: String, required: true, unique:true},
    nombre:{type: String, required: true, unique:true},
    apellido:{type: String, required: true, unique:true}

});
*/

const  UserSchema = mongoose.Schema({
Nombre: String,
Apellido: String,
Email: String,
password: String
})

UserSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
    
        const document=this;

        bcrypt.hash(document.password, saltRounds,(error,hashedPassword) =>{
            if(error){
                next(error);
            }else{
                document.password=hashedPassword;
                next();
            }

        });    
    }else{
        next();

    }
});   


UserSchema.methods.isCorrectPassword=function(password,callback){
    bcrypt.compare(password,this.password, function(error,same){
    if(error){
        callback(error);
    }else{
        callback(error,same);
       }

    });
    
};

const userModel = mongoose.model('user',UserSchema);
module.exports = userModel;


/*
const productoModel= mongoose.model('productos',ProductoSchema);

  module.exports = productoModel;
  */