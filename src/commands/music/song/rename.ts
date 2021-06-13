import { Client, Message } from "discord.js";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";
import * as UTIL from "../../../utils";
const parser = require("yargs-parser");

class Delete extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		var opts = {
			alias: {
				id: ["i"],
				name: ["n"],
			},
			configuration: {
				"short-option-groups": false,
			},
		};

		let arg_string = message.content.slice(12); //Chop off $song rename
		var argv = parser(arg_string.replace(/= +/g, "="), opts);

		if (!argv.i || !UTIL.isInt(argv.i)) {
			message.channel.send('You must provide the id of the song. EX: $song rename -i 66 -n "Shrek Swamp"');
			return;
		}

		if (!argv.n || UTIL.isInt(argv.n)) {
			message.channel.send('You must provide the new name for the song and it must not be an integer. EX: $song rename -o 66 -n "Shrek Swamp"');
			return;
		}

		let { err, song } = DAL.findSongById(argv.i);
		if (err) {
			console.log(err);
			message.channel.send("Crashed while finding song.");
		} else if (song === undefined) {
			message.channel.send("No song with that id exists.");
		} else {
			let old_name = song.name;
			song.name = argv.name;
			let { err: u_err, info } = DAL.updateSong(song);
			if (u_err) {
				console.log(u_err);
				message.channel.send("Crahed while updating song name");
			} else if (info.changes === 0) {
				message.channel.send("You didnt actually change the name, get some glasses.");
			} else {
				message.channel.send(`${old_name} is now ${song.name}.`);
			}
		}
	}
}

const del: Command = new Delete({
	name: "delete",
	aliases: [],
	description: "Rename a song in the database.  Song names can not be integers.",
	defaultAccess: 1,
	parent: "song",
	syntax: "song rename -i [song_id] -n '[new_song_name]'",
	category: "Music",
	subcategory: "Song",
	examples: [
		{
			description: "rename song 66, to Shrektastic in the DB.",
			code: "song rename -i 66 -n 'Shrektastic'",
		},
	],
});
