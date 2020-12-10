var express = require("express");
var router = express.Router();
const twig = require("twig");
const  mongoose = require("mongoose");
const livreSchema = require("./models/livres.modele");
const { response } = require("express");

const multer = require("multer");

// destination et filename (nom du fichier)
// details https://www.npmjs.com/package/multer
const storage = multer.diskStorage({
    destination : (requete, file, cb)=> {
        cb(null, "./public/images")
    },
    filename : (requete, file, cb)=>{
        var date = new Date().toLocaleDateString();
        cb(null, date+"_"+Math.round(Math.random() * 10000)+"_"+file.originalname)
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


router.get("/", (requete, reponse) =>{
    reponse.render("accueil.html.twig")
})

//recuperation du livre
router.get("/livres", (requete, reponse) =>{
    livreSchema.find()
    .exec()
    .then(livres =>{
        reponse.render("livres/liste.html.twig", {liste : livres,message : reponse.locals.message})
    })
    .catch();
})

// Sauvegarde d'un livre via le formulaire
router.post("/livres", upload.single("image"), (requete, reponse) =>{
    const livre = new livreSchema({
        _id: new mongoose.Types.ObjectId(),
        nom: requete.body.titre,
        auteur: requete.body.titre,
        pages: requete.body.pages,
        description: requete.body.description,
        image : requete.file.path.substring(14)
    });
    livre.save()
    .then(resultat =>{
        console.log(resultat);
        reponse.redirect("/livres");

    })
    .catch(error =>{
        console.log(error);
    })
});

//affichage du livre by id
router.get("/livres/:id", (requete, reponse) =>{
    livreSchema.findById(requete.params.id)
    .exec()
    .then(livre =>{
         reponse.render("livres/livre.html.twig",{livre : livre, isModification: false})
    })
    .catch(error =>{
          console.log(error)
    })
})

//modification d'un livre(formulaire)
router.get("/livres/modification/:id", (requete, reponse) =>{
    livreSchema.findById(requete.params.id)
    .exec()
    .then(livre =>{
         reponse.render("livres/livre.html.twig",{livre : livre, isModification: true})
    })
    .catch(error =>{
          console.log(error)
    })
})

router.post("/livres/modificationServer", (requete,reponse)=>{
    const livreUpdate = {
        nom : requete.body.titre,
        auteur : requete.body.auteur,
        pages : requete.body.pages,
        description : requete.body.description
    }
    livreSchema.update({_id:requete.body.identifiant}, livreUpdate)
    .exec()
    .then(resultat =>{
        if (resultat.nModified <1){
            throw new Error("requete de modification echoué");
        } 
        console.log(resultat);
        requete.session.message = {
            type : 'success',
            contenu : 'Modificaition effectuée'
        }
        reponse.redirect("/livres");
    })
    .catch(error => {
        console.log(error);
        requete.session.message = {
            type : 'danger',
            contenu : error.message
        }
        reponse.redirect("/livres");
    })
})


//suppression du livre
router.post("/livres/delete/:id", (requete, reponse) =>{
    livreSchema.remove({_id:requete.params.id})
    .exec()
    .then(resultat =>{
        requete.session.message = {
            type : 'success',
            contenu : 'Suppression effectuée'
        }
        reponse.redirect("/livres");
    })
    .catch(error => {
        console.log(error);
    })
})

//gestion des erreurs
router.use((requete,reponse, suite) => {
    const error = new Error("Page non trouvée");
    error.status = 404;
    suite(error);
})

router.use((error,requete,reponse) => {
    reponse.status(error.status || 500);
    reponse.end(error.message);
})

module.exports = router;