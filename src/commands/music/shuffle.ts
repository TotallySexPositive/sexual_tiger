import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../dal";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils";
const arrShuffle = require("array-arrShuffle");
declare const global: CustomNodeJsGlobal;

class Shuffle extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		var server = global.servers[message.guild.id];
		let vc = message.member.voice.channel;
		let playlist_identifier = args.join(" ");

		if (vc === null) {
			message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
			return;
		}

		if (args.length <= 0) {
			//Just shuffle the current song queue
			server.song_queue = arrShuffle(server.song_queue);
			message.channel.send("Shuffled the remaining songs in the queue.");
		} else {
			//Try and set the song_queue to the playlist specified and shuffle it.
			let { err, songs } = DAL.getSongsByPlaylistIdentifier(playlist_identifier);

			if (err) {
				message.channel.send("Unknown error occured while fetching playlist songs.");
				return;
			} else if (songs === undefined || songs.length == 0) {
				message.channel.send("This playlist has no songs, you suck as a DJ.");
				return;
			}

			server.song_queue = arrShuffle(songs);
			UTIL.playAudio(vc);
		}
	}
}

const shuffle: Command = new Shuffle({
	name: "shuffle",
	aliases: [],
	description: "Shuffle the current song queue or replace the song queue with a shuffled playlist.",
	defaultAccess: 1,
	parent: "",
	syntax: "shuffle [playlist_identifier]",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Shuffle the remaining songs in the queue.",
			code: "shuffle",
		},
		{
			description: "Replace the current song queue with a shuffled playlist 14.",
			code: "shuffle 14",
		},
		{
			description: "Replace the current song queue with a shuffled playlist viscera.",
			code: "shuffle viscera",
		},
	],
});

export default shuffle;
