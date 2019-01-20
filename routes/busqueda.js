const router = require('express').Router();
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');

router.get('/coleccion/:documento/:busqueda', (req, res) => {
    let documento = req.params.documento;
    documento = String( documento ).toLowerCase();
    
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    let promesa;
    switch(documento){
        case 'usuario':
        promesa = buscarUsuario(regex);
        break;

        case 'hospital':
        promesa = buscarHospital(regex);
        break;

        case 'medico':
        promesa = buscarMedico(regex);
        break;

        default:
        return res.status(401)
        .json({ ok: false, 
            message: 'La opcion no esta disponible',
            requerido: 'usuario, hospital, medico'});
        break;
    }
    
    promesa
    .then( resp => {
        return res.json({ ok: true, resp })
    })
    .catch( error => res.status(500)
    .json({ ok: false, error }) );  
});
router.get( '/:busqueda', (req, res) => {
    let busqueda = req.query.busqueda;
    console.log(busqueda)
    let regex = new RegExp( busqueda, 'i');

    Promise.all([
        buscarMedico(regex),
        buscarHospital(regex),
        buscarUsuario( regex )
    ])
    .then( resp => {
        return res.json({ ok: true, 
                            medicos: resp[0], 
                            hospitales: resp[1],
                            usuarios: resp[2] });
    })
    .catch( error => {
        return res.status(500)
        .json({ ok: false, error });
    });
});
/*
*   Funciones 
*/
function buscarMedico( regex ){
    return new Promise( (resolve, reject) => {
        Medico.find({ nombre: regex })
        .populate('usuario', 'email nombre role')
        .populate('hospital')
        .exec( ( err, medicosDB ) => {
            if( err ){
                reject(err);
            }else{
                resolve( medicosDB );
            }
        });
    });
}
function buscarHospital( regex ){
    return new Promise( (resolve, reject) => {
        Hospital.find({ nombre: regex })        
        .populate('usuario','nombre role email')
        .exec( ( err, hospitalDB ) => {
            if( err ){
                reject(err);
            }else{
                resolve( hospitalDB );
            }
        });
    });
}
function buscarUsuario( regex ){
    return new Promise( (resolve, reject) => {
        Usuario.find({}, 'nombre email role')
        .or([{ nombre: regex }, { email: regex }])
        .exec( ( err, usuarioDB ) => {
            if( err ){
                reject(err);
            }else{
                resolve( usuarioDB );
            }
        });
    });
}
module.exports = router;