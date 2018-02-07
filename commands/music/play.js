const path  = require("path")
const DAL   = require(path.resolve("dal.js"))
const asciitable = require("asciitable")

var options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        {field: "song_id",  name: "ID"},
        {field: "name",     name: "Name"}
    ],
};

exports.run = (client, message, args) => {
    let vc = message.member.voiceChannel
    if(vc === undefined){
        message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
        return;
    }

    let song_identifier = args.join(" ");
    let song_hash = undefined;
    if(DAL.isInt(song_identifier)) {
        let {err, song} = DAL.findSongById(song_identifier)
        if(err) {
            return message.channel.send("An error occured while searching for song.")
        } else if (song === undefined) { 
            return message.channel.send("There is no song by that id.")
        } else {
            song_hash = song.hash_id;
        }
    } else {
        let {err, song} = DAL.findSongByName(song_identifier)
        if(err) {
            return message.channel.send("An error occured while searching for song.")
        } else if (song === undefined) { //No exact match on song. Try searching?
            let {err, songs} = DAL.searchForSongs(song_identifier)
            if(err) {
                return message.channel.send("A song by that name didnt exist, and we crashed while searching for similar songs.")
            } else if(songs === undefined) {
                return message.channel.send("There is no song by that name, and couldnt find any close matches.")
            } else if (songs.length === 1) {
                message.channel.send("That song didnt exist, but we found one close match, Playing it.")
                song_hash = songs[0].hash_id;
            } else {
                message.channel.send("That song didnt exist and we found several close matches. Pick one to play.")
                return message.channel.send(asciitable(options, songs),{code:true})
            }
        } else {
            song_hash = song.hash_id;
        }
    }

    vc.join()
    .then(connection => {
        play(connection, message, song_hash)
    })
    .catch(console.error);
}

function play(connection, message, song_hash){
    let dispatcher = connection.playFile(path.resolve("hashed_audio", `${song_hash}.mp3`))
    dispatcher.setVolume(VOLUME);

    dispatcher.on('end', () => {
        // The song has finished
        if (global.repeat){
            play(connection, message, song_hash); // play it again!
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

exports.help = () =>{
    return "Play a specific song.";
};