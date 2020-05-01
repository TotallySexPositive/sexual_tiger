const path      = require("path");
const fs        = require("fs");


exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];


    if(args.length == 0) {
        if(!server.current_song || server.current_song === undefined || server.current_song.name === undefined) {
            message.channel.send("Either nothing is playing or its not a playlist song.")
        } else {
            message.channel.send(`Current Song: ID: ${server.current_song.song_id}  Name: ${server.current_song.name}`);
        }
    } else {
        var song_command    = args[0];
        var tail            = args.slice(1);
    
        let p = path.resolve("commands", "music", "song",`${song_command}.js`)
        if (fs.existsSync(p)) {
            let commandFile = require(p);
            commandFile.run(client, message, tail);
        } else {
           message.channel.send("That isnt a valid song command.")
        }
    }
}

exports.help = () =>{
    return "Displays the current song. And more later?";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "song",
        command: "song",
        description: "Display the currently playing songs name and id.",
        syntax: "song",
        examples: [
            {
                description: "Display info on current song.",
                code: "song"
            }
        ]
    }
    return docs;
};