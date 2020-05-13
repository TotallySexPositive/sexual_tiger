const fs         = require("fs");
const path       = require("path");
const assign     = require("assign-deep");
const recursive  = require("recursive-readdir");
const handlebars = require("handlebars");
const cfg        = require(path.resolve("configure.json"));

module.exports = {
	name          : "gen_docs",
	aliases       : [],
	description   : "Generates new Docs dynamically based on what commands exist and have a docs value.",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Admin", "General"],
	execute(message, args) {
		let end       = global.metrics.summaries.labels("admin_gen_docs").startTimer();
		let full_docs = {};

		handlebars.registerHelper("capitalize", function (title) {
			return title.charAt(0).toUpperCase() + title.slice(1);
		});

		let command_folders_path = path.resolve("commands");

		recursive(command_folders_path, function (err, files) {
			files.forEach((file) => {
				if (file.endsWith(".js")) {
					let temp = require(file);
					let keys = Object.keys(temp);

					if (keys.includes("docs")) {
						let docs  = temp.docs();
						let rt    = {
							[docs.tab]: {
								[docs.link]: {
									[docs.command]: {
										parent      : docs.parent,
										command     : docs.command,
										description : docs.description,
										syntax      : cfg.prefix + docs.syntax,
										full_command: cfg.prefix + docs.full_command,
										examples    : docs.examples.map(example => {
											example.code = cfg.prefix + example.code;
											return example;
										})
									}
								}
							}
						};
						full_docs = assign(full_docs, rt);
					}
				}
			});

			let myData = Object.keys(full_docs).map(key => {
				let tab   = full_docs[key];
				let links = Object.keys(tab).map(key => {
					let link     = tab[key];
					let commands = Object.keys(link).map(key => {
						return link[key];
					});

					link.name = key;
					commands.map(cmd => {
						delete link[cmd.command];
					});
					link.commands = commands;
					return link;
				});
				tab.links = links;

				links.map(link => {
					delete tab[link.name];
				});

				tab.name = key;
				return tab;
			});

			let test                = {"tabs": myData};
			let index_template_path = path.resolve("website", "index_template.html");
			fs.readFile(index_template_path, "utf-8", function (error, source) {
				let template = handlebars.compile(source);
				let html     = template(test);

				let index_path = path.resolve("website", "index.html");

				fs.writeFile("/var/www/html/index.html", html, function (err) {
					if (err) {
						console.log(err);
						return message.channel.send("Failed to write updated Docs to website/index.html");
					}
				});
			});
		});
		end();
	}
};