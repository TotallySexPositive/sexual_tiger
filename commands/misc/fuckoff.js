const path = require("path")

exports.run = (client, message, args) => {
    var server  = global.servers[message.guild.id];

    if (server.connectionPromise != null) {
        server.song_queue.length = 0
        server.connectionPromise.then(connection => {
            if (connection.dispatcher === undefined) {
                message.channel.send("No, You Fuck Off!")
            } else {
                message.channel.send(":cry:")
                connection.disconnect()
            }
        })
    } else {
        message.channel.send("No, You Fuck Off!")
    }
};

exports.help = () =>{
    return "Will tell the bot to fuck off from your voice channel.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "Misc",
        link: "general",
        parent: "",
        full_command: "fuckoff",
        command: "fuckoff",
        description: "Removes the bot from the voice channel at all costs",
        syntax: 'fuckoff',
        examples: [
            {
                description: "Force the bot out of the channel",
                code: `fuckoff`
            }
        ]
    }
    return docs;
};