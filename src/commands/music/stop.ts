import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class Stop extends Command {
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

		if (server.connectionPromise != null) {
			server.song_queue.length = 0;
			server.connectionPromise.then((connection) => {
				if (connection.dispatcher === undefined) {
					message.channel.send("No audio is playing.  You must be hearing things.");
				} else {
					if (message.member.voice.channel === connection.channel) {
						connection.dispatcher.end();
					} else {
						message.channel.send("You are in a different voice channel. I'm not going to listen to you.");
					}
				}
			});
		}
	}
}

const stop: Command = new Stop({
	name: "stop",
	aliases: [],
	description: "Stops any playing audio and empties the queue.",
	defaultAccess: 1,
	parent: "",
	syntax: "stop",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Stop the current audio.",
			code: "stop",
		},
	],
});

export default stop;
