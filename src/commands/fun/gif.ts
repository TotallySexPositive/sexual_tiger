import { GiphyFetch } from "@giphy/js-fetch-api";
import { Client, Message } from "discord.js";
import auth from "../../../auth.json";
import { Command } from "../../types/Command";

const giphy = new GiphyFetch(auth.giphy);

class Gif extends Command {
	constructor(obj: any) {
		super(obj);
	}

	async execute(_client: Client, message: Message, args: Array<string>): Promise<void> {
		// giphy.random({}).then(data: gif => {

		// })
		const { data: gif } = await giphy.random({ tag: "beer", type: "gifs" });
		console.log(gif);

		// giphy.random(args.join(" "), function(err, res) {
		// 	if (err) {
		// 		console.log(err);
		// 		return message.channel.send("Error while searching for gif.");
		// 	} else {
		// 		if (res.data && res.data.images && res.data.image_original_url) {
		// 			request.head(
		// 				{
		// 					url: res.data.image_original_url,
		// 					method: "HEAD",
		// 				},
		// 				function(err, response, body) {
		// 					let bytes = response.headers["content-length"];
		// 					if (bytes <= 8388119) {
		// 						return message.channel.send({ files: [res.data.image_original_url] });
		// 					} else {
		// 						return message.channel.send(res.data.image_original_url);
		// 					}
		// 				}
		// 			);
		// 		} else {
		// 			return message.channel.send("Couldnt find anything with those tags.");
		// 		}
		// 	}
		// });
	}
}

const giff: Command = new Gif({
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

export default giff;
