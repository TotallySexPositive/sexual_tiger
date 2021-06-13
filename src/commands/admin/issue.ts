"use strict";

import { Client, Message } from "discord.js";
import path from "path";
import { Command } from "../../types/Command";

const { Octokit } = require("@octokit/rest");
const auth = require(path.resolve("auth.json"));
const parser = require("yargs-parser");

class Issue extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let valid_users = {
			"231574835694796801": auth.github_token,
			"231606224909500418": auth.github_token,
			"183388696207294465": auth.github_steve,
		};
		let token = valid_users[message.author.id];
		if (!valid_users[message.author.id]) {
			message.channel.send("I dont know who you are.  You are the issue!");
			return;
		}

		const opts = {
			alias: {
				title: ["t"],
				body: ["b"],
				labels: ["l"],
				assignee: ["a"],
			},
			configuration: {
				"short-option-groups": false,
			},
		};

		let arg_string = message.content.slice(6); //Chop off $issue
		var argv = parser(arg_string.replace(/= +/g, "="), opts);

		if (!argv.t) {
			message.channel.send("All issues must have a title. -t or --title=");
			return;
		}

		// token (https://github.com/settings/tokens)
		const octokit = new Octokit({
			auth: token,
		});

		let payload = {
			owner: "narayanjr",
			repo: "sexual_tiger",
			title: argv.t,
			body: undefined,
			assignee: undefined,
			labels: undefined,
		};

		if (argv.b) payload.body = argv.b;
		if (argv.a) payload.assignee = argv.a;

		if (Array.isArray(argv.l)) {
			payload.labels = argv.l;
		} else if (argv.l) {
			payload.labels = [argv.l];
		}

		octokit.issues.create(payload, (error, result) => {
			if (error) {
				console.log(error);
				message.channel.send("Errored out while POSTing issue.");
			} else {
				message.channel.send(`Issue #${result.data.number} Title: ${result.data.title}  has been created`);
			}
		});
	}
}

const issue: Command = new Issue({
	name: "issue",
	aliases: [],
	description: "Creates a new issue on the Github tracker.",
	defaultAccess: 0,
	parent: "",
	syntax: 'issue -t "[titel]" -b "[body] -l [label]',
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Create a new issue with label bug..",
			code: `issue -t "play command crashes bot" -b "When playing a song with a long name the bot crashes" -l bug`,
		},
	],
});

export default issue;
