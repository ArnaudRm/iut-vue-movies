const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes");
const cors = require('cors');

const port = process.argv.includes("dev") ? 3000 : 8080;

/**
 *	Usuals express middlewares
 */
app.use(cors());
app.use(express.query());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '500kb'}));
app.use(express.static('./src/static'));


app.use("/api", routes);

app.get("/", function(req, res) {
    res.sendFile(path.resolve("./src/dist/index.html"));
});

app.listen(port);
console.log("listen on port ", port);
