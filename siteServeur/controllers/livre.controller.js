const mongoose = require("mongoose");
const livreSchema = require("../models/livres.modele");
const auteurSchema = require("../models/auteurs.modele");
const fs = require("fs");
const { populate } = require("../models/livres.modele");

exports.livres_affichage = (requete, reponse) =>{
    auteurSchema.find()
    .exec()
    .then(auteurs => {
        livreSchema.find()
            .populate("auteur")
            .exec()
            .then(livres => {
                reponse.render("livres/liste.html.twig", {
                    liste : livres, 
                    auteurs : auteurs, 
                    message : reponse.locals.message
                })
            })
            .catch(error => {
                console.log(error);
            });
    })
    .catch(error => {
        console.log(error);
    });
}

exports.livres_ajout = (requete, reponse) =>{
    const livre = new livreSchema({
        _id: new mongoose.Types.ObjectId(),
        nom: requete.body.titre,
        auteur: requete.body.auteur,
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
}

exports.livre_affichage =  (requete, reponse) =>{
    livreSchema.findById(requete.params.id)
    .populate("auteur")
    .exec()
    .then(livre =>{
         reponse.render("livres/livre.html.twig",{livre : livre, isModification: false})
    })
    .catch(error =>{
          console.log(error)
    })
}

exports.livre_modification = (requete, reponse) =>{
    auteurSchema.find()
    .exec()
    .then(auteurs =>{
       livreSchema.findById(requete.params.id)
        .populate("auteur")
        .exec()
        .then(livre =>{
            reponse.render("livres/livre.html.twig",{
                livre : livre, 
                auteurs: auteurs, 
                isModification: true
            })
        })
        .catch(error =>{
          console.log(error)
        })   
    })
    .catch(error =>{
        console.log(error);
    })
}

exports.livre_modification_server = (requete,reponse)=>{
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
}

exports.livre_modification_server_image = (requete, reponse) => {  
    var livre = livreSchema.findById(requete.body.identifiant)
    .select("image")
    .exec()
    .then(livre => {
        fs.unlink("./public/images/"+livre.image, error => {
            console.log(error);
        })
     });
        const livreUpdate = {
            image : requete.file.path.substring(14)
        }
        livreSchema.update({_id:requete.body.identifiant}, livreUpdate)
        .exec()
        .then(resultat =>{
            reponse.redirect("/livres/modification/" + requete.body.identifiant)
        })
        .catch(error => {
            console.log(error);
        })
}

exports.livre_suppression = (requete, reponse) => {
    var livre = livreSchema.findById(requete.params.id)
    .select("image")
    .exec()
    .then(livre =>{
        fs.unlink("./public/images/" + livre.image, error =>{
            console.log(error);
        })
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
    .catch(error => {
        console.log(error);
    })
    
}