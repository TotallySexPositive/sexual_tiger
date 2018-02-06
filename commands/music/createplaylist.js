const path = require("path")

exports.run = (client, message, args) => {
    
    let name = args.join(" ");
    DB.serialize(function() {
        var stmt = DB.prepare("INSERT INTO playlist (name, created_by) VALUES (?, ?)");
        
        stmt.run(name, message.author.id, function(err) {
            if(err) {
                if(err.message.indexOf("UNIQUE") > -1) {//Unique constraint error
                    message.channel.send(`There is already a Playlist with the name, ${name}`);
                } else {
                    console.log(err);
                    message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
                } 
            } else {
                message.channel.send(`The playlist ${name} has been created, You're the DJ ${message.author.username}!`);
            }
        });
        stmt.finalize();
    });
};