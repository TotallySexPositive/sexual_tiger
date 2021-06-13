import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class VDown extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		var server = global.servers[message.guild.id];
		let vc = message.member.voice.channel;
		let promise = server.connectionPromise;

		if (vc === undefined) {
			message.channel.send("You must be in a Voice Channel to change the volume.");
			return;
		}

		server.volume = server.volume / 2;

		if (vc && promise != null) {
			promise
				.then((connection: { dispatcher: { setVolume: (arg0: any) => void } }) => {
					connection.dispatcher.setVolume(server.volume);
					message.channel.send(`Lowered volume: ${server.volume * 100}%`);
				})
				.catch((reason: any) => {
					console.log(reason);
				});
		}
	}
}

const vdown: Command = new VDown({
	name: "vdown",
	aliases: [],
	description: "Turn down the volume the bot is playing at.",
	defaultAccess: 1,
	parent: "",
	syntax: "vdown",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Turn down the volume",
			code: "vdown",
		},
	],
});

export default vdown;
