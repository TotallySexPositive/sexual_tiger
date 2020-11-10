import * as DAL from "../../dal";

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('wii').startTimer()
    let server = global.servers[message.guild.id]

    let vc = message.member.voice.channel
    if(vc === undefined){
        message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
        return;
    }

    //2059-wii
    //2058 pause
    //2117 no pause
    let anxiety = [2058, 2059, 2117]
    let song_identifier = anxiety[anxiety.length * Math.random() | 0]

    let {err, song} = DAL.findSongByIdentifier(song_identifier);

    if(err) {
        return message.channel.send("An error occured while searching for song.")
    } else if (song === undefined) { 
        return message.channel.send("Wii broke because it couldnt find an internally defined id.  Oops?")
    } else {
        server.current_song = song;

        vc.join()
          .then(connection => {
              server.song_queue.length = 0
              server.song_queue.push({
                  voice_channel: message.member.voice.channel,
                  song: song
              })
          })
          .catch(console.error);
    }
    end()
}

exports.help = () =>{
    return "Induce anxiety.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: null,
        full_command: "wii",
        command: "wii",
        description: "Induce anxiety by playing some Wii music......",
        syntax: "$wii",
        examples: [
            {
                description: "Induce anxiety.",
                code: "$wii"
            }
        ]
    }
    return docs;
};