import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Scared extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "scared");
	}
}

const scared: Command = new Scared({
	name: "scared",
	aliases: [],
	description: "Post an image of anime scared.",
	defaultAccess: 1,
	parent: "",
	syntax: "scared",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of scared",
			code: `scared`,
		},
	],
});

export default scared;
