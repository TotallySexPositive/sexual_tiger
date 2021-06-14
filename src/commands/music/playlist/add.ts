import { Client, Message } from "discord.js";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";
const parser = require("yargs-parser");

class Add extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		var opts = {
			alias: {
				playlist: ["p"],
				song: ["s"],
			},
			configuration: {
				"short-option-groups": false,
			},
		};

		let arg_string = message.content.slice(13); //Chop off $playlist add
		var argv = parser(arg_string.replace(/= +/g, "="), opts);

		if (!argv.s || !argv.p) {
			message.channel.send('You must provide a playlist and at least 1 song.  IDs or complete names are acceptable.  EX: $playlist add -p 3 -s "Drop the Ball"');
			return;
		}

		//Process/verify playlist
		if (Array.isArray(argv.p)) {
			message.channel.send("You must specify only a single playlist.");
			return;
		}

		let { err: p_err, playlist } = DAL.findPlaylistByIdentifier(argv.p);
		if (p_err) {
			message.channel.send(`Oops, issue trying to find the specified playlist, ${p_err.message}`);
			return;
		}
		if (playlist === undefined) {
			message.channel.send(`The specified playlist doesnt exist.`);
			return;
		}

		//Process/verify songs
		let song_identifiers = [];
		if (Array.isArray(argv.s)) {
			song_identifiers = argv.s;
		} else {
			song_identifiers.push(argv.s);
		}

		let skipped_songs = [];
		let added_songs = [];

		song_identifiers.forEach((identifier) => {
			let { err: s_err, song } = DAL.findSongByIdentifier(identifier);

			if (s_err) {
				skipped_songs.push(`X_X: ${identifier}`);
				console.log(s_err);
			} else if (song === undefined) {
				skipped_songs.push(`DNE: ${identifier}`);
			} else {
				let { err, _info } = DAL.addToPlaylist(playlist.playlist_id, song.song_id);
				if (err) {
					console.log(err);
					skipped_songs.push(`X_X: ${song.song_id}: ${song.name}`);
				} else {
					added_songs.push(`${song.name}`);
				}
			}
		});

		if (added_songs.length) {
			message.channel.send(`The following songs were added to **${playlist.name}**:\n${added_songs.join("\n")}`);
		}
		if (skipped_songs.length) {
			message.channel.send(`The following songs either didnt exist or crashed the query and were not add:\n${skipped_songs.join("\n")}`);
		}
	}
}

const add: Command = new Add({
	name: "add",
	aliases: [],
	description: "Add a song(s) to a playlist.",
	defaultAccess: 1,
	parent: "playlist",
	syntax: "playlist add -p [playlist_id] -s [song_id]",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Add one song to a playlist.",
			code: "playlist add -p 2 -s 74",
		},
		{
			description: "Add more than one song to a playlist.",
			code: "playlist add -p 2 -s 74 -s 66 -s 12",
		},
	],
});

export default add;
