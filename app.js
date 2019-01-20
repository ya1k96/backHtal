var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser'); 
var app = express();
var routeUsuario = require('./routes/usuario');
var routeMedico = require('./routes/medico');
var routeHospital = require('./routes/hospital');
var routeBusqueda = require('./routes/busqueda');
var routeIndex = require('./routes/index');
var uploadsRoute = require('./routes/upload');
var imgRoute = require('./routes/imagenes');
//Conexion
mongoose.connect('mongodb://localhost:27017/Hospital', (err, res) => {
    if( err ){
        throw new err;
    }
    console.log('Database: \x1b[34m%s\x1b[0m','run')
});

//Carpeta estatica publica
app.use( express.static( __dirname + '/uploads') );
//Body Parser
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
//Midlewares
app.use( express.urlencoded({ extended: false }) );
//Rutas
app.use('/img', imgRoute);
app.use('/uploads', uploadsRoute);
app.use('/busqueda', routeBusqueda );
app.use('/usuario' , routeUsuario );
app.use('/medico' , routeMedico );
app.use('/hospital' , routeHospital );
//index page
app.use( routeIndex );

app.listen( 3000 , () => {
    console.log('Servidor corriendo: \x1b[34m%s\x1b[0m','online')
});