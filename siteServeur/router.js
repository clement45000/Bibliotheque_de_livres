var express = require("express");
var router = express.Router();
const twig = require("twig");
const livreSchema= require("./models/livres.modele")


router.get("/", (requete, reponse) =>{
    reponse.render("accueil.html.twig")
})

router.get("/livres", (requete, reponse) =>{
    livreSchema.find()
    .exec()
    .then(livres =>{
        console.log(livres)
        reponse.render("livres/liste.html.twig", {liste : livres})
    })
    .catch();
  
})

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