const express = require("express");
const router = express.Router();
let movies = require('./db.json');
const multer = require('multer');
const upload = multer({dest: 'src/static/uploads/'});
const fs = require("fs");

router.get("/movie", (req, res) => {
    if (req.query.id) {
        const movie = movies.find(movie => movie.id === req.query.id);
        if (movie) {
            res.json(movie);
        } else {
            res.status(404);
            res.json({error: `Movie not found for Id ${req.query.id}`});
        }
    } else {
        res.status(200);
        res.json(movies);
    }
});

router.post("/movie", upload.single('image'), (req, res) => {
    let id = null;
    do {
        id = Math.random().toString(36).slice(2)
    } while (movies.some(movie => movie.id === id));
    req.body.id = id;
    if (req.file) {
        const ext = req.file.originalname.split(".").reverse()[0];
        req.body.image = `${id}.${ext}`;
        const newPath = `${req.file.destination }/${req.body.image}`;
        fs.rename(req.file.path, newPath, error => {
            if (error) console.log(error);
            movies.push(req.body);
            fs.writeFile(__dirname + '/db.json', JSON.stringify(movies), function (err) {
                if (err) throw err;
            });
            res.json(req.body);
        });
    } else {
        res.json(req.body);
    }
    fs.writeFile('db.json', JSON.stringify(movies), (err) => {
        if (err) {
            throw err;
        } else {
            console.log("file written successfully");
        }
    });
});

router.put("/movie", upload.single('image'), (req, res) => {

    const movieToEdit = movies.find(m => m.id === req.query.id);
    const movieToEditIndex = movies.findIndex(m => m.id === req.query.id);
    movies.splice(movieToEditIndex, 1);
    if (req.file) {
        const ext = req.file.originalname.split(".").reverse()[0];
        req.body.image = `${req.query.id}.${ext}`;
        const newPath = `${req.file.destination }/${req.body.image}`;

        fs.rename(req.file.path, newPath, error => {
            if (error) console.log(error);
            movies.push(req.body);
            fs.writeFile(__dirname + '/db.json', JSON.stringify(movies), function (err) {
                if (err) throw err;
            });
            res.send(req.body);
        });
    } else {
        movies.push(req.body);
        res.send(req.body);
        fs.writeFile(__dirname + '/db.json', JSON.stringify(movies), function (err) {
            if (err) throw err;
        });
    }
});

router.delete("/movie", (req, res) => {
    const movieIndex = movies.findIndex(movie => movie.id === req.query.id);

    if (movieIndex === undefined) {
        res.status(500).json({error: "Movie not found"});
    } else {
        movies.splice(movieIndex, 1);
        fs.writeFile(__dirname + '/db.json', JSON.stringify(movies), function (err) {
            if (err) throw err;
        });
        res.json(req.query.id);
    }
});
module.exports = router;
