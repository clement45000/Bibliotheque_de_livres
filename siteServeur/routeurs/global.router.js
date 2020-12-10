var express = require("express");
var router = express.Router();
const twig = require("twig");


router.get("/", (requete, reponse) =>{
    reponse.render("accueil.html.twig")
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