import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Sports extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "sports");
	}
}

const sports: Command = new Sports({
	name: "sports",
	aliases: [],
	description: "Post an image of anime sports.",
	defaultAccess: 1,
	parent: "",
	syntax: "sports",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of sports",
			code: `sports`,
		},
	],
});

export default sports;
