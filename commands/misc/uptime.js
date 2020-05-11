exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('uptime').startTimer()
    var time = timeConversion(client.uptime);
    message.channel.send(`I've been up for ${time}!`).catch(console.error);
    global.metrics.uptime.set(client.uptime)
    end()
}

function timeConversion(millisec){
    var secs = (millisec / 1000).toFixed(0);
    days = (Math.floor(secs/86400)).toFixed(0);
    hours = (Math.floor(secs/3600) % 24).toFixed(0);
    minutes = (Math.floor(secs/60)%60).toFixed(0);
    seconds = (secs%60).toFixed(0);
    seconds = seconds.padStart(2,"0");
    minutes = minutes.padStart(2,"0");
    hours = hours.padStart(2,"0");
    days = days.padStart(2,"0");

    return `${days} days ${hours}:${minutes}:${seconds}`;
}

exports.help = () =>{
    return "Trying to figure out how long i can keep it up?";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "Misc",
        link: "general",
        parent: "",
        full_command: "uptime",
        command: "uptime",
        description: "Display how long the bot has been up.",
        syntax: 'uptime',
        examples: [
            {
                description: "Get bots up time",
                code: `uptime`
            }
        ]
    }
    return docs;
};