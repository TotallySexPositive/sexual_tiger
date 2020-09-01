const path      = require("path");
const fs        = require("fs");

exports.run = (client, message, args) => {
    
    var playlist_command    = args[0];
    var tail                = args.slice(1);

    let p = path.resolve("built", "commands", "music", "playlist",`${playlist_command}.js`)
    if (fs.existsSync(p)) {
        let commandFile = require(p);
        commandFile.run(client, message, tail);
    } else {
       message.channel.send("That isnt a valid playlist command.")
    }

}

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: null,
        full_command: "playlist",
        command: "playlist",
        description: "Playlist is a parent command and has no use alone.",
        syntax: "$playlist",
        examples: [
            {
                description: "N/A",
                code: "n/a"
            }
        ]
    }
    return docs;
};