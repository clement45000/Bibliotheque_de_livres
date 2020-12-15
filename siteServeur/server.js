const express = require("express");
const server = express();
const morgan = require("morgan");
const routerLivre = require("./routers/livres.router");
const routerGlobal = require("./routers/global.router");
const routerAuteur = require("./routers/auteurs.router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const { populate } = require("./models/livres.modele");


// gestion de la session
server.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}))

//Connexion à la base de données mongodb
mongoose.connect("mongodb://localhost/biblio", {useNewUrlParser:true, useUnifiedTopology: true});

server.use(express.static("public"));
server.use(morgan("dev")); // module morgan
server.use(bodyParser.urlencoded({extended:false})); //utilisation de body parse rpour les info poste par formulaire
server.set('trust proxy', 1);

//traitement de la variable de session
server.use((requete, reponse, suite) =>{
    reponse.locals.message = requete.session.message;
    delete requete.session.message; //suppresion de l'information
    suite(); //permet de poursuivre
})

server.use("/livres/", routerLivre); //route de redirection
server.use("/auteurs/", routerAuteur); //route de redirection

server.use("/", routerGlobal); //route de redirection

server.listen(3000); //port de l'écoute (localhost: 3000)

