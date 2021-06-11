import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Wave extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "wave");
	}
}

const wave: Command = new Wave({
	name: "wave",
	aliases: [],
	description: "Post an image of anime wave.",
	defaultAccess: 1,
	parent: "",
	syntax: "wave",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of wave",
			code: `wave`,
		},
	],
});

export default wave;
