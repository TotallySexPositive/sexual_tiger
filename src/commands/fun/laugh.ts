import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Laugh extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "laugh");
	}
}

const laugh: Command = new Laugh({
	name: "laugh",
	aliases: [],
	description: "Post an image of anime laugh.",
	defaultAccess: 1,
	parent: "",
	syntax: "laugh",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of laugh",
			code: `laugh`,
		},
	],
});

export default laugh;
