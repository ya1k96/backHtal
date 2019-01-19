var { Schema, model } = require('mongoose');
//Validador para campos
var uniqueValidator = require('mongoose-unique-validator');

//asignamos un array roles validos
let rolesValidos = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique:true, required: [true, 'El correo es necesario'] },
    pass: { type: String, required: [true, 'La contraseña es necesario'] },
    img: { type: String, required:false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos}
});

//Aplicamos el validador de campo unico a este esquema 
usuarioSchema.plugin( uniqueValidator, { message: 'El {PATH} debe ser unico'} );

module.exports = model('Usuario', usuarioSchema);