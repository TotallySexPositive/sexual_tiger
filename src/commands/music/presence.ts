import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class Audio extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let server = global.servers[message.guild.id];
		server.maintain_presence = !server.maintain_presence;
		let m = "";
		if (server.maintain_presence) {
			m = "Ok, I'll hang out for a bit.";
		} else {
			m = "Dont worry, I'll fucking drop you like a shit covered potato.";
		}

		message.channel.send(m);
	}
}

const presence: Command = new Audio({
	name: "presence",
	aliases: [],
	description: "Make the bot stay in the channel after it is done playing a clip.  Presence command acts as a toggle.",
	defaultAccess: 1,
	parent: "",
	syntax: "presence",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Keep bot in the channel after song ends.",
			code: "presence",
		},
	],
});

export default presence;
