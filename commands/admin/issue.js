const {Octokit} = require("@octokit/rest");
const path      = require("path");
const auth      = require(path.resolve("auth.json"));
const parser    = require("yargs-parser");

module.exports = {
	name          : "issue",
	aliases       : [],
	description   : "Creates a new issue on the Github tracker.",
	default_access: 0,
	args          : true,
	usage         : "-t \"[titel]\" -b \"[body]\" -l \"[label]\"",
	parent        : "",
	category      : ["Admin", "General"],
	execute(message, args) {
		let end         = global.metrics.summaries.labels("admin_issue").startTimer();
		let valid_users = {
			"231574835694796801": auth.github_token,
			"231606224909500418": auth.github_token,
			"183388696207294465": auth.github_steve
		};
		let token       = valid_users[message.author.id];
		if (!valid_users[message.author.id]) {
			return message.channel.send("I dont know who you are.  You are the issue!");
		}

		const opts = {
			alias        : {
				title : ["t"],
				body  : ["b"],
				labels: ["l"]
			},
			configuration: {
				"short-option-groups": false
			}
		};

		let arg_string = message.content.slice(6); //Chop off $issue
		const argv     = parser(arg_string.replace(/= +/g, "="), opts);

		if (!argv.t) return message.channel.send("All issues must have a title. -t");

		const octokit = new Octokit({
			auth: token
		});

		let payload   = {};
		payload.owner = "narayanjr";
		payload.repo  = "sexual_tiger";
		payload.title = argv.t;
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
		end();
	}
};