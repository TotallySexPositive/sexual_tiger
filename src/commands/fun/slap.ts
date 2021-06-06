import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Slap extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "slap");
	}
}

const slap: Command = new Slap({
	name: "slap",
	aliases: [],
	description: "Post an image of anime slap.",
	defaultAccess: 1,
	parent: "",
	syntax: "slap",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of slap",
			code: `slap`,
		},
	],
});

export default slap;
