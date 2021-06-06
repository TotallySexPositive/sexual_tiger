import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Peter extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "peter");
	}
}

const peter: Command = new Peter({
	name: "peter",
	aliases: [],
	description: "Post an image that will make Peter uncomfortable or angry.",
	defaultAccess: 1,
	parent: "",
	syntax: "peter",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image to agitate Peter",
			code: `peter`,
		},
	],
});

export default peter;
