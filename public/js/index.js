// Grab the articles as a json
$.get("/articles", function(data) {
  // For each one
  var rowNum =0;
  var divInRow =0;
  var divNum = 0;

    for (var i = 0; i < data.length; i++) {
        console.log(data[i].title)
        if (divInRow == 0){
            var row = $("<div>").addClass("row rowNum" + rowNum);  
            $(".content").append(row);
            
        }if (divInRow <= 4){
            var col = $("<div>").addClass("col-lg-3 divNum"+i);
            $(".rowNum"+rowNum).append(col);
            $(".divNum"+i).append("<h5>"+data[i].title+"</h5>"+ "<p>"+ data[i].description +"</p>"+ "<p><button class ='btn btn-primary' id='" +data[i]._id+ "'> Save News</button></p>");
            divInRow++;
            if (divInRow == 4){
                divInRow = 0;
                rowNum++;
            }
        }
    }
});

$(document).ready(function() {

    $("#scrape").on("click", function(event){
        //  event.preventDefault();

       // Now make an ajax call for the Article
        $.ajax({
            method: "GET",
            url: "/scrape"
        })
            // With that done, add the note information to the page
        .done(function(data) {
            console.log(data);
            var h1 = $("<p>");
            $("body").append(h1);
            h1.text(data.title);
        })

    });
});