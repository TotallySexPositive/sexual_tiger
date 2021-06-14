import { Client, Message } from "discord.js";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";
import * as UTIL from "../../../utils";
const asciitable = require("asciitable");

const options = {
	skinny: true,
	intersectionCharacter: "+",
	columns: [
		{ field: "song_id", name: "ID" },
		{ field: "name", name: "Name" },
		{ field: "num_plays", name: "Plays" },
	],
};

class Top extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		const r_args = message.content.slice(9).trim(); //Chop off $song top

		let top_n = 5;
		let max_songs = 10;

		if (UTIL.isInt(r_args) && +r_args <= max_songs) {
			top_n = +r_args;
		}

		let { err, songs } = DAL.getTopSongs(top_n);
		if (err) {
			console.log(err);
			message.channel.send("Failed to grab top songs");
		} else {
			message.channel.send(asciitable(options, songs), { code: true });
		}
	}
}

const top: Command = new Top({
	name: "top",
	aliases: [],
	description: "Get the most played songs in the database.  A number is optional, if no number is specified, Top 5 are returned.  1-10 are allowed.",
	defaultAccess: 1,
	parent: "song",
	syntax: "song top [#]",
	category: "Music",
	subcategory: "Song",
	examples: [
		{
			description: "Display top songs.",
			code: "song top",
		},
		{
			description: "Display top 7 songs.",
			code: "song top 7",
		},
	],
});

export default top;
