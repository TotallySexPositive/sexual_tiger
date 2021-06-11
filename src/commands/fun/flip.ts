import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Flip extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "flip");
	}
}

const flip: Command = new Flip({
	name: "flip",
	aliases: [],
	description: "Post an image of anime flip.",
	defaultAccess: 1,
	parent: "",
	syntax: "flip",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of flip",
			code: `flip`,
		},
	],
});

export default flip;
