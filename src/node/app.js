const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const cors = require('cors');

app.use(cors());

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/static/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

app.post('/uploads', upload.single('movieImage'), (req, res) => res.json({ error: false, movieImageName: req.file.filename, message: 'Success ! your image was upload successfully' }));

app.listen(3000, () => {
  console.log('app listening on port 3000!');
});
