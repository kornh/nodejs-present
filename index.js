var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server);

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.use('/static', express.static('public'));
app.use('/video', express.static('data/videos'));
app.set('view engine', 'ejs');  

app.get('/', function (req, res) {
  res.send('Hello World!');
});


app.get('/beamer', function (req, res) {
  res.render('beamer', { title: 'Remote' })
});

app.get('/remote', function (req, res) {
  res.render('remote', { title: 'Remote' })
});


// Websocket
io.sockets.on('connection', function (socket) {
    var song = null,
    ccli = "123-123-123";

    var slide_show = (cs) => {
        var slide = song.slides[cs];
        var obj = {};
        obj.title = song.song_title;
        obj.text = slide.slide_text;
        obj.slide = slide.slide_number + "/" + song.slides_count;
        obj.song = song.song_number;
        obj.part = slide.slide_title;
        obj.ccli = ccli;
		io.sockets.emit('slide_set', obj);
    }

	socket.emit('view_reset');
	socket.emit('view_text');
    var text = "Mit dem Server verbunden!";
	socket.emit('text_set', {text:text});

	socket.on('text_set', function (data) {
		io.sockets.emit('text_set', data);
	});

	socket.on('slide_set', function (data) {
		io.sockets.emit('slide_set', data);
	});

    socket.on('song_set', () => {
        song = require("./data/songs/song_0001.json")
        song.slide_current = -1;
    });
    socket.on('song_reset', () => {
        song = null;
    });
    socket.on('slide_last', () => {
        if(song == null) return;
        var cs = song.slide_current - 1;
        if(cs < 0) return;
        
        song.slide_current = cs;
        slide_show(cs);
    });
    socket.on('slide_next', () => {
        if(song == null) return;
        var cs = song.slide_current + 1;
        if(cs >= song.slides_count){
            return;
        }
        song.slide_current = cs;
        slide_show(cs);
    });

    socket.on('view_hide', () => {
		io.sockets.emit('view_hide');
    });

    socket.on('view_show', () => {
		io.sockets.emit('view_show');
    });

    socket.on('view_reset', () => {
		io.sockets.emit('view_reset');
    });

    socket.on('view_text', () => {
		io.sockets.emit('view_text');
    });

    socket.on('view_song', () => {
		io.sockets.emit('view_song');
    });
});
