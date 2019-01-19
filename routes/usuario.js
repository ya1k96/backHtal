const router = require('express').Router();
const bcrypt = require('bcryptjs');
let Usuario = require('../models/usuario');
let jwt = require('jsonwebtoken');
const SEED = require('../condig/config').SEED;
let { verificaToken } = require('../middlewares/middleware');

router.get( '/usuario', (req, res) => {
    Usuario.find({}, 'nombre email img role')
        .exec((err, data) => {
            if(err){
                return res.json({err})
            }
            res.json( { ok: true, usuarios: data } );
        if( !res ){
            return res.status(500)
            .json({
                ok:false,
                message: 'Sin datos'
            })
        }
        });
});
router.post('/usuario', verificaToken, (req, res) => {
    let body = req.body;

    let usuarioN = new Usuario({
        nombre: body.nombre,
        email: body.email,
        pass: bcrypt.hashSync(body.pass, 10),        
        img: body.img
    });

    usuarioN.save( (err, usuarioDB) => {
        if( err ){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.status(201).json({
            usuarioDB
        })
    });
});
router.put('/usuario', (req, res) => {
  let id = req.body.id;
  let body = req.body;
    
  Usuario.findById(id, (err, UsuarioDB) => {
      if( err ){
        return res.status(500)
        .json({
            ok:false,
            message: 'Error al buscar usuario',
            err
        })
      }
      if( !UsuarioDB ){
        return res.status(400)
            .json({
            ok:false,
            message: 'No existe usuario'
        })
      }
      
      UsuarioDB.nombre = body.nombre;
      UsuarioDB.role = body.role;
      UsuarioDB.email = body.email;
      
      UsuarioDB.save((err, usuarioGuardado) => {
          if( err ){
            return res.status(400)
            .json({
                ok:false,
                message: 'Error al guardar cambios',
                err
            })
          }
          return res.json({
              ok:true,
              usuarioGuardado
          })
      });
      
  })
});
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    
    Usuario.findByIdAndRemove(id, (err, userDeleted) =>{
        if(err){
            return res.status(500)
            .json({
                ok:false,
                err
            })
        }
        if(!userDeleted){
            res.status(400)
            .json({
                ok:false,
                message: 'Error al borrar, id no encontrado'
            })
        }   
        return res.json({
            ok: true,
            userDeleted
        })

    });
});
router.post('/login', (req, res) => {
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
module.exports = router;