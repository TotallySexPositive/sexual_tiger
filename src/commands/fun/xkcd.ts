import { Client, Message, MessageEmbed } from "discord.js";
import xkcd from "xkcd-api";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils";

class XKCD extends Command {
	constructor(obj: any) {
		super(obj);
	}

	post(message, error, response): void {
		if (error) {
			console.error(error);
		} else {
			const exampleEmbed = new MessageEmbed()
				.setColor("GOLD")
				.setTitle(response.title)
				.setImage(response.img)
				.setFooter(response.alt);

			message.channel.send(exampleEmbed);
		}
	}
	execute(_client: Client, message: Message, args: Array<string>): void {
		let arg_string = message.content.slice(5); //Chop off $xkcd
		let comic_id = arg_string.trim();

		if (comic_id === "") {
			xkcd.latest(function(error, response) {
				this.post(message, error, response);
			});
		} else if (UTIL.isInt(comic_id)) {
			xkcd.get(comic_id, function(error, response) {
				this.post(message, error, response);
			});
		} else {
			xkcd.random(function(error, response) {
				this.post(message, error, response);
			});
		}
	}
}

const gifs: Command = new XKCD({
	name: "xkcd",
	aliases: [],
	description: "Grab a XKCD image",
	defaultAccess: 1,
	parent: "",
	syntax: "xckd [comic_id]",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post current xkcd",
			code: `xkcd`,
		},
		{
			description: "Post xkcd commic id: 614",
			code: `xkcd 614`,
		},
	],
});

export default gifs;
