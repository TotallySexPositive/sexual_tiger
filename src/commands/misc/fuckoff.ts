import { CustomNodeJsGlobal } from "../../types/CustomNodeJsGlobal"
import { Doc } from '../../types/Doc';
import { Example } from '../../types/Example';
import { Server } from "../../types/Server";
import { Client, Message } from "discord.js";
declare const global: CustomNodeJsGlobal;

exports.run = (client: Client, message: Message, _args) => {
    const server: Server  = global.servers[message.guild.id];

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
    const doc = new Doc(
        1,
        "Misc",
        "general",
        "",
        "fuckoff",
        "fuckoff",
        "Removes the bot from the voice channel at all costs",
        "fuckoff"
    );
    doc.addExample(new Example("Force the bot out of the channel", "fuckoff"))
    return doc;
};