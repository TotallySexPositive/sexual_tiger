import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Rage extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "rage");
	}
}

const rage: Command = new Rage({
	name: "rage",
	aliases: [],
	description: "Post an image of anime rage.",
	defaultAccess: 1,
	parent: "",
	syntax: "rage",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of rage",
			code: `rage`,
		},
	],
});

export default rage;
