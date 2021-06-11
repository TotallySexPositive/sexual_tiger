import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Rock extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "rock");
	}
}

const rock: Command = new Rock({
	name: "rock",
	aliases: [],
	description: "Post an image of anime rock.",
	defaultAccess: 1,
	parent: "",
	syntax: "rock",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of rock",
			code: `rock`,
		},
	],
});

export default rock;
