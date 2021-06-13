import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";

class Home extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(client: Client, message: Message, _args: Array<string>): void {
		message.channel.send("pong!").catch(console.error);
		message.channel.send(`My sexual ping is ${client.ws.ping}ms`);
	}
}

const ping: Command = new Home({
	name: "ping",
	aliases: [],
	description: "Pings the bot and has the bot acknowledge its alive.",
	defaultAccess: 1,
	parent: "",
	syntax: "ping",
	category: "Misc",
	subcategory: "General",
	examples: [
		{
			description: "Ping.....pong?",
			code: "ping",
		},
	],
});

export default ping;
