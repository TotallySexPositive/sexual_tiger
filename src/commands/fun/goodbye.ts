import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Goodbye extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "goodbye");
	}
}

const goodbye: Command = new Goodbye({
	name: "goodbye",
	aliases: [],
	description: "Post an image of anime goodbye.",
	defaultAccess: 1,
	parent: "",
	syntax: "goodbye",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of goodbye",
			code: `goodbye`,
		},
	],
});

export default goodbye;
