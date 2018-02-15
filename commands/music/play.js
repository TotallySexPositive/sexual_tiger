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

    let song_identifier = args.join(" ");
    let found_song = undefined;
    if(DAL.isInt(song_identifier)) {
        let {err, song} = DAL.findSongById(song_identifier)
        if(err) {
            return message.channel.send("An error occured while searching for song.")
        } else if (song === undefined) { 
            return message.channel.send("There is no song by that id.")
        } else {
            found_song = song;
        }
    } else {
        let {err, song} = DAL.findSongByName(song_identifier)
        if(err) {
            return message.channel.send("An error occured while searching for song.")
        } else if (song === undefined) { //No exact match on song. Try searching?
            let {err, songs} = DAL.searchForSongs(song_identifier, 15)
            if(err) {
                return message.channel.send("A song by that name didnt exist, and we crashed while searching for similar songs.")
            } else if(songs === undefined) {
                return message.channel.send("There is no song by that name, and couldnt find any close matches.")
            } else if (songs.length === 1) {
                message.channel.send("That song didnt exist, but we found one close match, Playing it.")
                found_song = songs[0];
            } else {
                message.channel.send("That song didnt exist and we found several close matches. Pick one to play.")
                return message.channel.send(asciitable(options, songs),{code:true})
            }
        } else {
            found_song = song;
        }
    }

    vc.join()
    .then(connection => {
        UTIL.playAudio(client, connection, message, found_song, UTIL.playAudioBasicCallBack)
    })
    .catch(console.error);
}

exports.help = () =>{
    return "Play a specific song.";
};
