import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Sorry extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "sorry");
	}
}

const sorry: Command = new Sorry({
	name: "sorry",
	aliases: [],
	description: "Post an image of anime sorry.",
	defaultAccess: 1,
	parent: "",
	syntax: "sorry",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of sorry",
			code: `sorry`,
		},
	],
});

export default sorry;
