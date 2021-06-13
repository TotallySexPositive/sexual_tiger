import { Client, Message } from "discord.js";
import * as DAL from "../../dal";
import { Command } from "../../types/Command";

const probe = require("node-ffprobe");
const path = require("path");
const fs = require("fs");

class CleanDb extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let { err: s_err, songs } = DAL.getAllSongs();
		if (s_err) {
			console.log("Failed to get songs");
		} else {
			let ids_to_delete = [];
			songs.forEach((song) => {
				if (!fs.existsSync(song.source)) {
					let { err: d_err, info } = DAL.deleteSongById(song.song_id);
					if (d_err) {
						console.log(`Failed to delete ${song.song_id}`);
						console.log(d_err);
					}
				}
			});
		}
	}
}

const cleanDb: Command = new CleanDb({
	name: "clean_db",
	aliases: [],
	description: "Deletes all Song entries from the DB where the source file no longer exists.",
	defaultAccess: 0,
	parent: "",
	syntax: "clean_db",
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Clean up all records to missing songs.",
			code: "clean_db",
		},
	],
});

export default cleanDb;
