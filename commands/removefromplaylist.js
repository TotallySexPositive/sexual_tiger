
exports.run = (client, message, args) => {
    
    if(args.length != 2) {
        return message.channel.send("To remove a song from a playlist, you must pass your playlist id, and a song id.  Ex: $removefromplaylist 2 4")
    }

    let query = "DELETE FROM playlist_song WHERE playlist_id = ? AND song_id = ?"
    DB.serialize(function() {
        DB.run(query, args[0], args[1], function(err) {
            if(err && err.code === 'SQLITE_CONSTRAINT') {
                message.channel.send(`Sorry, ${message.author.username}, But either that playlist or song do not exist.`);
            } else if(err) {
                console.log(err);
                message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
            } else {
                if(!this.changes) {
                    message.channel.send(`The song, ${args[1]} wasnt even on the playlist ${args[0]}.`);

                } else {
                    message.channel.send(`That song, ${args[1]} has been removed from playlist ${args[0]}.`);
                }
            }
        });
    });
};