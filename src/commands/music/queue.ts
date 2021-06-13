import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../dal";
import { Command } from "../../types/Command";
const asciitable = require("asciitable");
declare const global: CustomNodeJsGlobal;

const options = {
	skinny: true,
	intersectionCharacter: "+",
	columns: [
		{ field: "song_id", name: "ID" },
		{ field: "name", name: "Name" },
		{ field: "num_plays", name: "plays" },
	],
};

class Audio extends Command {
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

		if (args.length <= 0) {
			if (server.song_queue.length) {
				message.channel.send(asciitable(options, server.song_queue), { code: true });
				message.channel.send("If you wish to add a song to the queue, add the name or id after the queue command.");
				return;
			} else {
				message.channel.send("There are no songs in the queue.");
				return;
			}
		}

		let song_identifier = args.join(" ");
		let found_song = undefined;
		let { err, song } = DAL.findSongByIdentifier(song_identifier);

		if (err) {
			message.channel.send("An error occured while searching for song.");
			return;
		} else if (song === undefined) {
			let { err: err_s, songs } = DAL.searchForSongs(song_identifier, 15);
			if (err_s) {
				message.channel.send("We crashed while searching for similar songs.");
				return;
			} else if (songs === undefined || songs.length === 0) {
				message.channel.send("There is no song by that name/id, and couldnt find any close matches.");
				return;
			} else if (songs.length === 1) {
				message.channel.send(`Playing closest match. ID: ${songs[0].song_id}  Name: ${songs[0].name}`);
				found_song = songs[0];
			} else {
				message.channel.send("That song didnt exist and we found several close matches. Pick one to play.");
				message.channel.send(asciitable(options, songs), { code: true, split: true });
				return;
			}
		} else {
			found_song = song;
		}

		server.song_queue.push(found_song);
	}
}

const queue: Command = new Audio({
	name: "queue",
	aliases: [],
	description:
		"Queue a song by name or ID.  If a number is specified an ID lookup is assumed.  Otherwise a search is performed for the entered value.  If an exact match or only 1 close match is found the clip is played.  Otherwise a list of options is displayed.",
	defaultAccess: 1,
	parent: "",
	syntax: "queue [song_identifier]",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Queue the song 'Wagon Wheel' by name.",
			code: "queue Wagon Wheel",
		},
	],
});

export default queue;
