const { Schema, model } = require('mongoose');

let hospitalSchema = new Schema({
    nombre: { type: String, required:[true, 'El nombre es requerido'] },
    imgpath: { type: String },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});
module.exports = model('Hospital', hospitalSchema);