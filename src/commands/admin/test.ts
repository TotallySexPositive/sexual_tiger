import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";

class Test extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		console.log("Test command");
	}
}

const test: Command = new Test({
	name: "test",
	aliases: [],
	description: "I dont know what I do, I change from time to time.",
	defaultAccess: 0,
	parent: "",
	syntax: "test",
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Do something, or nothing, who knows.",
			code: "test",
		},
	],
});

export default test;
