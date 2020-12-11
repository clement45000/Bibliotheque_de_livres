var express = require("express");
var router = express.Router();
const twig = require("twig");

const auteurController = require("../controllers/auteur.controller");

router.get("/:id", auteurController.auteur_affichage);
router.get("/", auteurController.auteurs_affichage);
router.post("/", auteurController.auteurs_ajout);
router.post("/delete/:id", auteurController.auteurs_supression);
router.get("/modification/:id",auteurController.auteur_modification)
module.exports = router;
