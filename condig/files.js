const multer = require('multer');
const path = require('path');
const uuid = require('uuid/v4');

let storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback( null, uuid() + file.originalname  );
    },
    destination: (req, res, cb) => {
        let imgpath = path.join( __dirname + `../../uploads`);
        let tipo = req.params.tipo;
        if(tipo){
            imgpath = `${ imgpath }/${ tipo }`;
        }
        cb(false,imgpath);
    }
});

let uploadFile = multer({ 
    storage ,
    limits: { fileSize: 500000 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test( file.mimetype );
        const extName = filetypes.test( path.extname( file.originalname ) );
        console.log(file,mimetype,extName) 
        if( mimetype && extName ){
            cb(null, true);
        }else{
            cb('El tipo de archivo no es valido', false);
        }

    }
}).single('imagen');

function up(req, res, next){
    uploadFile(req,res,function(err){     
        console.log(err)   
        if(err){
            return res.json({
                ok: false,
                message: 'Los tipos permitidos son jpeg | jpg | png | gif'                
            })
        }
        next();
    });    
}
module.exports = up;