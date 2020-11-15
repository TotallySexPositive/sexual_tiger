exports.run = (client, message, args) => {
    
    let vc = message.member.voice.channel

    if(vc === undefined || vc == null) {
        return message.channel.send("I'm not even in a channel.")
    }

    let server = global.servers[message.guild.id];
    let promise = server.connectionPromise

    if(promise === null) {
        return message.channel.send("No audio is playing.  You must be hearing things.")
    }

    if(args.length === 1) { //1 args, set volume.
        let num_vol = Number(args[0])
        if(num_vol) {
            let req_vol = Math.round(((num_vol > 1 ? num_vol / 100.0 : num_vol) + Number.EPSILON) * 100) / 100
            
            if (req_vol > server.max_volume) {
                return message.channel.send(`Your request for a volume of ${req_vol * 100}% is higher than the servers max volume of ${server.max_volume * 100}%`)
            } else if (req_vol < 0) {
                return message.channel.send(`Your request for a volume of ${req_vol * 100}% is physically impossible, No.`)
            }

            promise.then(connection => {
                if (connection.dispatcher != null) {
                    connection.dispatcher.setVolume(req_vol);
                    server.volume = req_vol;
                }
    
                return message.channel.send(`Set Volume: ${req_vol * 100}%`);
            }).catch(reason => {
                console.log(reason)
            });
        } else {
            return message.channel.send(`Your request for a volume of ${args[0]}% is incompatible with my understanding of sound waves.`)
        }
        
    } else { //0 or 2+ args display volume, send warning
        promise.then(connection => {
            let current_volume = -1;
            if (connection.dispatcher != null) {
                current_volume = connection.dispatcher.volume;
                return message.channel.send(`Current Volume: ${current_volume * 100}%.  To set the volume, send a single number`);
            } else {
                return message.channel.send(`Couldn't find a connection to check the volume one.`);
            }
        }).catch(reason => {
            console.log(reason)
            return message.channel.send(`Dude, I dont even know how I got here, let alone what the volume is.`);
        });
    }
}

exports.help = () =>{
    return "Displays the current volume. Not like you couldn't tell though.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "volume",
        command: "volume",
        description: "Display or set the volume of the bot.  Accepts input as 0-1 or 1.005-100.",
        syntax: "volume [number]",
        examples: [
            {
                description: "Display current volume",
                code: "volume"
            },
            {
                description: "Set the volume to 50%",
                code: "volume 50"
            },
            {
                description: "Set the volume to 25%",
                code: "volume .25"
            }
        ]
    }
    return docs;
};