import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Kiss extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "kiss");
	}
}

const kiss: Command = new Kiss({
	name: "kiss",
	aliases: [],
	description: "Post an image of anime kiss.",
	defaultAccess: 1,
	parent: "",
	syntax: "kiss",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of kiss",
			code: `kiss`,
		},
	],
});

export default kiss;
