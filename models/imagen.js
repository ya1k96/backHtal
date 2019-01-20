const { Schema, model } = require('mongoose');

const imagenSchema = new Schema({
    titulo: { type: String, required: [true, 'El titulo es necesario'] },
    descripcion: { type: String },
    nombreArchivo: { type: String },
    path: { type: String },
    mimetype: { type: String },
    creado: { type: Date, default: Date.now() }
});

module.exports = model('Imagen', imagenSchema);