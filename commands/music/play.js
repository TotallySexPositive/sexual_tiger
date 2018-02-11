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
    var server = global.servers[message.guild.id]

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
            let {err, songs} = DAL.searchForSongs(song_identifier, 15)
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

function hooks(connection){
    connection.on("authenticated", ()=>{
        console.log("authenticated")
    })

    connection.on("debug", (m)=>{
        console.log("debug: " + m)
    })

    connection.on("disconnect", (m)=>{
        console.log("disconnect")
    })

    connection.on("error", (m)=>{
        console.log("error: " + m.message)
    })

    connection.on("failed", (m)=>{
        console.log("failed: " + m.message)
    })

    connection.on("newSession", (m)=>{
        console.log("newSession")
    })

    connection.on("ready", (m)=>{
        console.log("ready")
    })

    connection.on("reconnecting", (m)=>{
        console.log("reconnecting")
    })

    connection.on("speaking", (user, speaking)=>{
        console.log(`${user.username} is speaking? ${speaking}`)
    })

    connection.on("warn", (m)=>{
        console.log("warn: " + m)
    })
}

function play(connection, message, song_hash){
    var server = global.servers[message.guild.id]
    let dispatcher = null;

    if (server.dispatcher){
        server.dispatcher.end("Fuckoff")
    }
    if (connection.status == 4){ //4 = dead connection
        let vc = message.member.voiceChannel
        vc.join()
        .then(connection => {
            play(connection, message, song_hash)
        })
        .catch(console.error);
        return

    }else{         
        dispatcher = connection.playFile(path.resolve("hashed_audio", `${song_hash}.mp3`), {volume: VOLUME})
        server.dispatcher = dispatcher   
    }
    
    dispatcher.on('end', (m) => {
        // The song has finished
        if (server.repeat){
            play(connection, message, song_hash); // play it again!
        } else{
            if(!server.maintain_presence && m !== "Fuckoff") {//Fuckoff means we have more media incoming, dont kill connection.
                connection.disconnect();
            }
        }
    });

    dispatcher.on('error', e => {
        // Catch any errors that may arise
        console.log(e);
        message.channel.send("all fuck, it broke!");
        connection.disconnect()
    });
}

exports.help = () =>{
    return "Play a specific song.";
};
