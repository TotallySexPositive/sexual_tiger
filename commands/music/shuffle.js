const path    = require("path");
const fs      = require("fs");
const shuffle = require("array-shuffle");
const DAL     = require(path.resolve("dal.js"));
const UTIL    = require(path.resolve("utils.js"));

module.exports = {
	name          : "shuffle",
	aliases       : [],
	description   : "Shuffle the current song queue or replace the song queue with a shuffled playlist.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(message, args) {
		let end                 = global.metrics.summaries.labels("shuffle").startTimer();
		let server              = global.servers[message.guild.id];
		let vc                  = message.member.voice.channel;
		let playlist_identifier = args.join(" ");

		if (vc === null) {
			return message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
		}

		if (args.length <= 0) { //Just shuffle the current song queue
			server.song_queue = shuffle(server.song_queue);
			return message.channel.send("Shuffled the remaining songs in the queue.");
		} else { //Try and set the song_queue to the playlist specified and shuffle it.
			let {err, songs} = DAL.getSongsByPlaylistIdentifier(playlist_identifier);

			if (err) {
				return message.channel.send("Unknown error occured while fetching playlist songs.");
			} else if (songs === undefined || songs.length === 0) {
				return message.channel.send("This playlist has no songs, you suck as a DJ.");
			}

			server.song_queue = shuffle(songs);
			UTIL.playAudio(vc);
		}
		end();
	}
};