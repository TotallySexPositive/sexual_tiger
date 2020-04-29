const path      = require("path");
const fs        = require("fs");

exports.run = (client, message, args) => {
    var playlist_command    = args[0];
    var tail                = args.slice(1);

    let p = path.resolve("commands", "music", "playlist",`${playlist_command}.js`)
    if (fs.existsSync(p)) {
        let commandFile = require(p);
        commandFile.run(client, message, tail);
    } else {
       message.channel.send("That isnt a valid playlist command.")
    }
}