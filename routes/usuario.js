const router = require('express').Router();
const bcrypt = require('bcryptjs');
let Usuario = require('../models/usuario');
let jwt = require('jsonwebtoken');
const SEED = require('../condig/config').SEED;
let { verificaToken } = require('../middlewares/middleware');

router.get( '/', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number( desde );        
    let cantidad = 0;
    let pagina = desde/5;
    //Validar que sea un numero
    if( isNaN(desde) ){
        return res.status(400)
        .json({
            ok: false,
            message: 'El parametro no es valido, ingrese un numero'
        })
    } 
    //Asignar la cantidad de documentos o registros
    Usuario.count({}, (err, count) => {
        cantidad = count || err;  
    })
    if( desde === 0 ){
        pagina = 1;
    }
    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec((err, data) => {
            if(err){
                return res.json({err})
            }
            res.json({ 
                ok: true, 
                usuarios: data, 
                total:cantidad, 
                cantidad: 5,
                pagina
            });
        if( !res ){
            return res.status(500)
            .json({
                ok:false,
                message: 'Sin datos'
            })
        }
        });
});
router.post('/', verificaToken, (req, res) => {
    let body = req.body;

    let usuarioN = new Usuario({
        nombre: body.nombre,
        email: body.email,
        pass: bcrypt.hashSync(body.pass, 10),        
        imgpath: body.img
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
router.put('/', (req, res) => {
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
    let id = req.query.id;
    
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

module.exports = router;