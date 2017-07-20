// Requiring our Note and Article models
const Note = require("../models/Note.js");
const Article = require("../models/Article.js");

// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");

module.exports = function(app) {
    
    // main routes
    app.get("/", function(req, res){
        res.render("index");
    })

    //scrape route
    app.get("/scrape", function(req, res) {

        var scrapeLink = "https://www.nytimes.com/section/world?WT.nav=page&action=click&contentCollection=World&module=HPMiniNav&pgtype=Homepage&region=TopBar"
        // First, we grab the body of the html with request
        request(scrapeLink, function(error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Now, we grab every h2 within an article tag, and do the following:
            $("div.story-meta").each(function(i, element) {

            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children(".headline").text().trim();
            result.description = $(this).children(".summary").text().trim();

            // Using our Article model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)
            var entry = new Article(result);

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
            });        
        });
    });

    // This will get the articles we scraped from the mongoDB
    app.get("/articles", function(req, res) {
        // Grab every doc in the Articles array
        Article.find({}, function(error, doc) {
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

}