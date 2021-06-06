import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Lewd extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "lewd");
	}
}

const lewd: Command = new Lewd({
	name: "lewd",
	aliases: [],
	description: "Post an image of anime lewd.",
	defaultAccess: 1,
	parent: "",
	syntax: "lewd",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of lewd",
			code: `lewd`,
		},
	],
});

export default lewd;
