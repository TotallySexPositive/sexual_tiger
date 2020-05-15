const fs     = require("fs");
let Database = require("better-sqlite3");
let DB       = new Database("playlists.sql");

module.exports = {
	name          : "build_table",
	aliases       : [],
	description   : "Initializes your tables.",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "",
	category      : [
		"Admin",
		"General"
	],
	execute(client, message, args) {
		const end      = global.metrics.summaries.labels("admin_build_table").startTimer();
		const build_it = fs.readFileSync("build.sql", "utf8");

		// This is a comment
		DB.exec(build_it);
		DB.close();
		end();
	}
};