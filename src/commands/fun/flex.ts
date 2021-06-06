import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { postRandomImageByTag } from "../../utils";

class Flex extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		postRandomImageByTag(message, "flex");
	}
}

const flex: Command = new Flex({
	name: "flex",
	aliases: [],
	description: "Post an image of anime flex.",
	defaultAccess: 1,
	parent: "",
	syntax: "flex",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of flex",
			code: `flex`,
		},
	],
});

export default flex;
