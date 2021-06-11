import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class NoseBleed extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "nosebleed");
	}
}

const nosebleed: Command = new NoseBleed({
	name: "nosebleed",
	aliases: [],
	description: "Post an image of anime nosebleed.",
	defaultAccess: 1,
	parent: "",
	syntax: "nosebleed",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of nosebleed",
			code: `nosebleed`,
		},
	],
});

export default nosebleed;
