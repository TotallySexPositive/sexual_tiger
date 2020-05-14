const path           = require("path");
const fs             = require("fs");
const {MessageEmbed} = require("discord.js");

module.exports = {
	name          : "song",
	aliases       : [],
	description   : "Display the currently playing songs name and id.",
	default_access: 1,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(message, args) {
		let end          = global.metrics.summaries.labels("song").startTimer();
		let server       = global.servers[message.guild.id];
		let current_song = server.current_song;
		if (args.length === 0) {
			if (!current_song || current_song.name === undefined) {
				message.channel.send("Either nothing is playing or its not a playlist song.");
			} else {

				let embed = new MessageEmbed()
					.setTitle("Currently Playing...")
					.setColor(Math.floor(Math.random() * 16777215).toString(16))
					.addField("Song:", current_song.name, true)
					.addField("Id:", current_song.song_id, true)
					.addField("Plays:", current_song.num_plays, true);
				message.channel.send(embed);
			}
		} else {
			let song_command = args[0];
			let tail         = args.slice(1);

			let p = path.resolve("commands", "music", "song", `${song_command}.js`);
			if (fs.existsSync(p)) {
				let commandFile = require(p);
				commandFile.run(client, message, tail);
			} else {
				message.channel.send("That isnt a valid song command.");
			}
		}
		end();
	}
};