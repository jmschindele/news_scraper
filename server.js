var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools

var axios = require("axios");
var cheerio = require("cheerio");

//Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

//Configure middleware

//Use morgan logger for logging requests
app.use(logger("dev"));
//Parse request body as JSON
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
//make a public static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
//connect to the Mongo DB
mongoose.connect(MONGODB_URI);

//Routes

//A GET route for scraping Wired.com
app.get("/scrape", function(req, res) {
  axios.get("https://www.wired.com/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("li.card-component__description").each(function(i, element) {
      var result = {};
      result.Headline = $(this)
        .children("a")
        .text();

      result.URL =
        "https://www.wired.com" +
        $(this)
          .children("a")
          .attr("href");
          
      //create a new article
      console.log("result is ", result);

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log("dbarticle console log ", dbArticle);
        })
        .catch(function(err) {
          console.log(err);
        });
    });

    res.send("scrape complete");
  });
});

// Route for getting all Articles from the db

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Route for grabbing a specific article

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { comment: dbComment._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//Start the server

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
