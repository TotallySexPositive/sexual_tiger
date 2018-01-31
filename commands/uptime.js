exports.run = (client, message, args) => {
    var time = timeConversion(client.uptime);
    message.channel.send(`I've been up for ${time}!`).catch(console.error);
}

function timeConversion(millisec){

    var seconds = (millisec / 1000).toFixed(0);

    var minutes = (millisec / (1000 * 60)).toFixed(0);

    var hours = (millisec / (1000 * 60 * 60)).toFixed(0);

    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0);

    if (seconds > 59) {
        seconds = (""+(seconds - 60*minutes));
    }
    if (minutes > 59) {
        minutes = (""+(minutes - 60*hours));
    }
    if (hours < 23) {
        hours = (""+(hours - 24*days));
    }
    seconds = seconds.padStart(2,"0");
    minutes = minutes.padStart(2,"0");
    hours = hours.padStart(2,"0");
    days = days.padStart(2,"0");

    return `${days} days ${hours}:${minutes}:${seconds}`;
}