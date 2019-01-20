var multer  = require('multer')
var upload = require('../condig/files');
const router = require('express').Router();
const Medico = require('../models/medico');
const Imagen = require('../models/imagen');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');
const path = require('path');
const fs = require('fs-extra');
router.put( '/:tipo/:id', upload, (req, res) => { 
    let file = req.file;
    let id = req.params.id;
    let tipo = req.params.tipo;    
    let path = file.filename;
    subirPorTipo( tipo, id, path, res )

});
let subirPorTipo = async (tipo, id, pathimg, res) => {    
    if( tipo === 'usuario' ){
        const usuarioDB = await Usuario.findById(id);
        let pathDelete = path.join( __dirname + `../../uploads/usuario/`+ usuarioDB.imgpath  );
        //Si existe el archivo lo eliminamos
        if( usuarioDB.imgpath && await fs.pathExists( pathDelete ) ){
            await fs.unlink( pathDelete );
        }
        usuarioDB.imgpath = pathimg;
        usuarioDB.save( (err, doc) => {
            if( err ){
                return res.status(500).json({ ok: false, err })
            }
            return res.json({ ok: true, message:'Ok', doc })
        });
    } 
    if( tipo === 'medico' ){
        const medicoDB = await Medico.findById(id);
        let pathDelete = path.join( __dirname + `../../uploads/medico/`+ medicoDB.imgpath  );
        //Si existe el archivo lo eliminamos
        if( await fs.pathExists( pathDelete ) ){
            await fs.unlink( pathDelete );
        }
        medicoDB.imgpath = pathimg;
        medicoDB.save( (err, doc) => {
            if( err ){
                return res.status(500).json({ ok: false, err })
            }
            return res.json({ ok: true, message:'Ok', doc })
        });
    }
    if( tipo === 'hospital' ){
        const hospitalDB = await Hospital.findById(id);
        let pathDelete = path.join( __dirname + `../../uploads/hospital/`+ hospitalDB.imgpath  );
        console.log(pathDelete)
        //Si existe el archivo lo eliminamos
        if(  await fs.pathExists( pathDelete ) ){
            await fs.unlink( pathDelete );
        }
        hospitalDB.imgpath = pathimg;
        hospitalDB.save( (err, doc) => {
            if( err ){
                return res.status(500).json({ ok: false, err })
            }
            return res.json({ ok: true, message:'Ok', doc })
        });
    }
}
module.exports = router;