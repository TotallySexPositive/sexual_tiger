import { Client, Message } from "discord.js";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";
const asciitable = require("asciitable");

class Delete extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		const playlists_options = {
			skinny: true,
			intersectionCharacter: "+",
			columns: [
				{ field: "playlist_id", name: "ID" },
				{ field: "name", name: "Name" },
				{ field: "num_songs", name: "# Songs" },
			],
		};

		const songs_options = {
			skinny: true,
			intersectionCharacter: "+",
			columns: [
				{ field: "song_id", name: "ID" },
				{ field: "name", name: "Name" },
				{ field: "num_plays", name: "plays" },
			],
		};

		if (!args.length) {
			//No args, show playlists
			let { err, playlists } = DAL.getPlaylists();

			if (err) {
				//Unhandled Error
				message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
			} else {
				let table = asciitable(playlists_options, playlists);
				message.channel.send(table, { code: true, split: true });
			}
		} else {
			let playlist_identifier = args.join(" ");
			let { err, songs } = DAL.getSongsByPlaylistIdentifier(playlist_identifier);
			if (err) {
				message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
			} else {
				let table = asciitable(songs_options, songs);
				message.channel.send(table, { code: true, split: true });
			}
		}
	}
}

const list: Command = new Delete({
	name: "list",
	aliases: [],
	description: "List all playlists",
	defaultAccess: 1,
	parent: "playlist",
	syntax: "playlist list",
	category: "Music",
	subcategory: "Playlists",
	examples: [
		{
			description: "List playlists",
			code: "playlist list",
		},
	],
});

export default list;
