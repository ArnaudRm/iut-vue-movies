const express = require("express");
const router = express.Router();
let movies = require('./db.json');
const stock = Array.from(movies);
const multer  = require('multer');
const upload = multer({ dest: 'src/static/uploads/' });
const fs = require("fs");

router.get("/movie", (req, res) => {
    if(req.query.id) {
        const movie = movies.find(movie => movie.id === req.query.id);
        if(movie) {
            res.json(movie);
        } else {
            res.status(404);
            res.json({error: `Movie not found for Id ${req.query.id}`});
        }
    } else {
        res.json(movies)
    }
});

module.exports = router;
