import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Punch extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "punch");
	}
}

const punch: Command = new Punch({
	name: "punch",
	aliases: [],
	description: "Post an image of anime punch.",
	defaultAccess: 1,
	parent: "",
	syntax: "punch",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of punch",
			code: `punch`,
		},
	],
});

export default punch;
