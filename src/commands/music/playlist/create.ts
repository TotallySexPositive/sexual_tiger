const path = require("path");
import { Client, Message } from "discord.js";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";

class Create extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		let name = args.join(" ");
		if (DAL.isInt(name)) {
			message.channel.send("Playlist names can not be Integers.  Just because.");
			return;
		}

		let { err, info } = DAL.createPlaylist(name, message.author.id);

		if (err && err.message.indexOf("UNIQUE") > -1) {
			//Unique constraint error
			message.channel.send(`There is already a Playlist with the name, ${name}`);
		} else if (err) {
			//Unhandled Error
			console.log(err);
			message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
		} else {
			message.channel.send(`The playlist ID: ${info.lastInsertRowid}  Name: ${name} has been created, You're the DJ ${message.author.username}!`);
		}
	}
}

const create: Command = new Create({
	name: "create",
	aliases: [],
	description: "Create a new playlist.",
	defaultAccess: 1,
	parent: "playlist",
	syntax: "playlist create [playlist_name]",
	category: "Music",
	subcategory: "Playlists",
	examples: [
		{
			description: "Create a playlist named, 'Royalty Free'.",
			code: "playlist create Royalty Free",
		},
	],
});

export default create;
