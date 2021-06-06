import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Cry extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "cry");
	}
}

const cry: Command = new Cry({
	name: "cry",
	aliases: [],
	description: "Post an image of anime cry.",
	defaultAccess: 1,
	parent: "",
	syntax: "cry",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of cry",
			code: `cry`,
		},
	],
});

export default cry;
