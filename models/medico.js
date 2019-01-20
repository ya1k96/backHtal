const { Schema, model } = require('mongoose');

let medicoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    imgpath: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El id hospital es un campo obligatorio'] }
});

module.exports = model('Medico', medicoSchema);