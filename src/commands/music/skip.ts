import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class Audio extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		var server = global.servers[message.guild.id];
		let vc = message.member.voice.channel;

		if (vc === null) {
			message.channel.send("You are not in a voice channel. I'm not going to listen to you.");
			return;
		}

		if (server.connectionPromise) {
			server.connectionPromise.then((connection) => {
				if (message.member.voice.channel === connection.channel) {
					if (server.repeat) {
						server.song_queue.shift();
					}
					connection.dispatcher.end();
				} else {
					message.channel.send("You are in a different voice channel. I'm not going to listen to you.");
				}
			});
		}
	}
}

const skip: Command = new Audio({
	name: "skip",
	aliases: [],
	description: "Skip to the next song in the queue.",
	defaultAccess: 1,
	parent: "",
	syntax: "skip",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Skip the current song.",
			code: "skip",
		},
	],
});

export default skip;
