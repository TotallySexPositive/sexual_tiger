function isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }

exports.run = (client, message, args) => {
    let search_term = args.join(" ");
    let search_field = "";
    if(isInt(search_term)) {//Got an int id, yay super easy.
        search_field = "playlist_id"
    } else {//Fuck gotta search by name.
        search_field = "name"
    }

    let query = `DELETE FROM playlist WHERE ${search_field} = ?`;

    DB.serialize(function() {
        DB.run(query, search_term, function(err) {
            if(err && err.code === 'SQLITE_CONSTRAINT') {
                message.channel.send(`Cant delete that playlist, it has songs on it.`);
            } else if (err){
                console.log(err);
                message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
            } else {
                message.channel.send(`Playlist ${search_term} has been deleted, ${message.author.username}, Your DJ license has been revoked!`);
            }
        });
    });
};

exports.help = () =>{
    return "Delet a playlist. What did it ever do to you?";
};