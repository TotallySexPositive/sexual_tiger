import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
const fs = require("fs");
const Database = require("better-sqlite3");
const DB = new Database("playlists.sql");

class BuildTable extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		const build_it = fs.readFileSync("build.sql", "utf8");
		DB.exec(build_it);
		DB.close();
	}
}

const buildTable: Command = new BuildTable({
	name: "build_table",
	aliases: [],
	description: "Builds the sql table structure for first time setup.",
	defaultAccess: 0,
	parent: "",
	syntax: "build_table",
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Builds the sql table structure.",
			code: "build_table",
		},
	],
});

export default buildTable;
