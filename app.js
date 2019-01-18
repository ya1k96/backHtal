var express = require('express');
var mongoose = require('mongoose');

var app = express();

//Conexion
mongoose.connect('mongodb://localhost:27017/Hospital', (err, res) => {
    if( err ){
        throw new err;
    }
    console.log('Database: \x1b[34m%s\x1b[0m','run')
});

//Rutas
app.get( '/', (req, res) => {
    res.send('OK');
});

app.listen( process.env.PORT || 3000 , () => {
    console.log('Servidor corriendo: \x1b[34m%s\x1b[0m','online')
});