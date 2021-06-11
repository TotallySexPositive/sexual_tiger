import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class TigerFucking extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "tigerfucking");
	}
}

const tigerfucking: Command = new TigerFucking({
	name: "tigerfucking",
	aliases: [],
	description: "Post an image of anime tigerfucking.",
	defaultAccess: 1,
	parent: "",
	syntax: "tigerfucking",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of tigerfucking",
			code: `tigerfucking`,
		},
	],
});

export default tigerfucking;
