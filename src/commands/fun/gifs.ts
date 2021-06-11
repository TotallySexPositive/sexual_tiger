import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
const path = require("path");
const auth = require(path.resolve("auth.json"));
var giphy = require("giphy-api")(auth.giphy);
var request = require("request");

class Gifs extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		if (args.length) {
			giphy.search(
				{
					q: args.join(" "),
					limit: 1,
					offset: Math.floor(Math.random() * 200) + 1,
				},
				function(err: any, res: { data: string | any[] }) {
					if (err) {
						console.log(err);
						message.channel.send("Error while searching for gif.");
					} else {
						if (res.data && res.data.length) {
							request.head(
								{
									url: res.data[0].images.original.url,
									method: "HEAD",
								},
								function(_err: any, response: { headers: { [x: string]: any } }, body: any) {
									let bytes = response.headers["content-length"];
									if (bytes <= 8388119) {
										message.channel.send({ files: [res.data[0].images.original.url] });
									} else {
										message.channel.send(res.data[0].images.original.url);
									}
								}
							);
						} else {
							message.channel.send("Couldnt find anything with those terms.");
						}
					}
				}
			);
		} else {
			message.channel.send("You have to search for something.");
		}
	}
}

const gifs: Command = new Gifs({
	name: "gifs",
	aliases: [],
	description: "Grab a random image from Giphy with the requested search terms",
	defaultAccess: 1,
	parent: "",
	syntax: "gifs [words to search]",
	category: "Image",
	subcategory: "Pictures",
	examples: [
		{
			description: "Post image of jumping",
			code: `gifs jump`,
		},
	],
});

export default gifs;
