const jwt = require('jsonwebtoken');
const SEED = require('../condig/config');

//Middleware de autorizacion
exports.verificaToken = ( (req, res, next) => {
    let token = req.query.token;
    
    jwt.verify( token, 'Bzcocho-17-03', ( err, decoded ) => {
        
        if( err ){
            return res.status(401)
            .json({
                ok: false,
                message: 'Token incorrecto.',
                err
            })
        }
        console.log(decoded)
        req.usuario = decoded.usuario;        
        next();
    })

});
