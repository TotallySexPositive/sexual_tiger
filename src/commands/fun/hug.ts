import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Hug extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "hug");
	}
}

const hug: Command = new Hug({
	name: "hug",
	aliases: [],
	description: "Post an image of anime hug.",
	defaultAccess: 1,
	parent: "",
	syntax: "hug",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of hug",
			code: `hug`,
		},
	],
});

export default hug;
