import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Nuke extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "nuke");
	}
}

const nuke: Command = new Nuke({
	name: "nuke",
	aliases: [],
	description: "Post an image of anime nuke.",
	defaultAccess: 1,
	parent: "",
	syntax: "nuke",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of nuke",
			code: `nuke`,
		},
	],
});

export default nuke;
