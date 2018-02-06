//TODO Switch this to db when adam commits the createtable stuff and playlist stuff
exports.run = (client, message, args) => {
    global.repeat = !global.repeat;
    if (global.repeat) let m = "Sounds will repeat";
    else let m="Sounds will not repeat";

    message.channel.send(m)
};

exports.help = () =>{
    return "Toggles whether or not clips and songs will repeat";
};
