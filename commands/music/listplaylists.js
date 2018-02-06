const asciitable = require("asciitable")


exports.run = (client, message, args) => {
    var options = {
        skinny: true,
        intersectionCharacter: "+",
        columns: [
            {field: "name",         name: "Playlist"},
            {field: "playlist_id",  name: "ID"},
            {field: "num_songs",    name: "Num Songs"}
        ],
    };
    
    let query = `SELECT * FROM playlist`
    
    DB.all(query, (err, rows) => {
        if(err){
            console.log(err);
            message.channel.send(`Sorry ${message.author.username} for some reason the search failed.`);
        }
        else{
            if (!rows.length) return message.channel.send(`There are no playlists in the DB.`);

            let playlists = [];
            rows.forEach(function (playlist) {
                playlists.push({
                    "name": playlist.name,
                    "playlist_id": playlist.playlist_id,
                    "num_songs": playlist.num_songs
                })
            });

            let table = asciitable(options, playlists);

            message.channel.send("```" + table + "```");
        }
    })
};