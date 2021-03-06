$(document).ready(function() {

// whenever user clcik "Fetch The News "
$("#scrape").on("click", function(){

    $("#scrape").text("Loading").append('<i class="fa fa-refresh fa-spin fa-1x fa-fw"></i>').prop("disabled", true);
    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/scrape"
    })
    // With that done, add the news information to the page
    .done(function(data) {
        getData();
        $(".alert-msg").text("You have added "+ data +" news")
        $(".alert").toggleClass("invisible");
        $("#scrape").empty().text('Fetch The News').prop("disabled", false);
    });
});

// function that displays the news
function getData(){
$.get("/news", function(data) {

// empty the div
$(".content").empty();

  // For each one
  var rowNum =0;
  var divInRow =0;
  var divNum = 0;

    for (var i = 0; i < data.length; i++) {
        if (divInRow == 0){
            var row = $("<div>").addClass("row rowNum" + rowNum);  
            $(".content").append(row);
            
        }if (divInRow <= 4){
            var col = $("<div>").addClass("col-lg-3 divNum"+i);
            $(".rowNum"+rowNum).append(col);
            $(".divNum"+i).append("<h5>"+data[i].title+"</h5>"+ "<p>"+ data[i].description +"</p>"+ "<p><button class ='btn btn-primary save-news' id='" +data[i]._id+ "'> Save News</button></p>");
                if (data[i].saved == true){
                    $("#"+data[i]._id).text("Saved").prop("disabled", true);
                }
                divInRow++;
                    if (divInRow == 4){
                        divInRow = 0;
                        rowNum++;
                    }
        }
    }
});
};


// When ever user click "Save News btn"
$(document).on("click",".save-news", function(){
    //disable the btn
    $(this).text("Saved").prop("disabled", true);
    // grab each of the IDs
    var id = $(this).attr("id");

    // Now make an ajax call to save the atrticle
    $.ajax({
        method: "POST",
        url: "/save/" + id
    });
});

// function to close alert box
$(document).on("click",".close", function(){
    $(".alert").toggleClass("invisible");
});

// function to delete data
$(document).on("click","#delete", function(){
    $.ajax({
        method: "GET",
        url: "/delete"
    })
    .done(function(data){
       location.reload(data);
    })
});

getData();
});