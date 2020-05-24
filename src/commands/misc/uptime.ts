import { CustomNodeJsGlobal } from "../../types/CustomNodeJsGlobal"
import { Doc } from "../../types/Doc"
import { Example } from "src/types/Example";
declare const global: CustomNodeJsGlobal;

exports.run = (client, message, _args) => {
    const end = global.metrics.summaries.labels('uptime').startTimer()
    const time = timeConversion(client.uptime);
    message.channel.send(`I've been up for ${time}!`).catch(console.error);
    global.metrics.uptime.set(client.uptime)
    end()
}

function timeConversion(millisec: number) {
    const secs: number = Math.floor(millisec / 1000);
    let days: string = (Math.floor(secs / 86400)).toFixed(0);
    let hours: string = (Math.floor(secs / 3600) % 24).toFixed(0);
    let minutes: string = (Math.floor(secs / 60) % 60).toFixed(0);
    let seconds: string = (secs % 60).toFixed(0);
    seconds = seconds.padStart(2, "0");
    minutes = minutes.padStart(2, "0");
    hours = hours.padStart(2, "0");
    days = days.padStart(2, "0");

    return `${days} days ${hours}:${minutes}:${seconds}`;
}

exports.help = () => {
    return "Trying to figure out how long i can keep it up?";
};

exports.docs = () => {
    const doc = new Doc(
        1,
        "Misc",
        "general",
        "",
        "uptime",
        "uptime",
        "Display how long the bot has been up.",
        "uptime"
    );
    doc.addExample(
        new Example("Get bots up time", "uptime")
    );
    return doc;
};