import { CustomNodeJsGlobal } from "../../types/CustomNodeJsGlobal"
import { Client, Message } from "discord.js"
import { Doc } from "../../types/Doc";
import { Example } from "../../types/Example";
declare const global: CustomNodeJsGlobal;

exports.run = (client: Client, message: Message, _args: Array<string>) => {
    const end = global.metrics.summaries.labels('ping').startTimer()
    message.channel.send("pong!").catch(console.error);
    message.channel.send(`My sexual ping is ${client.ws.ping}ms`)
    end()
}
exports.help = () => {
    return "Will pong you so hard.";
};

exports.docs = () => {
    const docs = new Doc(
        1, "Misc", "general", "", "ping", "ping",
        "Pings the bot and has the bot acknowledge its alive.",
        "ping"
    );
    docs.addExample(new Example("Ping.....pong?", "ping"))
    return docs;
};