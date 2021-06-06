import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Dance extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "dance");
	}
}

const dance: Command = new Dance({
	name: "dance",
	aliases: [],
	description: "Post an image of anime dance.",
	defaultAccess: 1,
	parent: "",
	syntax: "dance",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of dance",
			code: `dance`,
		},
	],
});

export default dance;
