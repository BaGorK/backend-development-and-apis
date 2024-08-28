// index.js
// where your node app starts
require('dotenv').config()
// init project
var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser'); // Required for parsing POST data
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// Body parser middleware to handle POST data
app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Define the person schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

// Create the Person model
const Person = mongoose.model('Person', personSchema);

// Serve static files
app.use(express.static('public'));

// Serve the index.html file
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// API endpoint: GET /api/hello
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// API endpoint: POST /name (to handle form submissions)
app.post('/name', function(req, res) {
  const { first, last } = req.body;
  res.json({ name: `${first} ${last}` });
});

// API endpoint: GET /:word/echo (echo the word)
app.get('/:word/echo', function(req, res) {
  const { word } = req.params;
  res.json({ echo: word });
});

// API endpoint: GET /name (query string parameters)
app.get('/name', function(req, res) {
  const { first, last } = req.query;
  res.json({ name: `${first} ${last}` });
});

// API endpoint: POST /api/people (create a new person)
app.post('/api/people', function(req, res) {
  const { name, age, favoriteFoods } = req.body;
  const newPerson = new Person({ name, age, favoriteFoods });
  newPerson.save(function(err, savedPerson) {
    if (err) return res.status(500).send(err);
    res.json(savedPerson);
  });
});

// API endpoint: GET /api/people (find people by name)
app.get('/api/people', function(req, res) {
  const { name } = req.query;
  Person.find({ name }, function(err, people) {
    if (err) return res.status(500).send(err);
    res.json(people);
  });
});

// API endpoint: DELETE /api/people (remove people by name)
app.delete('/api/people', function(req, res) {
  const { name } = req.body;
  Person.remove({ name }, function(err, result) {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// API endpoint: GET /api/:date (handle date parsing)
app.get('/api/:date?', function(req, res) {
  const { date } = req.params;
  
  let inputDate;
  if (!date) {
    // If no date is provided, return the current date
    inputDate = new Date();
  } else {
    // Try to parse the date from the provided string
    inputDate = new Date(isNaN(date) ? date : parseInt(date));
  }
  
  // Check if the date is valid
  if (inputDate.toString() === 'Invalid Date') {
    return res.json({ error: 'Invalid Date' });
  }

  // Format the response
  res.json({
    unix: inputDate.getTime(),
    utc: inputDate.toUTCString()
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
