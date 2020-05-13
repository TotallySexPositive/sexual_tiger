const path    = require("path");
const auth    = require(path.resolve("auth.json"));
const giphy   = require("giphy-api")(auth.giphy);
const request = require("request");

module.exports = {
	name          : "gif",
	aliases       : [],
	description   : "Grab a random image from Giphy with the specified tags, or completely random if no tags",
	default_access: 0,
	args          : false,
	usage         : "[?tag]",
	parent        : "",
	category      : ["Image", "Pictures"],
	execute(message, args) {
		let end = global.metrics.summaries.labels("gif").startTimer();

		giphy.random(args.join(" "), function (err, res) {
			if (err) {
				console.log(err);
				return message.channel.send("Error while searching for gif.");
			} else {
				if (res.data && res.data.images && res.data.image_original_url) {
					request.head({
						url   : res.data.image_original_url,
						method: "HEAD"
					}, function (err, response, body) {
						let bytes = response.headers["content-length"];
						if (bytes <= 8388119) {
							return message.channel.send({files: [res.data.image_original_url]});
						} else {
							return message.channel.send(res.data.image_original_url);
						}
					});
				} else {
					return message.channel.send("Couldnt find anything with those tags.");
				}
			}
		});
		end();
	}
};