const path    = require("path");
const auth    = require(path.resolve("auth.json"));
const giphy   = require("giphy-api")(auth.giphy);
const request = require("request");

module.exports = {
	name          : "gifs",
	aliases       : [],
	description   : "Grab a random image from Giphy with the requested search terms",
	default_access: 1,
	args          : false,
	usage         : "[search terms]",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(message, args) {
		let end = global.metrics.summaries.labels("gifs").startTimer();
		if (args.length) {
			giphy.search({
				q     : args.join(" "),
				limit : 1,
				offset: Math.floor(Math.random() * 200) + 1
			}, function (err, res) {
				if (err) {
					console.log(err);
					return message.channel.send("Error while searching for gif.");
				} else {
					if (res.data && res.data.length) {
						request.head({
							url   : res.data[0].images.original.url,
							method: "HEAD"
						}, function (err, response, body) {
							let bytes = response.headers["content-length"];
							if (bytes <= 8388119) {
								return message.channel.send({files: [res.data[0].images.original.url]});
							} else {
								return message.channel.send(res.data[0].images.original.url);
							}
						});
					} else {
						return message.channel.send("Couldnt find anything with those terms.");
					}
				}
			});
		} else {
			return message.channel.send("You have to search for something.");
		}
		end();
	}
};