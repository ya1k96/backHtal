const router = require('express').Router();
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '268116512482-jektv3bs04l4sivnba8g9je0vi3t8a0f.apps.googleusercontent.com';
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const client = new OAuth2Client(CLIENT_ID);
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();    
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        imgpath: payload.picture,
        google: true
    }
  }
router.post('/', (req, res) => {
    let body = req.body;

    if( !body ){
        return res.status(400)
        .json({
            ok:false,
            message: 'Ingresa los parametros'
        })
    }

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if( err ){
            return res.status(500)
            .json({
                ok: false,
                err
            })
        }
        if( !usuarioDB ){
            return res.status(400)
            .json({
                ok: false,
                message: 'Contraseña o usuario incorrecto'
            })
        }
        
        //CRear Token
        let token = jwt.sign({ usuario: usuarioDB }, 'Bzcocho-17-03',{ expiresIn: 14000 });        
        if( bcrypt.compareSync( body.pass, usuarioDB.pass ) ){
            return res.json({
                ok:true,
                usuario: usuarioDB,
                token
            })
        }else{
            return res.status(500)
            .json({
                ok:false,
                message: 'Contraseña o usuario incorrecto'
            })
        }
    });
});
router.post('/google', async (req, res) => {
    let token = req.body.token;
    
    let googleuser = await verify( token )
    .catch(e => {
        return res.status(403)
        .json({
            ok:false,
            message: 'Token no valido',
            e
        })
    });

    Usuario.findOne({ email: googleuser.email }, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok: false
            })
        }
        if( usuarioDB ){
            if( !usuarioDB.google ){
                return res.status(400).json({
                    ok: false, message: 'Cuenta de correo en uso'
                })
            }else{
                let token = jwt.sign({ usuario: usuarioDB }, 'Bzcocho-17-03',{ expiresIn: 14000 });        
                return res.json({
                    ok: true,
                    usuarioDB,
                    token
                })
            }
        }else{            
            let newUsuario = new Usuario({
                nombre: googleuser.nombre,
                email: googleuser.email,
                imgpath: googleuser.imgpath,
                google: googleuser.google,
                pass: 'undefined'                
            });

            newUsuario.save( (err, usuarioGuardado) => {
                if(err){
                    return res.status(400).json({
                        ok: false, err
                    })
                }
                return res.json({
                    ok: true,
                    usuarioGuardado                    
                })
            });
        }
    });
})

module.exports = router;