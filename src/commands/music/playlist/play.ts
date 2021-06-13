//Make playlist play index based instead of shift, repeast resets index at end of queue
import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";
import * as UTIL from "../../../utils";
declare const global: CustomNodeJsGlobal;

const parser = require("yargs-parser");

class Add extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		var server = global.servers[message.guild.id];
		let vc = message.member.voice.channel;

		if (vc === null) {
			message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
			return;
		}

		let playlist_identifier = args.join(" ");
		let { err, songs } = DAL.getSongsByPlaylistIdentifier(playlist_identifier);

		if (err) {
			message.channel.send("Unknown error occured while fetching playlist songs.");
			return;
		} else if (songs === undefined || songs.length == 0) {
			message.channel.send("This playlist has no songs, you suck as a DJ.");
			return;
		}

		server.song_queue = songs;
		UTIL.playAudio(vc);
	}
}

const play: Command = new Add({
	name: "play",
	aliases: [],
	description: "Play a playlist by identifier",
	defaultAccess: 1,
	parent: "playlist",
	syntax: "playlist play [playlist_identifier]",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Play playlist, 'Viscera' by name.",
			code: "playlist play Viscera",
		},
		{
			description: "Play playlist, 5 by id.",
			code: "playlist play 5",
		},
	],
});

export default play;
