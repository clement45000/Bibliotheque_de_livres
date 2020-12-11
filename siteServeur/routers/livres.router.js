var express = require("express");
var router = express.Router();
const twig = require("twig");
const livreController = require("../controllers/livre.controller");
const multer = require("multer");

// destination et filename (nom du fichier)
// details https://www.npmjs.com/package/multer
const storage = multer.diskStorage({
    destination : (requete, file, cb)=> {
        cb(null, "./public/images")
    },
    filename : (requete, file, cb)=>{
        var date = new Date().toLocaleDateString();
        cb(null, date + "_" + Math.round(Math.random() * 10000) + "_" + file.originalname)
    }
});

const fileFilter = (requete, file, cb) =>{
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true)
    } else{
        cb(new Error("l'image ne correspond n'est pas accepté"), false)
    }
}

const upload = multer({
    storage : storage,
    limits : {
        filSize : 1024 * 1024 * 5
    },
    fileFilter : fileFilter
})


router.get("/", livreController.livres_affichage)
router.post("/", upload.single("image"), livreController.livres_ajout);
router.get("/:id", livreController.livre_affichage);
router.get("/modification/:id", livreController.livre_modification);
router.post("/modificationServer", livreController.livre_modification_server);
router.post("/updateImage", upload.single("image"), livreController.livre_modification_server_image);
router.post("/delete/:id", livreController.livre_suppression);

module.exports = router;