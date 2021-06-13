import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";

class Audio extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		message.channel.send("<https://tiger.wentzel.dev/audio.html>");
	}
}

const audio: Command = new Audio({
	name: "audio",
	aliases: [],
	description: "Display the link to the audio list on the site.",
	defaultAccess: 1,
	parent: "",
	syntax: "audio",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Display link to list of songs.",
			code: "audio",
		},
	],
});

export default audio;
