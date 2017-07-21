$(document).ready(function() {

function getData(){
$.get("/saved/news", function(data) {

// empty the div
$(".content").empty();

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
            $(".divNum"+i).append("<h5>"+data[i].title+"</h5>"+ "<p>"+ data[i].description +"</p>"+ "<p><button class ='btn btn-primary notes' data-id='" +data[i]._id+ "'>Notes</button> <button class ='btn btn-danger delete-from-save' data-id='" +data[i]._id+ "'>Delete from save</button></p>");
            divInRow++;
            if (divInRow == 4){
                divInRow = 0;
                rowNum++;
            }
        }
    }
});
}

// When ever user click "Delete from save btn"
$(document).on("click",".delete-from-save", function(){
    var id = $(this).attr("data-id");
    console.log(id);
    // Now make an ajax call to save the atrticle
    $.ajax({
        method: "POST",
        url: "/delete/news/" + id
    })
    // With that done, add the Article information to the page
    .done(function(data) {
        getData();
        $(".alert-msg").text("You have successfully deleted from saved news ")
        $(".alert").toggleClass("invisible");
    })
});


// function to close alert box
$(document).on("click",".close", function(){
    $(".alert").toggleClass("invisible");
})

getData();
});