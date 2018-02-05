const path = require("path")

exports.run = (client, message, args) => {
    
    if(args.length != 2) {
        return message.channel.send("To add a song to a playlist, you must pass your playlist id, and a song id.  Ex: $addtoplaylist 2 4")
    }

    DB.serialize(function() {
        var stmt = DB.prepare("INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)");
        console.log(`INSERT INTO playlist_song (playlist_id, song_id) VALUES (${args[0]}, ${args[1]})`)
        stmt.run(args[0], args[1], function(err) {
            if(err) {
                console.log(err);
                message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
            } else {
                message.channel.send(`That song has been added to that playlist.  Keep it up DJ ${message.author.username}!`);
            }
        });
        stmt.finalize();
    });
};