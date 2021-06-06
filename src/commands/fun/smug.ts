import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Smug extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "smug");
	}
}

const smug: Command = new Smug({
	name: "smug",
	aliases: [],
	description: "Post an image of anime smug.",
	defaultAccess: 1,
	parent: "",
	syntax: "smug",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of smug",
			code: `smug`,
		},
	],
});

export default smug;
