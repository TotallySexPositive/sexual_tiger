const sanitize = require("sanitize-filename");
const path     = require("path");
const dir      = require("node-dir");

module.exports = {
	name          : "reload",
	aliases       : [],
	description   : "Refreshes a command so you can test changes.",
	default_access: 0,
	args          : true,
	usage         : "[command]",
	parent        : "",
	category      : ["Admin", "General"],
	execute(message, args) {
		let end = global.metrics.summaries.labels("admin_reload").startTimer();
		if (!args || args.length < 1 || args.length === undefined) return message.reply("Must provide a command name to reload.");
		// the path is relative to the *current folder*, so just ./filename.js
		let arg = args[0];
		if (arg === "all") {
			//reload all modules
			dir.files(path.resolve("commands"), (err, files) => {
				if (err) console.error(err);
				files.forEach((filename) => {
					if (!filename.endsWith(".js")) return;
					console.log(filename);
					delete require.cache[filename];
				});
			});
			message.reply(`Reloaded all commands.`);

		} else {
			dir.files(path.resolve("commands"), (err, files) => {
				if (err) console.error(err);
				files.some((filename) => {
					if (filename.endsWith(".js")) {
						arg.substr(0, arg.length - 3);
						if (filename === arg) {
							console.log("Exact match, reloading " + filename + ".");
							delete require.cache[filename];
							return true;
						} else if (filename.includes(arg)) {
							console.log("Not exact match, reloading " + filename + " just to be sure.");
							delete require.cache[filename];
							return false;
						}
					} else {
						return false;
					}
				});
			});
			message.reply(`Reloaded ${arg}.`);
		}
		end();
	}
};