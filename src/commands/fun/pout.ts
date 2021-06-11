import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Pout extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "pout");
	}
}

const pout: Command = new Pout({
	name: "pout",
	aliases: [],
	description: "Post an image of anime pout.",
	defaultAccess: 1,
	parent: "",
	syntax: "pout",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of pout",
			code: `pout`,
		},
	],
});

export default pout;
