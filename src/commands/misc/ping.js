exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('ping').startTimer()
    message.channel.send("pong!").catch(console.error);
    message.channel.send(`My sexual ping is ${client.ws.ping}ms`)
    end()
}
exports.help = () =>{
    return "Will pong you so hard.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "Misc",
        link: "general",
        parent: "",
        full_command: "ping",
        command: "ping",
        description: "Pings the bot and has the bot acknowledge its alive.",
        syntax: 'ping',
        examples: [
            {
                description: "Ping.....pong?",
                code: `ping`
            }
        ]
    }
    return docs;
};