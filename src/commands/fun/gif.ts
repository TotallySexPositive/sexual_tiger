import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
const path = require("path");
const auth = require(path.resolve("auth.json"));
var giphy = require("giphy-api")(auth.giphy);
var request = require("request");

class Gif extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		giphy.random(args.join(" "), function(err, res) {
			if (err) {
				console.log(err);
				return message.channel.send("Error while searching for gif.");
			} else {
				if (res.data && res.data.images && res.data.image_original_url) {
					request.head(
						{
							url: res.data.image_original_url,
							method: "HEAD",
						},
						function(err, response, body) {
							let bytes = response.headers["content-length"];
							if (bytes <= 8388119) {
								return message.channel.send({ files: [res.data.image_original_url] });
							} else {
								return message.channel.send(res.data.image_original_url);
							}
						}
					);
				} else {
					return message.channel.send("Couldnt find anything with those tags.");
				}
			}
		});
	}
}

const gif: Command = new Gif({
	name: "gif",
	aliases: [],
	description: "Grab a random image from Giphy with the specified tags, or completely random if no tags",
	defaultAccess: 1,
	parent: "",
	syntax: "gif [tags]",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of jumping",
			code: `gif jump`,
		},
	],
});

export default gif;
