var express = require("express");
var server = express();
var morgan = require("morgan");
var router = require("./router");

server.use(express.static("public"));
server.use(morgan("dev"));
server.use("/", router);

server.listen(3000);

