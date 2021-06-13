import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../dal";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils";
declare const global: CustomNodeJsGlobal;

class Wii extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let server = global.servers[message.guild.id];

		let vc = message.member.voice.channel;
		if (vc === undefined) {
			message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
			return;
		}

		//2059-wii
		//2058 pause
		//2117 no pause
		let anxiety = [2058, 2059, 2117, 2328, 2329, 2331, 2332, 2333, 2334];
		let song_identifier = anxiety[(anxiety.length * Math.random()) | 0];

		let { err, song } = DAL.findSongByIdentifier(song_identifier);

		if (err) {
			message.channel.send("An error occured while searching for song.");
		} else if (song === undefined) {
			message.channel.send("Wii broke because it couldnt find an internally defined id.  Oops?");
		} else {
			server.song_queue = [];
			server.song_queue.push(song);
			UTIL.playAudio(vc);
		}
	}
}

const wii: Command = new Wii({
	name: "wii",
	aliases: [],
	description: "Induce anxiety by playing some Wii music......",
	defaultAccess: 1,
	parent: "",
	syntax: "wii",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Induce anxiety.",
			code: "wii",
		},
	],
});

export default wii;
