import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import { CustomNodeJsGlobal } from "../../types/CustomNodeJsGlobal";
import { Server } from "../../types/Server";
declare const global: CustomNodeJsGlobal;

class FuckOff extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		const server: Server = global.servers[message.guild.id];

		if (server.connectionPromise != null) {
			server.song_queue.length = 0;
			server.connectionPromise.then((connection) => {
				if (connection.dispatcher === undefined) {
					message.channel.send("No, You Fuck Off!");
				} else {
					message.channel.send(":cry:");
					connection.disconnect();
				}
			});
		} else {
			message.channel.send("No, You Fuck Off!");
		}
	}
}

const fuckoff: Command = new FuckOff({
	name: "fuckoff",
	aliases: [],
	description: "Removes the bot from the voice channel at all costs",
	defaultAccess: 1,
	parent: "",
	syntax: "fuckoff",
	category: "Misc",
	subcategory: "General",
	examples: [
		{
			description: "Force the bot out of the channel",
			code: "fuckoff",
		},
	],
});

export default fuckoff;
