const path = require("path")
const fs = require('fs');

function isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }

function playAudio(connection, message) {
    var server = servers[message.guild.id];
    server.current_song = server.songs[0];

    server.dispatcher = connection.playFile(path.resolve("hashed_audio", `${server.current_song.hash_id}.mp3`))
    server.dispatcher.setVolume(VOLUME);

    server.songs.shift();

    server.dispatcher.on('end', () => {
        // The song has finished
        
        if(server.songs[0]) playAudio(connection, message);
        else connection.disconnect();
    });
    
    server.dispatcher.on('error', e => {
        // Catch any errors that may arise
        console.log(e);
        vc.leave();
        message.channel.send("all fuck, it broke!");
    });

}

exports.run = (client, message, args) => {
    let vc = message.member.voiceChannel
    let server_id = message.guild.id;

    if(vc === undefined){
        message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
        return;
    }
    
        if(!global.servers[message.guild.id]) global.servers[message.guild.id] = {
            playlist: {},
            current_song: {},
            songs: []
        }

        let server = global.servers[message.guild.id];
        let playlist = {};
        let search_field = "";
        if(isInt(args.join(" "))) {//Got an int id, yay super easy.
            search_field = "playlist_id"
        } else {//Fuck gotta search by name.
            search_field = "name"
        }

        let query = `SELECT * FROM playlist WHERE ${search_field} = ?`;

        DB.get(query, args.join(" "), (err, row) => {
            if(err) {
                console.log(err);
                return message.channel.send(`Looks like the query to find the playlist crashed hardcore.`);
            }
            else
            {
                if (row === undefined) {
                    return message.channel.send(`There is no playlist with that identifier.`);
                } else {
                    playlist = row;
                }

                let songs = [];
                DB.all(`SELECT * FROM playlist_song JOIN song USING (song_id) WHERE playlist_id = ${playlist.playlist_id}`, (err, rows) => {
                    if(err) {
                        console.log(err);
                        return message.channel.send(`Looks like the query to gather the playlist songs crashed hardcore.`);
                    }
                    else
                    {
                        if (!rows.length) return message.channel.send(`There are no songs on that playlist.`);
                        rows.forEach(function (row) {
                            songs.push({
                                "song_id"   : row.song_id,    
                                "name"      : row.name,
                                "hash_id"   : row.hash_id
                            });
                        });

                        server.playlist = playlist;
                        server.current_song = {};
                        server.songs = songs;
                        
                        vc.join().then(connection => {
                            playAudio(connection, message);
                        })
                        .catch(console.error);
                    }
                });
            }
        });
}

exports.help = () =>{
    return "Will play a playlist. (But not to no-one, he's weird)";
};