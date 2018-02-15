"use strict";

const path  = require("path")
const fs    = require('fs');
const DAL   = require(path.resolve("dal.js"))

var isInt = function(value) {
    var er = /^-?[0-9]+$/;
    return er.test(value);
}

var playAudio = function(client, connection, message, song, callBack) {
    var server = global.servers[message.guild.id]
    let dispatcher = null;

    if (server.dispatcher) {
        server.dispatcher.end("remain")
    }
    if (connection.status == 4) { //4 = dead connection
        let vc = message.member.voiceChannel;
        vc.join()
        .then(connection => {
            playAudio(client, connection, message, song, callBack);
        })
        .catch(console.error);
        return;
    } else {         
        dispatcher = connection.playFile(path.resolve("hashed_audio", `${song.hash_id}.mp3`), {volume: server.volume});
        server.dispatcher = dispatcher;
    }
    
    dispatcher.on('end', (m) => {
        // The song has finished
        callBack(client, connection, message, song, callBack, m);
    });

    dispatcher.on('error', e => {
        // Catch any errors that may arise
        console.log(e);
        message.channel.send("all fuck, it broke!");
        connection.disconnect()
    });
}

var playAudioBasicCallBack = function(client, connection, message, song, callBack, end_m) {
    let server = global.servers[message.guild.id];
    if (server.repeat && end_m !== "remain"){
        playAudio(client, connection, message, song, callBack); // play it again!
    } else {
        if(!server.maintain_presence && end_m !== "remain") {//Fuckoff means we have more media incoming, dont kill connection.
            connection.disconnect();
        }
    }
}

var playlistPlayBasicCallBack = function(client, connection, message, song, callBack, end_m) {
    let server = global.servers[message.guild.id];

    if(server.current_song_index < server.songs.length - 1 && end_m !== "remain") {//More songs to play and I am not being kicked off my another audio dispatcher
        server.current_song_index = server.current_song_index + 1;
        server.current_song = server.songs[server.current_song_index];
        playAudio(client, connection, message, server.current_song, callBack);
    } else { //End of the line?
        if(server.repeat && end_m !== "remain") { //Just kidding, restart. and I am not being kicked off my another audio dispatcher
            server.current_song_index = 0;
            server.current_song = server.songs[server.current_song_index];
            playAudio(client, connection, message, server.current_song, playlistPlayBasicCallBack);
        } else {
            if(!server.maintain_presence && end_m !== "remain") {//remain means we have more media incoming, dont kill connection.
                connection.disconnect();
            } 
        }
    }
}

module.exports.isInt = isInt;
module.exports.playAudio = playAudio;
module.exports.playAudioBasicCallBack = playAudioBasicCallBack;
module.exports.playlistPlayBasicCallBack = playlistPlayBasicCallBack;
