import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Sleep extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "sleep");
	}
}

const sleep: Command = new Sleep({
	name: "sleep",
	aliases: [],
	description: "Post an image of anime sleep.",
	defaultAccess: 1,
	parent: "",
	syntax: "sleep",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of sleep",
			code: `sleep`,
		},
	],
});

export default sleep;
