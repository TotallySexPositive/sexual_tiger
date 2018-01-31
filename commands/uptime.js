exports.run = (client, message, args) => {
    var time = timeConversion(client.uptime);
    message.channel.send(`I've been up for ${time}!`).catch(console.error);
}

function timeConversion(millisec){

    var seconds = (millisec / 1000).toFixed(0).padStart(2,"0");

    var minutes = (millisec / (1000 * 60)).toFixed(0).padStart(2,"0");

    var hours = (millisec / (1000 * 60 * 60)).toFixed(0).padStart(2,"0");

    var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(0).padStart(2,"0");

    if (seconds < 60) {
        return "00 days 00:00:"+seconds;
    } else if (minutes < 60) {
        return "00 days 00:" + minutes + ":" + seconds;
    } else if (hours < 24) {
        return "00 days " + hours + ":" + minutes + ":" + seconds;
    } else {
        return days + " days " + hours + ":" + minutes + ":" + seconds;
    }
}