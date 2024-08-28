var express = require('express');
var cors = require('cors');
var multer = require('multer');
require('dotenv').config();

var app = express();
var upload = multer(); // Initialize multer with default settings

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Endpoint to handle file upload
app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Extract file details
  const file = req.file;
  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port);
});
