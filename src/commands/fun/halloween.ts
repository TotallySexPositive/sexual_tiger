import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Halloween extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "halloween");
	}
}

const halloween: Command = new Halloween({
	name: "halloween",
	aliases: [],
	description: "Post an image of anime halloween.",
	defaultAccess: 1,
	parent: "",
	syntax: "halloween",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of halloween",
			code: `halloween`,
		},
	],
});

export default halloween;
