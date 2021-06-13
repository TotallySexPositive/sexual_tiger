import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";

class Home extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		message.channel.send("Come visit me at, https://tiger.wentzel.dev");
	}
}

const home: Command = new Home({
	name: "home",
	aliases: [],
	description: "Displays the link to the Sexual Tiger website.",
	defaultAccess: 1,
	parent: "",
	syntax: "home",
	category: "Misc",
	subcategory: "General",
	examples: [
		{
			description: "Get Link",
			code: "home",
		},
	],
});

export default home;
