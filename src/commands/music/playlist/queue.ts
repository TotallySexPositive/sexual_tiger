import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";
declare const global: CustomNodeJsGlobal;

class Add extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		const server = global.servers[message.guild.id];
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

		server.song_queue = server.song_queue.concat(songs);
	}
}

const queue: Command = new Add({
	name: "queue",
	aliases: [],
	description: "Queue a playlist by identifier",
	defaultAccess: 1,
	parent: "playlist",
	syntax: "playlist queue [playlist_identifier]",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Queue playlist, 'Viscera' by name.",
			code: "playlist queue Viscera",
		},
		{
			description: "Queue playlist, 5 by id.",
			code: "playlist queue 5",
		},
	],
});

export default queue;
