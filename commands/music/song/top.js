const path  = require("path")
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))
const fs    = require('fs');
const asciitable = require("asciitable")

var options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        {field: "song_id",  name: "ID"},
        {field: "name",     name: "Name"},
        {field: "num_plays",name: "Plays"}
    ],
};

exports.run = (client, message, args) => {
    let server = global.servers[message.guild.id];
    var r_args  = message.content.slice(9).trim(); //Chop off $song top

    let top_n = 5;
    let max_songs = 10;
    
    if(UTIL.isInt(r_args) && +r_args <= max_songs) {
        top_n = +r_args
    }

    let {err, songs} = DAL.getTopSongs(top_n);
    if(err) {
        console.log(err);
        return message.channel.send("Failed to grab top songs")
    } else {
        return message.channel.send(asciitable(options, songs),{code:true})
    }
};