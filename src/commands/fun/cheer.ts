import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Cheer extends Command {
	constructor(obj: any) {
		super(obj);
	}
	execute(_client: Client, message: Message, _args: string[]): void {
		postRandomImageByTag(message, "cheer");
	}
}

const cheer: Command = new Cheer({
	name: "cheer",
	aliases: [],
	description: "Post an image of anime cheer.",
	defaultAccess: 1,
	parent: "",
	syntax: "cheer",
	category: "image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of cheer",
			code: `cheer`,
		},
	],
});

export default cheer;
