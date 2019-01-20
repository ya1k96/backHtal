const router = require('express').Router();
const Medico = require('../models/medico');
let { verificaToken } = require('../middlewares/middleware');

router.get('/', (req, res) => {
    Medico.find({})
    .populate('usuario ','nombre email')
    .populate('hospital')
    .exec( ( err, medicosDB ) => {
        if( err ){
            return res.status(500)
            .json({ ok: false, err });
        }
        if( !medicosDB ){
            return res.status(401)
            .json({ ok: false, message: 'Empty database' });
        }
        return res.json({ ok: true, medicos: medicosDB });
    });
});
router.post('/', verificaToken, (req, res) => {
    let body = req.body;
    console.log(body)
    let newMedico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital        
    });

    newMedico.save( (err, medicoDB) => {
        if( err ){
            return res.status(500)
            .json({ ok: false, err });
        }
        return res.json({ ok: true, medico: medicoDB });
    });
});
router.put('/', verificaToken, (req, res) => {
    let id = req.body.id;
    let body = req.body;

    Medico.findByIdAndUpdate(id)
    .exec( (err, medicoUpdated) => {
        if( err ){
            return res.status(500)
            .json({ ok: false, err });
        }

        if( !medicoUpdated ){
            return res.status(401)
            .json({ ok: false, message: 'No hay coincidencias con el id.'})
        }

      medicoUpdated.nombre = body.nombre;
      medicoUpdated.img = body.img;
      medicoUpdated.usuario = req.usuario._id;
      medicoUpdated.hospital = body.hospital;
      
      medicoUpdated.save((err, medicoGuardado) => {
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
              medico_actualizado: medicoGuardado
          })
      });
    });
});
router.delete('/:id', (req, res) => {
    let id = req.query.id;
    Medico.findOneAndRemove(id)
    .exec( (err, medicoDel) => {
        if( err ){
            return res.status(500)
            .json({ ok: false, err })
        }
        if( !medicoDel ){
            res.status(400)
            .json({
                ok:false,
                message: 'Error al borrar, id no encontrado'
            })
        } 
        return res.json({ ok: true, hospital: medicoDel, borrado: true })
    });
})
module.exports = router;