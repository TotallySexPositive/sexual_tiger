import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Clap extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "clap");
	}
}

const clap: Command = new Clap({
	name: "clap",
	aliases: [],
	description: "Post an image of anime clap.",
	defaultAccess: 1,
	parent: "",
	syntax: "clap",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of clapping",
			code: `clap`,
		},
	],
});

export default clap;
