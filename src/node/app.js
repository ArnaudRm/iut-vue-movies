const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const routes = require("./routes");
const cors = require('cors');
/**
 *	Usuals express middlewares
 */
app.use(cors());
app.use(express.query());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('./src/static'));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
    else if (req.query && typeof req.query === 'object' && '_method' in req.query) {
        const method = req.query._method;
        delete req.query._method;
        return method;
    }
}, {methods: ['GET', 'POST']}));

app.use("/api", routes);

app.get("/", function(req, res) {
    res.sendFile(path.resolve("./dist/index.html"));
});

app.use( (req, res) => {
    res.status(404);
    res.json('{"error": "the method doesn\"t exist on this url"}');
    res.end();
});

app.listen(3000);
console.log("listen on port 3000");
