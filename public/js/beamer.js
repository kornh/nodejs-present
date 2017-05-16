$(document).ready(function(){
    $('#fullscreen').click(() => {
        enterFullscreen(document.documentElement);
        $('#fullscreen').fadeOut();
        view_text();
        startConnection();
    });
});

function startConnection() {
    var socket = io.connect();

    socket.on('text_set', text_set);

    socket.on('slide_set', slide_set);

    socket.on('view_hide', overlay_show);
    socket.on('view_show', overlay_hide);
    socket.on('view_reset', view_reset);
    socket.on('view_text', view_text);
    socket.on('view_song', view_song);
};

function overlay_show() {
    $("#overlay").fadeIn();
}

function overlay_hide() {
    $("#overlay").fadeOut();
}

function view_reset(callback) {
    $("#view").fadeOut(() => {
        $("#view").empty().removeClass('activeView');
        if(callback) callback();
    });
}

function slide_set(data) {
    $('#text').fadeOut(() => {
        $('#text').html(data.text).fadeIn();
    });
}
function text_set(data) {
    $('#text').fadeOut(() => {
        $('#text').html(data.text).fadeIn();
    });
}

function slide_set(data) {
    $('#title').fadeOut(() => {
        $('#title').html(data.title).fadeIn();
    });
    $('#song').fadeOut(() => {
        $('#song').html(data.song).fadeIn();
    });
    $('#ccli').fadeOut(() => {
        $('#ccli').html(data.ccli).fadeIn();
    });
    $('#slide').fadeOut(() => {
        $('#slide').html(data.slide).fadeIn();
    });
    $('#part').fadeOut(() => {
        $('#part').html(data.part).fadeIn();
    });
    $('#text').fadeOut(() => {
        $('#text').html(data.text).fadeIn();
    });
}

function view_text() {
    view_reset(() => generateTextView());
}

function view_song() {
    view_reset(() => generateSongView());
}

function generateTextView() {
    $("#view").append(
        $('<div></div>').attr('class', 'container').attr('id', 'content').append(
            $('<div></div>').attr('id', 'text')
        )
    ).addClass('activeView').fadeIn();
}


function generateSongView() {
    $("#view").append(
        $('<header></header>').append(
            $('<div></div>').attr('class', 'container').append(
                $('<div></div>').attr('class', 'row text-muted').append(
                    $('<div></div>').attr('class', 'col-md-2').append(
                        $('<span></span>').attr('id', 'title')
                    ),
                    $('<div></div>').attr('class', 'col-md-8').append(
                        $('<h3></h3>').attr('id', 'part')
                    ),
                    $('<div></div>').attr('class', 'col-md-2 text-align-right').append(
                        $('<span></span>').attr('id', 'song')
                    )
                )
            )
        ),
        $('<div></div>').attr('class', 'container').append(
            $('<h1></h1>').attr('id', 'text')
        ),
        $('<footer></footer>').attr('class', 'footer').append(
            $('<div></div>').attr('class', 'container').append(
                $('<div></div>').attr('class', 'row text-muted').append(
                    $('<div></div>').attr('class', 'col-md-10').append(
                        $('<span></span>').attr('id', 'ccli')
                    ),
                    $('<div></div>').attr('class', 'col-md-2 text-align-right').append(
                        $('<span></span>').attr('id', 'slide')
                    )
                )
            )
        )
    ).addClass('activeView').fadeIn();
}
function enterFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}