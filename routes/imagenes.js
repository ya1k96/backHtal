const router = require('express').Router();
const path = require('path');
const fs = require('fs-extra');
router.get( '/:tipo/:img', async(req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let imgpath = path.join( __dirname + `../../uploads/${ tipo }/${ img }` );        
    
    if( !await fs.pathExistsSync(imgpath) ){
        imgpath = path.join(__dirname + '../../assets/' + 'no-img.jpg' );
    }

    res.sendFile(imgpath);
});
// router.get( '/:tipo/:img', async(req, res) => {
//     let tipo = req.params.tipo;
//     let img = req.params.img;

//     let imgpath = path.join( __dirname + `../../uploads/${ tipo }/${ img }` );        
    
//     console.log(imgpath)
    
//     if( !await fs.pathExistsSync(imgpath) ){
//         // return res.json({ ok:true, path: imgpath })
//         imgpath = path.join(__dirname + '../../assets/' + 'no-img.jpg' );
//     }
//     // return res.json({ 
//     //     ok: false, 
//     //     default: imgpath
//     // })
//     res.sendFile(imgpath);
// });
module.exports = router;