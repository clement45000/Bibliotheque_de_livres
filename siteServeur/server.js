const express = require("express");
const server = express();
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect("mongodb://localhost/biblio", {useNewUrlParser:true, useUnifiedTopology: true});

server.use(express.static("public"));
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({extended:false})); //utilisation de body parse rpour les info poste par formulaire

server.use("/", router);

server.listen(3000);

