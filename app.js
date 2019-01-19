var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); 
var app = express();

//Conexion
mongoose.connect('mongodb://localhost:27017/Hospital', (err, res) => {
    if( err ){
        throw new err;
    }
    console.log('Database: \x1b[34m%s\x1b[0m','run')
});

//Body Parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Rutas
app.use('/' ,require('./routes/usuario') );
app.use( require('./routes/index') );

app.listen( 3000 , () => {
    console.log('Servidor corriendo: \x1b[34m%s\x1b[0m','online')
});