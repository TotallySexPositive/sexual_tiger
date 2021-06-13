const path = require("path");
import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";
const parser = require("yargs-parser");

declare const global: CustomNodeJsGlobal;

class Add extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
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
			message.channel.send('You must provide a playlist and at least 1 song.  IDs or complete names are acceptable.  EX: $playlist remove -p 3 -s "Drop the Ball"');
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
		let removed_songs = [];

		song_identifiers.forEach((identifier) => {
			let { err: s_err, song } = DAL.findSongByIdentifier(identifier);

			if (s_err) {
				skipped_songs.push(`X_X: ${identifier}`);
				console.log(s_err);
			} else if (song === undefined) {
				skipped_songs.push(`DNE: ${identifier}`);
			} else {
				let { err, info } = DAL.removeFromPlaylist(playlist.playlist_id, song.song_id);
				if (err) {
					console.log(err);
					skipped_songs.push(`X_X: ${song.song_id}: ${song.name}`);
				} else if (!info.changes) {
					skipped_songs.push(`NOL: ${song.song_id}: ${song.name}`);
				} else {
					removed_songs.push(`${song.name}`);
				}
			}
		});

		if (removed_songs.length) {
			message.channel.send(`The following songs were removed from **${playlist.name}**:\n${removed_songs.join("\n")}`);
		}
		if (skipped_songs.length) {
			message.channel.send(`The following songs either didnt exist or crashed the query and were not removed:\n${skipped_songs.join("\n")}`);
		}
	}
}

const queue: Command = new Add({
	name: "queue",
	aliases: [],
	description: "Remove a song from a playlist.  If the song occurs more than once, the last occurence is removed.",
	defaultAccess: 1,
	parent: "playlist",
	syntax: "playlist remove [playlist_identifier] | [song_identifier]",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Remove song 'Goo' from playlist, 'Viscera'.",
			code: "playlist remove Viscera | Goo",
		},
		{
			description: "Play playlist, 5 by id.",
			code: "playlist play 5",
		},
	],
});

export default queue;
