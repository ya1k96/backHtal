const router = require('express').Router();
const Hospital = require('../models/hospital');
let { verificaToken } = require('../middlewares/middleware');

router.get('/', (req, res) => {
    Hospital.find({})
    .populate('usuario','nombre email')
    .exec( ( err, hospitalDB ) => {
        if( err ){
            return res.status(500)
            .json({ ok: false, err });
        }
        if( !hospitalDB ){
            return res.status(401)
            .json({ ok: false, message: 'Empty database' });
        }
        return res.json({ ok: true, hospital: hospitalDB });
    });
});
router.post('/', verificaToken, (req, res) => {
    let body = req.body;

    let newHospital = new Hospital({
        nombre: body.nombre,        
        usuario: req.usuario._id,
        imgpath: ''
    });

    newHospital.save( (err, hospitalDB) => {
        if( err ){
            return res.status(500)
            .json({
                ok: false,
                err
            })
        }
        return res.json({ ok: true, hospital: hospitalDB });
    });
    
});
router.put('/',verificaToken, (req, res) => {
    let id = req.body.id;
    let body = req.body;

    Hospital.findById(id )
    .exec( (err, hospitalDB) => {
        if( err ){
            return res.status(500)
            .json({ ok:false, err });
        }
        if( !hospitalDB ){
            return res.status(401)
            .json({ ok: false, message: 'No existe un hospital con este id' })
        }
      hospitalDB.nombre = body.nombre;
      hospitalDB.img = body.img;
      hospitalDB.usuario = req.usuario._id;      
      
      hospitalDB.save((err, hospitalGuardado) => {
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
              hospital_actualizado: hospitalGuardado
          })
      });
    });
});
router.delete('/:id', (req, res) => {
    let id = req.query.id;
    Hospital.findOneAndRemove(id)
    .exec( (err, hospitalDel) => {
        if( err ){
            return res.status(500)
            .json({ ok: false, err })
        }
        if( !hospitalDel ){
            res.status(400)
            .json({
                ok:false,
                message: 'Error al borrar, id no encontrado'
            })
        } 
        return res.json({ ok: true, hospital: hospitalDel, borrado: true })
    });
})
module.exports = router;