const path   = require("path");
const DAL    = require(path.resolve("dal.js"));
const UTIL   = require(path.resolve("utils.js"));
const parser = require("yargs-parser");

module.exports = {
	name          : "rename",
	aliases       : [],
	description   : "Rename a song in the Database. Song names can not be integers.",
	default_access: 1,
	args          : true,
	usage         : "-i [song_id] -n '[new_song_name]",
	parent        : "song",
	category      : ["Music", "Song"],
	execute(message, args) {
		let end  = global.metrics.summaries.labels("rename").startTimer();
		let opts = {
			alias        : {
				id  : ["i"],
				name: ["n"]
			},
			configuration: {
				"short-option-groups": false
			}
		};

		let arg_string = message.content.slice(12); //Chop off $song rename
		let argv       = parser(arg_string.replace(/= +/g, "="), opts);

		if (!argv.i || !UTIL.isInt(argv.i)) {
			return message.channel.send("You must provide the id of the song. EX: $song rename -i 66 -n \"Shrek Swamp\"");
		}

		if (!argv.n || UTIL.isInt(argv.n)) {
			return message.channel.send("You must provide the new name for the song and it must not be an integer. EX: $song rename -o 66 -n \"Shrek Swamp\"");
		}

		let {err, song} = DAL.findSongById(argv.i);

		if (err) {
			console.log(err);
			message.channel.send("Crashed while finding song.");
		} else if (song === undefined) {
			message.channel.send("No song with that id exists.");
		} else {
			let old_name           = song.name;
			song.name              = argv.name;
			let {err: u_err, info} = DAL.updateSong(song);

			if (u_err) {
				console.log(u_err);
				message.channel.send("Crahed while updating song name");
			} else if (info.changes === 0) {
				message.channel.send("You didnt actually change the name, get some glasses.");
			} else {
				message.channel.send(`${old_name} is now ${song.name}.`);
			}
		}
		end();
	}
};