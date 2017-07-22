// Requiring our Note and News models
const Note = require("../models/Note.js");
const News = require("../models/News.js");

// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");

// export all routes
module.exports = function(app) {
    
    // main routes
    app.get("/", function(req, res){
        res.render("index");
    })

    //scrape route
    app.get("/scrape", function(req, res) {

        // delete all unsaved news
        News.remove({saved:false},function (err) {
            if (err) return handleError(err);
        });
        // delete all unsaved notes
        Note.remove({saved:false},function (err) {
            if (err) return handleError(err);
        });

        var scrapeLink = "https://www.nytimes.com/section/world?WT.nav=page&action=click&contentCollection=World&module=HPMiniNav&pgtype=Homepage&region=TopBar"
        // First, we grab the body of the html with request
        request(scrapeLink, function(error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Now, we grab every div with story-meta class, and do the following:
            $("div.story-meta").each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and save them as properties of the result object
            result.title = $(this).children(".headline").text().trim();
            result.description = $(this).children(".summary").text().trim();

            // Using our News model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)
                var entry = new News(result);
                    // Now, save that entry to the db
                    entry.save(function(err, doc) {
                        // Log any errors
                        if (err) {
                        console.log(err);
                        }
                        // Or log the doc
                        else { 
                        console.log(doc);      
                        }
                    });
                //we will retrieve only 20 news
                if (i == 19){
                    res.json(i+1);
                    return false;
                }    
            });
        });
    });

    // This will get the articles we scraped from the mongoDB
    app.get("/news", function(req, res) {
        // Grab every doc in the Articles array
        News.find({}, function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
    });

     // Save News Route
    app.get("/saved", function(req, res){ 
        res.render("saved");
    });

    // Save News Route
    app.get("/saved/news", function(req, res){
        // Grab every doc in the news array
        News.find({"saved": true}, function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Or send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
    });

     // Saved Notes Route
    app.get("/saved/notes/:id", function(req, res){
         // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        News.findOne({ "_id": req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        // now, execute our query
        .exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                console.log(doc)
                res.json(doc);
            }
        });
    });

      // Delete Notes Route
    app.get("/delete/notes/:id", function(req, res){
         // Using the id passed in the id parameter, prepare a query that finds the matching one in our db and delete
        Note.remove({_id:req.params.id}, function (err) {
            if (err) return handleError(err);
        });

        res.json(true);
    });

    // save news routes
    app.post("/save/:id", function(req, res) {
        // Use the news id to find and update saved status
        News.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
        // Execute the above query
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
            console.log(err);
            }
        });
    });

    // delete from saved routes
    app.post("/delete/news/:id", function(req, res) {
        // Use the news id to find and update saved status
        News.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
        // Execute the above query
        .exec(function(err, doc) {
            // Log any errors
            if (err) {
                console.log(err);
            } else {
                for(let i = 0; i < doc.note.length; i++){
                     // Update note document to saved for furthur delete purposes
                    Note.findOneAndUpdate({"_id":doc.note[i]}, {"saved": false})
                    // Execute the above query
                    .exec(function(err, doc) {
                        // Log any errors
                        if (err) {
                        console.log(err);
                        }
                    });
                };
            };
        });    
    });

    // Create a new note or replace an existing note
    app.post("/save/notes/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        var newNote = new Note(req.body);

        // And save the new note the db
        newNote.save(function(error, doc) {
            // Log any errors
            if (error) {
            console.log(error);
            }
            // Otherwise
            else {
                // Use the article id to find and update it's note
                News.findOneAndUpdate({ "_id": req.params.id }, {$push: {"note": doc._id}})
                // Execute the above query
                .exec(function(err, doc) {
                    // Log any errors
                    if (err) {
                    console.log(err);
                    }
                });
                // Update note document to saved for furthur delete purposes
                Note.findOneAndUpdate({"_id":doc._id}, {"saved": true})
                // Execute the above query
                .exec(function(err, doc) {
                    // Log any errors
                    if (err) {
                    console.log(err);
                    } 
                });
            }
        });
    });

};