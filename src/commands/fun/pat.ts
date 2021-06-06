import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Pat extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "pat");
	}
}

const pat: Command = new Pat({
	name: "pat",
	aliases: [],
	description: "Post an image of anime pat.",
	defaultAccess: 1,
	parent: "",
	syntax: "pat",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of pat",
			code: `pat`,
		},
	],
});

export default pat;
