// Grab the articles as JSON

$.getJSON("/articles", function(data){
    for (var i = 0; i < data.length; i++) {
        $("#articles").prepend("<div class='article-card' data-id='"+ data[i]._id +"'> <p data-id='" + data[i]._id + " '>" + data[i].Headline + " </p> <a href="+ data[i].URL + " target='_blank'><button class='btn btn-sm btn-primary my-1'> View Article </button></a> </div>");
    }
});


//Whenever someone clicks a p tag
$(document).on("click", "div.article-card", function(){
    $('#comments').empty();
    // Save the id from the div tag
    var thisId = $(this).attr("data-id");
    

    //Now make an ajax call for the Article
    $.ajax({
        method: 'GET',
        url: '/articles/' + thisId
    })
    .then(function(data) {
        console.log(data);

        //The title fo the article
        $("#comments").append("<h2>" + data.Headline + "</h2>");
        //An input to enter a new title
        $("#comments").append("<input class='form-control my-1' place='Title' id='titleinput' name='title'>");
        // A textarea to add a new note body
        $('#comments').append("<textarea class='form-control my-1' place-holder='Comment' rows='4' id='bodyinput' name='title'>");
        // A button to submit a new note, wiuth the id of the article saved to it
        $('#comments').append("<button class='btn btn-success float-right my-2' data-id=' " + data._id + " ' id='savecomment'> Save Comment</ button>");

        if (data.comment) {
            $('#titleinput').val(data.comment.title);
            $('#bodyinput').val(data.comment.body);
        }
    });
});


//When you click the save note button
$(document).on('click', '#savecomment', function(e) {
    e.preventDefault();
    var thisId = $(this).attr('data-id');

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val().trim(),
            body: $('#bodyinput').val().trim()
        }
    })

    .then(function(data) {
        console.log(data);

        $('#comments').empty();
    });

    $("#titleinput").val('');
    $('#bodyinput').val('');
})