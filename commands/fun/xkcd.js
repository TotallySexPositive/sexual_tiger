const path           = require("path");
const UTIL           = require(path.resolve("utils.js"));
const xkcd           = require("xkcd-api");
const {MessageEmbed} = require("discord.js");

module.exports = {
	name          : "xkcd",
	aliases       : [],
	description   : "Grab a XKCD image",
	default_access: 1,
	args          : false,
	usage         : "[?comic_id]",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(message, args) {
		let end        = global.metrics.summaries.labels("xkcd").startTimer();
		let arg_string = message.content.slice(5); //Chop off $xkcd
		let comic_id   = arg_string.trim();

		if (comic_id === "") {
			xkcd.latest(function (error, response) {
				if (error) {
					console.error(error);
				} else {
					const exampleEmbed = new MessageEmbed()
						.setColor("GOLD")
						.setTitle(response.title)
						.setImage(response.img)
						.setFooter(response.alt);

					message.channel.send(exampleEmbed);
				}
			});
		} else if (UTIL.isInt(comic_id)) {
			xkcd.get(comic_id, function (error, response) {
				if (error) {
					console.error(error);
				} else {
					const exampleEmbed = new MessageEmbed()
						.setColor("GOLD")
						.setTitle(response.title)
						.setImage(response.img)
						.setFooter(response.alt);

					message.channel.send(exampleEmbed);
				}
			});
		} else {
			xkcd.random(function (error, response) {
				if (error) {
					console.error(error);
				} else {
					const exampleEmbed = new MessageEmbed()
						.setColor("GOLD")
						.setTitle(response.title)
						.setImage(response.img)
						.setFooter(response.alt);

					message.channel.send(exampleEmbed);
				}
			});
		}
		end();
	}
};