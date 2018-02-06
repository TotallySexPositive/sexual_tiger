const path = require("path")
const fs = require('fs');

exports.run = (client, message, args) => {
    let vc = message.member.voiceChannel
    if(vc === undefined){
        message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
        return;
    }
    vc.join()
    .then(connection => {
        play(connection, message, args)
    })
    .catch(console.error);
}

function play(connection, message, args){
    let fp = path.resolve("audio", args[0]);

    fs.exists(fp, function(exists) {
        if(exists) {
            let dispatcher = connection.playFile(fp)
            dispatcher.setVolume(VOLUME);

            dispatcher.on('end', () => {
                // The song has finished
                p = path.resolve("commands", "repeat.json");
                jd = fs.readFileSync(p);
                j = JSON.parse(jd);
                if (j.repeat){
                    play(connection, message, args); // play it again!
                } else{
                    message.guild.voiceConnection.disconnect();
                }

            });

            dispatcher.on('error', e => {
                // Catch any errors that may arise
                console.log(e);
                message.guild.voiceConnection.disconnect();
                message.channel.send("all fuck, it broke!");
            });
        }
        else {
            message.channel.send("Could not find that file.")
            message.guild.voiceConnection.disconnect();
        }
    })
}

exports.help = () =>{
    return "Play a specific song.";
};