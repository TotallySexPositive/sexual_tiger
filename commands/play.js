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
        play(connection)
    })
    .catch(console.error);
}

function play(connection){
    let fp = path.resolve("audio", args[0]);

    fs.exists(fp, function(exists) {
        if(exists) {
            let dispatcher = connection.playFile(fp)
            dispatcher.setVolume(VOLUME);

            dispatcher.on('end', () => {
                // The song has finished
                if (j.repeat){
                    play(connection)

                } else{
                    vc.leave();
                }

            });

            dispatcher.on('error', e => {
                // Catch any errors that may arise
                console.log(e);
                vc.leave();
                message.channel.send("all fuck, it broke!");
            });
        }
        else {
            message.channel.send("Could not find that file.")
            vc.leave();
        }
    })
}