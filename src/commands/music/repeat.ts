import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class Repeat extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let server = global.servers[message.guild.id];
		server.repeat = !server.repeat;
		let m = "";

		if (server.repeat) {
			m = "Sounds will repeat";
		} else {
			m = "Sounds will not repeat";
		}

		message.channel.send(m);
	}
}

const repeat: Command = new Repeat({
	name: "repeat",
	aliases: [],
	description: "Repeats the current song/playlist when the song/playlist ends.",
	defaultAccess: 1,
	parent: "",
	syntax: "repeat",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Repeat the current song.",
			code: "repeat",
		},
	],
});

export default repeat;
