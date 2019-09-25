$(function () {
    var id;
    var userID;
    var listofusers = [];
    var userName = $("#username");
    var socket = io();
    $("#btnLogIn").click(function () {
        if ($("input").val() === '') {
            alert("Fill up Username")
        } else {
            $("#login").fadeOut(100);
            $("#msgs").fadeIn(100);
            socket.emit('name entry', userName.val())//join trigger
        }
    });

    $('form').submit(function (e) {
        e.preventDefault();
        socket.emit('chat message', userName.val() + ": " + $('#m').val()); //trigger values
        $('#m').val('');
    });

    $("#m").on("keyup", function (e) {
        socket.emit('typing', userName.val());
    })

    socket.on('typing', function (msg) {
        $("#typing").text(msg);
        setInterval(function () {
            $("#typing").empty()
        }, 5000);
    })

    socket.on('chat message', function (msg) {
        let name = msg.split(":");
        if (name[0] != userName.val()) {
            var sendChat = $("<input class='form-control' style = 'float: left' readonly> <br>").val(msg)
            $('#chatmsg').append(sendChat); //receive
        } else {
            var reChat = $("<input class='form-control bg-dark text-light' style = 'float: right' readonly> <br>").val(msg);
            $('#chatmsg').append(reChat); // send
        }
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('name entry', function (id, names) {
        for (var i = 0; i < names.length; ++i) {
            if (!listofusers.includes(names[i])) {
                if (names[i] != userName.val()) {
                    listofusers.push(names[i]);
                    $("ul").append($("<li class='list-group-item text-dark' id = " + id[i] + "> " + names[i] + " has joined" + "</li>"));
                } else {
                    $(".user").val(names[i]);
                    userID = id[i];
                }
            }
        }
    });

    $("ul").closest("li").on('click', function () { // to be check
        alert("here")
        let liID = $(this).attr("id");
        var message = prompt("Messages: ")
        socket.emit('private', liID, userName.val() + ": " + message)
    })

    $(window).on("beforeunload", function () {
        alert($(".user").val());
        socket.emit("logout", $(".user").val());
    })

    socket.on("logout", function (id) {
        $("#" + id).remove();
    })


    socket.on('private', function (id, msg) { // samok
        
    });
});

