// Grab the articles as JSON

$.getJSON("/articles", function(data){
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + " '>" + data[i].Headline + " </p> <a href="+ data[i].URL + " target='_blank'><button> View Article </button></a>");
    }
});


//Whenever someone clicks a p tag
$(document).on("click", "p", function(){
    $('#comments').empty();
    // Save the id from the p tag
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
        $("#comments").append("<input id='titleinput' name='title'>");
        // A textarea to add a new note body
        $('#comments').append("<input id='bodyinput' name='title'>");
        // A button to submit a new note, wiuth the id of the article saved to it
        $('#comments').append("<button data-id=' " + data._id + " ' id='savecomment'> Save Comment</ button>");

        if (data.comment) {
            $('#titleinput').val(data.comment.title);
            $('#bodyinput').val(data.comment.body);
        }
    });
});


//When you click the save note button
$(document).on('click', '#savecomment', function() {
    var thisId = $(this).attr('data-id');

    $.ajax({
        method: "POST",
        url: "/articles" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $('#bodyinput').val()
        }
    })

    .then(function(data) {
        console.log(data);

        $('#comments').empty();
    });

    $("#titleinput").val('');
    $('#bodyinput').val('');
})