import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class Pause extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let vc = message.member.voice.channel;
		var server = global.servers[message.guild.id];
		let promise = server.connectionPromise;

		if (vc === null) {
			message.channel.send("You are not in a voice channel. I'm not going to listen to you.");
			return;
		}
		if (promise === null) {
			message.channel.send("No audio is playing.  You must be hearing things.");
			return;
		}

		promise
			.then((connection) => {
				if (message.member.voice.channel === connection.channel) {
					connection.dispatcher.pause();
				} else {
					message.channel.send("You are in a different voice channel. I'm not going to listen to you.");
				}
			})
			.catch((reason) => {
				console.log(reason);
			});
	}
}

const pause: Command = new Pause({
	name: "pause",
	aliases: [],
	description: "Pauses the currently playing song. use Resume to restart the song.",
	defaultAccess: 1,
	parent: "",
	syntax: "pause",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Pause the current song.",
			code: "pause",
		},
	],
});

export default pause;
