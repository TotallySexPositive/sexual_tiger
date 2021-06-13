import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils.js";

class Test extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let err = UTIL.generateAudioList();
		if (err) {
			message.channel.send(err.err.message);
		} else {
			message.channel.send("Updated!");
		}
	}
}

const updateAudio: Command = new Test({
	name: "update_audio",
	aliases: [],
	description: "Rebuilds the 'audio' list.  Rescans the entire DB and regenerates the list of songs..",
	defaultAccess: 0,
	parent: "",
	syntax: "update_audio",
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Rebuild audio list.",
			code: "update_audio",
		},
	],
});

export default updateAudio;
