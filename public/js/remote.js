$(document).ready(function(){
    var socket = io.connect();

    function parseInput(){
        //var textfield = $('#text');
        //var text = textfield.val();
        var text = tinyMCE.activeEditor.getContent({format : 'raw'});
        console.log(text)
        text = text.replace(/(?:\r\n|\r|\n)/g, '<br/>');
        console.log(text)
        //textfield.val('');
        tinyMCE.activeEditor.setContent('');
        socket.emit('text_set',{text: text});
    }

    function reset(){
        //$('#text').val('');
        tinyMCE.activeEditor.setContent('')

        parseInput();
    }

    $('#text_set').click(parseInput);
    $('#text_reset').click(reset);

    $('#song_set').click(() => {
        socket.emit('song_set')
    });
    $('#song_reset').click(() => socket.emit('song_reset'));


    $('#slide_last').click(() => socket.emit('slide_last'));
    $('#slide_next').click(() => socket.emit('slide_next'));
    
    $('#view_hide').click(() => socket.emit('view_hide'));
    $('#view_show').click(() => socket.emit('view_show'));
    $('#view_reset').click(() => socket.emit('view_reset'));
    $('#view_text').click(() => socket.emit('view_text'));
    $('#view_song').click(() => socket.emit('view_song'));
});