var express = require("express");
var router = express.Router();
const twig = require("twig");
const  mongoose = require("mongoose");
const livreSchema= require("./models/livres.modele");
const { response } = require("express");

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
router.post("/livres", (requete, reponse) =>{
    const livre = new livreSchema({
        _id: new mongoose.Types.ObjectId(),
        nom: requete.body.titre,
        auteur: requete.body.titre,
        pages: requete.body.pages,
        description: requete.body.description
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

//affichage du livre 
router.get("/livres/:id", (requete, reponse) =>{
    livreSchema.findById(requete.params.id)
    .exec()
    .then(livre =>{
         reponse.render("livres/livre.html.twig",{livre : livre})
    })
    .catch(error =>{
          console.log(error)
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