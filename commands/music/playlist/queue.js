const path = require("path");
const DAL  = require(path.resolve("dal.js"));

module.exports = {
	name          : "queue",
	aliases       : [],
	description   : "Queue a playlist by identifier",
	default_access: 1,
	args          : true,
	usage         : "[playlist_identifier]",
	parent        : "playlist",
	category      : [],
	execute(client, message, args) {
		let end    = global.metrics.summaries.labels("playlist_queue").startTimer();
		let server = global.servers[message.guild.id];
		let vc     = message.member.voice.channel;

		if (vc === null) {
			return message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
		}

		let playlist_identifier = args.join(" ");
		let {err, songs}        = DAL.getSongsByPlaylistIdentifier(playlist_identifier);

		if (err) {
			return message.channel.send("Unknown error occured while fetching playlist songs.");
		} else if (songs === undefined || songs.length === 0) {
			return message.channel.send("This playlist has no songs, you suck as a DJ.");
		}

		server.song_queue = server.song_queue.concat(songs);
		end();
	}
};