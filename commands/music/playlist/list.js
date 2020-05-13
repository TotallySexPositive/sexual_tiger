const path       = require("path");
const DAL        = require(path.resolve("dal.js"));
const asciitable = require("asciitable");

module.exports = {
	name          : "list",
	aliases       : [],
	description   : "List all playlists",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "playlist",
	category      : ["Music", "Playlists"],
	execute(message, args) {
		let end               = global.metrics.summaries.labels("playlist_list").startTimer();
		let playlists_options = {
			skinny               : true,
			intersectionCharacter: "+",
			columns              : [
				{field: "playlist_id", name: "ID"},
				{field: "name", name: "Name"},
				{field: "num_songs", name: "# Songs"}
			]
		};

		let songs_options = {
			skinny               : true,
			intersectionCharacter: "+",
			columns              : [
				{field: "song_id", name: "ID"},
				{field: "name", name: "Name"},
				{field: "num_plays", name: "plays"}
			]
		};

		if (!args.length) { //No args, show playlists
			let {err, playlists} = DAL.getPlaylists();

			if (err) { //Unhandled Error
				message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
			} else {
				let table = asciitable(playlists_options, playlists);
				message.channel.send(table, {code: true, split: true});
			}
		} else {
			let playlist_identifier = args.join(" ");
			let {err, songs}        = DAL.getSongsByPlaylistIdentifier(playlist_identifier);

			if (err) {
				message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
			} else {
				let table = asciitable(songs_options, songs);

				message.channel.send(table, {code: true, split: true});
			}
		}
		end();
	}
};