import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class VUp extends Command {
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

		let higher_volume = server.volume * 2;

		if (higher_volume > server.max_volume) {
			message.channel.send("This is plenty loud enough.");
		} else {
			server.volume = higher_volume;

			if (vc && promise != null) {
				promise
					.then((connection) => {
						connection.dispatcher.setVolume(server.volume);
						message.channel.send(`Raised volume: ${server.volume * 100}%`);
					})
					.catch((reason) => {
						console.log(reason);
					});
			}
		}
	}
}

const vup: Command = new VUp({
	name: "vup",
	aliases: [],
	description: "Turn up the volume the bot is playing at.  There is a max volume, so dont be an ass.",
	defaultAccess: 1,
	parent: "",
	syntax: "vup",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Turn down the volume",
			code: "vup",
		},
	],
});

export default vup;
