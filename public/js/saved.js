$(document).ready(function() {

function getData(){
$.get("/saved/news", function(data) {

// empty the div
$(".content").empty();
    // if there is no saved news
    if (data == ""){
        $(".alert-msg").text("You have no saved news at this moment");
        $(".alert").removeClass("alert-success");
        $(".alert").addClass("alert-danger");
        $(".alert").removeClass("invisible");
    };

    var rowNum =0;
    var divInRow =0;
    var divNum = 0;

    // iterate the data from server and dispaly to the user
    for (var i = 0; i < data.length; i++) {
        if (divInRow == 0){
            var row = $("<div>").addClass("row rowNum" + rowNum);  
            $(".content").append(row);
        }if (divInRow <= 4){
            var col = $("<div>").addClass("col-lg-3 divNum"+i);
            $(".rowNum"+rowNum).append(col);
            $(".divNum"+i).append("<h5>"+data[i].title+"</h5>"+ "<p>"+ data[i].description +"</p>"+ "<p><button class ='btn btn-primary notes' data-id='" +data[i]._id+ "'>Notes</button> <button class ='btn btn-outline-danger delete-from-save' data-id='" +data[i]._id+ "'>Delete from save</button></p>");
            divInRow++;
                if (divInRow == 4){
                    divInRow = 0;
                    rowNum++;
                }
        }
    }
});
}

function getNote(data){
    //display modal title with headline 
        var title = data.title.substring(0, 40) + "..."
        $("#modalLabel").text(title);
        // if notes do not exist
        if(!data.note[0]){
            $("#alert-area").empty();
            var alertDiv = $("<div>").addClass("alert alert-info").attr({role:"alert", id:"note-alert"});
            var alertBtn = $("<button>").addClass("close").attr({type:"button", id:"delete-note", "aria-label":"Close"});
            alertDiv.append(alertBtn);
            alertDiv.append('<strong><span id="strong-alert"></span></strong><span id="alert-msg"></span>');
            $("#alert-area").append(alertDiv);
            $("#strong-alert").text("Hello World!: ");
            $("#alert-msg").text("There is no notes have been saved.");
           
        }

        // if notes exist
        else if(data.note[0]){
            $("#alert-area").empty();
            for (var i = 0; i < data.note.length; i++){
                var alertDiv = $("<div>").addClass("alert alert-success").attr({role:"alert", id:"note-alert"});
                var alertBtn = $("<button>").addClass("close delete-note").attr({type:"button",id:data.note[i]._id, "aria-label":"Close"}).append('<span aria-hidden="true">&times;</span>');
                alertDiv.append(alertBtn);
                alertDiv.append('<strong><span id="strong-alert'+i+'"></span></strong><span id="alert-msg'+i+'"></span>');
                $("#alert-area").append(alertDiv);
                $("#strong-alert"+i).text(i+1+". ");
                $("#alert-msg"+i).text(data.note[i].body);
            };   
        };
        //show the modal
        $('#noteModal').modal('show');
};

// When ever user click "Delete from save btn"
$(document).on("click",".delete-from-save", function(){
    var id = $(this).attr("data-id");
    // Now make an ajax call to delete the saved news
    $.ajax({
        method: "POST",
        url: "/delete/news/" + id
    })
    // get all new saved new and display to the user with alert
        getData();
        $(".alert-msg").text("You have successfully deleted from saved news ")
        $(".alert").removeClass("alert-danger");
        $(".alert").addClass("alert-success");
        $(".alert").removeClass("invisible");
});


// function to close alert box
$(document).on("click",".close", function(){
    $(".alert").addClass("invisible");
});

// function to show the modal whenever user click "notes"
$(document).on("click",".notes", function(){

    // pass id from notes btn to save in the modal
    var newsId = $(this).attr("data-id");
    $("#saveNote").attr("newsID",newsId);
    
    // Now run AJAX call to get notes data from the news if exists
     $.ajax({
        method: "GET",
        url: "/saved/notes/"+newsId
    })

    // With that done, add the notes if exists information to the modal
    .done(function(data) {
        getNote(data);
    });
});

// function to save to notes to each news
$(document).on("click","#saveNote", function(e){
    e.preventDefault();

    // grab all necessary data 
    var ID = $(this).attr("newsID");
    var note = $("#message-text").val().trim();

    // make AJAX call to save note in database
    $.ajax({
        method: "POST",
        url: "/save/notes/" + ID,
        data: {body: note}
    });

    //clear the textarea and hide the modal
    $("#message-text").val("");
    $('#noteModal').modal('hide');
});


$(document).on("click",".delete-note", function(){

    // grab id from notes
    var noteId = $(this).attr("id");

    // make AJAX call to save note in database
    $.ajax({
        method: "GET",
        url: "/delete/notes/" + noteId,
    })
    .done(function(data){
        //hide modal
        $('#noteModal').modal('hide');
    });
});
//initialize function
getData();
});