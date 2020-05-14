const path       = require("path");
const DAL        = require(path.resolve("dal.js"));
const UTIL       = require(path.resolve("utils.js"));
const asciitable = require("asciitable");

let options = {
	skinny               : true,
	intersectionCharacter: "+",
	columns              : [
		{field: "song_id", name: "ID"},
		{field: "name", name: "Name"},
		{field: "num_plays", name: "Plays"}
	]
};

module.exports = {
	name          : "top",
	aliases       : [],
	description   : "Get the most played songs in the database.  A number is optional, if no number is specified, Top 5 are returned.  1-10 are allowed.",
	default_access: 0,
	args          : false,
	usage         : "[?num_songs]",
	parent        : "song",
	category      : ["Music", "Song"],
	execute(message, args) {
		let end    = global.metrics.summaries.labels("top").startTimer();
		let r_args = message.content.slice(9).trim(); //Chop off $song top

		let top_n     = 5;
		let max_songs = 10;

		if (UTIL.isInt(r_args) && +r_args <= max_songs) {
			top_n = +r_args;
		}

		let {err, songs} = DAL.getTopSongs(top_n);
		if (err) {
			console.log(err);
			end();
			return message.channel.send("Failed to grab top songs");
		} else {
			end();
			return message.channel.send(asciitable(options, songs), {code: true});
		}
	}
};