const path      = require("path");
const fs        = require("fs");

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('tag').startTimer()
    //if(args.length < 2) return message.channel.send("Incorrect usage, Check the help file.")
    var playlist_command    = args[0];
    var tail                = args.slice(1);

    let p = path.resolve("built", "commands", "fun", "tag",`${playlist_command}.js`)
    if (fs.existsSync(p)) {
        let commandFile = require(p);
        commandFile.run(client, message, tail);
    } else {
       message.channel.send("That isnt a valid tag command.")
    }
    end()
}

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "tag",
        command: "tag",
        description: "This command has no direct usage.",
        syntax: 'tag',
        examples: [
            {
                description: "N/A",
                code: `n/a`
            }
        ]
    }
    return docs;
};