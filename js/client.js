(function(s) {

    var socket = io.connect('http://localhost:1338');
    var msgtpl = $('#msgtpl').html();
    $('#msgtpl').remove();


    $('#loginform').submit(function(event) {
        /* body... */
        event.preventDefault();
        console.log('CLIENT, emission de login');
        socket.emit('login', {
            username: $('#username').val(),
            mail: $('#mail').val()
        })
    })
    socket.on('logged', function() {
        $('#login').fadeOut('slow');
        /* body... */
    });

    $('.form').submit(function(event) {
    	/* Act on the event */
    	event.preventDefault();
    	socket.emit('newmsg',{message :  $('#message').val()});
    	$('#message').val('');
    	$('#message').focus();
    	
    });

    socket.on('newmsg',function (message) {
    	 $('#messages').append('<div class="message">'+
    	 	Mustache.render(msgtpl,message)+
    	 	'</div>'
			);
    	 $('#messages').animate({scrollTop: $('#messages').prop('scrollHeight')}, 500);
    });



    socket.on('newuser', function(user) {
        $('#users').append('<img src="' + user.avatar + '" id="'+user.id+'">');
    })

    socket.on('disuser',function (user) {
    	$('#'+user.id).remove(); 
    })


})(jQuery);