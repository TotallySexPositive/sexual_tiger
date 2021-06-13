import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class Audio extends Command {
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
			message.channel.send("Nothing to resume.");
			return;
		}

		promise
			.then((connection) => {
				if (message.member.voice.channel === connection.channel) {
					connection.dispatcher.resume();
				} else {
					message.channel.send("You are in a different voice channel. I'm not going to listen to you.");
				}
			})
			.catch((reason) => {
				console.log(reason);
			});
	}
}

const resume: Command = new Audio({
	name: "resume",
	aliases: [],
	description: "Resumes playing a previously paused song where it left off.",
	defaultAccess: 1,
	parent: "",
	syntax: "resume",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Resume the currently paused song.",
			code: "resume",
		},
	],
});

export default resume;
