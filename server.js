// require all discrete key from .env file
require('dotenv').config()

//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");


// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
const app = express();

// Make public a static dir
app.use(express.static("public"));

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));


// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Database configuration with mongoose
mongoose.connect(process.env.DB_MONGO_SCRAPE);
const db = mongoose.connection;

//require all routes
require("./routes/api-routes.js")(app);

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
    
    // Listen on port 3000
    app.listen(8080, function() {
        console.log("App running on port 8080!");
    });
});