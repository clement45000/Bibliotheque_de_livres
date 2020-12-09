const express = require("express");
const server = express();
const morgan = require("morgan");
const router = require("./router");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/biblio", {useNewUrlParser:true, useUnifiedTopology: true});

server.use(express.static("public"));
server.use(morgan("dev"));
server.use("/", router);

server.listen(3000);

