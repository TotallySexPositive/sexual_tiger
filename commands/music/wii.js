const path = require("path");
const DAL  = require(path.resolve("dal.js"));
const UTIL = require(path.resolve("utils.js"));

module.exports = {
	name          : "wii",
	aliases       : [],
	description   : "Induce anxiety by playing some Wii music......",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(client, message, args) {
		let end    = global.metrics.summaries.labels("wii").startTimer();
		let server = global.servers[message.guild.id];

		let vc = message.member.voice.channel;
		if (vc === undefined) {
			return message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
		}

		//2059-wii
		//2058 pause
		//2117 no pause
		let anxiety         = [2058, 2059, 2117];
		let song_identifier = anxiety[anxiety.length * Math.random() | 0];
		let found_song;

		let {err, song} = DAL.findSongByIdentifier(song_identifier);

		if (err) {
			return message.channel.send("An error occured while searching for song.");
		} else if (song === undefined) {
			return message.channel.send("Wii broke because it couldnt find an internally defined id.  Oops?");
		} else {
			found_song = song;
		}

		server.song_queue = [];
		server.song_queue.push(found_song);
		UTIL.playAudio(vc);

		end();
	}
};