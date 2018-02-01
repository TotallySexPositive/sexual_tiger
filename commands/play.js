const path = require("path")

exports.run = (client, message, args) => {
    let vc = message.member.voiceChannel
    let dispatcher = null;
    vc.join()
    .then(connection => {
        
        dispatcher = connection.playFile(path.resolve("audio", args[0]))
        dispatcher.setVolume(.125);

        dispatcher.on('end', () => {
            // The song has finished
            vc.leave();
        });
          
        dispatcher.on('error', e => {
            // Catch any errors that may arise
            console.log(e);
            vc.leave();
            message.channel.send("all fuck, it broke!");
        });
    })
    .catch(console.error);
}


/*
dispatcher.on('end', () => {
  // The song has finished
});

dispatcher.on('error', e => {
  // Catch any errors that may arise
  console.log(e);
});

dispatcher.setVolume(0.5); // Set the volume to 50%
dispatcher.setVolume(1); // Set the volume back to 100%

console.log(dispatcher.time); // The time in milliseconds that the stream dispatcher has been playing for

dispatcher.pause(); // Pause the stream
dispatcher.resume(); // Carry on playing

dispatcher.end(); // End the dispatcher, emits 'end' event*/
