//verif ok 
const mongoose = require("mongoose");
const auteurSchema =require("../models/auteurs.modele");
const livreSchema = require("../models/livres.modele");
const fs = require("fs");

exports.auteur_affichage = (requete, reponse) => {
    auteurSchema.findById(requete.params.id)
    .populate("livres")
    .exec()
    .then(auteur => {
        console.log(auteur);
        reponse.render("auteurs/auteur.html.twig", {auteur : auteur, isModification:false});
    })
    .catch(error => {
        console.log(error);
    })
    
}

exports.auteurs_affichage = (requete, reponse) =>{
    auteurSchema.find()
    .populate("livres")
    .exec()
    .then(auteurs => {
        reponse.render("auteurs/liste.html.twig", {auteurs : auteurs});
    })
    .catch();
}

exports.auteurs_ajout = (requete,reponse) => {
    const auteur = new auteurSchema({
        _id : new mongoose.Types.ObjectId(),
        nom: requete.body.nom,
        prenom : requete.body.prenom,
        age: requete.body.age,
        sexe: (requete.body.sexe) ? true : false,
    })
    auteur.save()
    .then(resultat =>{
        reponse.redirect('/auteurs');
    })
    .catch(error =>{
        console.lof(error);
    })
}

exports.auteur_suppression = (requete, reponse) => {
    auteurSchema.find()
    .where("nom").equals("anonyme")
    .exec()
    .then(auteur => {
        livreSchema.updateMany({"auteur":requete.params.id},{"$set":{"auteur": auteur[0]._id}}, {"multi":true})
        .exec()
        .then(
            auteurSchema.remove({_id:requete.params.id})
            .where("nom").ne("anonyme")
            .exec()
            .then(reponse.redirect("/auteurs"))
            .catch()
        )
    })
}

exports.auteur_modification = (requete, reponse) => {
    auteurSchema.findById(requete.params.id)
    .populate("livres")
    .exec()
    .then(auteur => {
        console.log(auteur);
        reponse.render("auteurs/auteur.html.twig", {auteur : auteur, isModification:true});
    })
    .catch(error => {
        console.log(error);
    })
}
// exports.auteur_modification = (requete, reponse) =>{
//     auteurSchema.findById(requete.params.id)
//     .populate("livres")
//     .exec()
//     .then(auteur => {
//         console.log(auteur);
//         reponse.render("auteurs/auteur.html.twig", {auteur : auteur, isModification:true});
//     })
//     .catch(error => {
//         console.log(error);
//     })
// }

exports.auteur_modification_validation = (requete,reponse) => {
    const auteurUpdate = {
        nom : requete.body.nom,
        prenom : requete.body.prenom,
        age : requete.body.age,
        sexe : (requete.body.sexe) ? true : false,
    };
    auteurSchema.update({_id:requete.body.identifiant}, auteurUpdate)
    .exec()
    .then(resultat => {
        reponse.redirect("/auteurs");
    })
    .catch();
}