exports.run = (client, message, args) => {
    var time = timeConversion(client.uptime);
    message.channel.send(`I've been up for ${time}!`).catch(console.error);
}

function timeConversion(millisec){
    var secs = (millisec / 1000).toFixed(0);
    days = Math.floor(secs/86400)
    hours = Math.floor(secs/3600) % 24
    minutes = Math.floor(secs/60)%60
    seconds = secs%60

    seconds = (""+seconds).padStart(2,"0")
    minutes = (""+(minutes)).padStart(2,"0")
    hours = (""+(hours)).padStart(2,"0")
    days = (""+days).padStart(2,"0");

    return `${days} days ${hours}:${minutes}:${seconds}`;
}
