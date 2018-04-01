const path  = require("path")
const DAL   = require(path.resolve("dal.js"))
const UTIL   = require(path.resolve("utils.js"))
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
    var server = global.servers[message.guild.id]

    let vc = message.member.voiceChannel
    if(vc === undefined){
        message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
        return;
    }

    if(args.length <= 0) {
        return message.channel.send("You forgot to type in a song name.")
    }
    let song_identifier = args.join(" ");
    let found_song = undefined;

    let {err, song} = DAL.findSongByIdentifier(song_identifier);

    if(err) {
        return message.channel.send("An error occured while searching for song.")
    } else if (song === undefined) { 
        let {err: err_s, songs} = DAL.searchForSongs(song_identifier, 15)
        if(err_s) {
            return message.channel.send("We crashed while searching for similar songs.")
        } else if(songs === undefined || songs.length === 0) {
            return message.channel.send("There is no song by that name/id, and couldnt find any close matches.")
        } else if (songs.length === 1) {
            message.channel.send(`Playing closest match. ID: ${songs[0].song_id}  Name: ${songs[0].name}`)
            found_song = songs[0];
        } else {
            message.channel.send("That song didnt exist and we found several close matches. Pick one to play.")
            return message.channel.send(asciitable(options, songs),{code:true})
        }
    } else {
        found_song = song;
    }

    server.current_song = found_song;
    vc.join()
    .then(connection => {
        UTIL.playAudio(client, connection, message, found_song, UTIL.playAudioBasicCallBack)
    })
    .catch(console.error);
}

exports.help = () =>{
    return "Play a specific song.";
};
