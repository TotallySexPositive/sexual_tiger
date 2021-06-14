import { Client, Message } from "discord.js";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";

class Delete extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		var identifier = args.join(" ");
		let playlist_id = undefined;

		if (DAL.isInt(identifier)) {
			//Identifier is an integer, so it must be an id
			playlist_id = identifier;
		} else {
			//Identifier is not an Integer, so it must be the name of a playlist, lets find it.
			var { err, playlist } = DAL.findPlaylistByName(identifier);
			if (err) {
				message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
				return;
			} else if (playlist === undefined) {
				message.channel.send(`Sorry, ${message.author.username}, a playlist with that name doesn't exist.`);
				return;
			} else {
				playlist_id = playlist.playlist_id;
			}
		}

		var { delErr, info } = DAL.deletePlaylistById(playlist_id);

		if (delErr) {
			message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
		} else if (info.changes == 0) {
			message.channel.send(`Sorry, ${message.author.username}, but that playlist didn't exist.`);
		} else {
			message.channel.send(`The playlist ${identifier} has been deleted, your DJ career is over, ${message.author.username}!`);
		}
	}
}

const del: Command = new Delete({
	name: "delete",
	aliases: [],
	description: "Delete a playlist.  Can delete by ID or name.  Name must match exactly.",
	defaultAccess: 1,
	parent: "playlist",
	syntax: "playlist delete [playlist_identifer]",
	category: "Music",
	subcategory: "Playlists",
	examples: [
		{
			description: "Delete playlist 14 by id.",
			code: "playlist delete 14",
		},
		{
			description: "Delete playlist, 'DubStep', by name.",
			code: "playlist delete DubStep",
		},
	],
});

export default del;
