import { Client, Message } from "discord.js";
import fs from "fs";
import download from "image-downloader";
import imageType from "image-type";
import Scraper from "images-scraper";
import path from "path";
import randomstring from "randomstring";
import readChunk from "read-chunk";
import parser from "yargs-parser";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils";

const google = new Scraper({
	puppeteer: {
		headless: false,
	},
	tbs: {
		itp: ":animated",
	},
});

const opts = {
	alias: {
		tag: ["t"],
		search: ["s"],
	},
	configuration: {
		"short-option-groups": false,
	},
};

class GrabPics extends Command {
	constructor(obj: any) {
		super(obj);
	}

	async execute(_client: Client, message: Message, _args: Array<string>): Promise<void> {
		const arg_string = message.content.slice(10); //Chop off $grab_pics
		const argv = parser(arg_string.replace(/= +/g, "="), opts);

		if (!argv.s || !argv.t || argv.t.indexOf(" ") > -1) {
			message.channel.send('You must provide a tag and a search term. Tag must be one word only. EX: $grab_pics -t pout -s "anime pout"');
		}

		const results = await google.scrape(argv.s, 100);
		results.forEach((thing) => {
			const options = {
				url: thing.url,
				dest: path.resolve("images", "tmp", randomstring.generate() + ".gif"),
			};
			download
				.image(options)
				.then(({ filename, image }) => {
					//Verify the thing we downloaded was even an image.
					const buffer = readChunk.sync(filename, 0, 12);
					const image_type = imageType(buffer);
					console.log(`Grabbed file ${filename}.`);

					if (image_type === undefined || image_type === null || !image_type.mime.includes("image")) {
						console.log(`Skipped file ${filename} because it wasnt an image.`);
					} else {
						//Ok it was an image, lets check its size
						const size = UTIL.getFileSizeInMegaBytes(filename);
						if (size > 8) {
							//Size exceeds discords upload limit, trash it.
							console.log(`Skipped file ${filename} because it was too big.`);
							fs.unlink(filename, function(err3) {
								if (err3) {
									console.log("Failed to delete image that was too big");
									console.log(err3);
								}
							});
						} else {
							//Image was small enough to upload to discord
							//Correct extension on file because I arbitrarily assigned .gif to make sure the download always works
							let filename_no_ext = filename.replace(/\.[^/.]+$/, "");
							let corrected_filename = `${filename_no_ext}.${image_type.ext}`;

							fs.rename(filename, corrected_filename, (err) => {
								if (err) {
									console.log(`Failed to rename file, ${filename} to ${corrected_filename}`);
									console.log(err);
								} else {
									let i_err = UTIL.processImageFile(corrected_filename, [argv.t], message.author.id);
									if (i_err) {
										console.log(i_err);
									}
								}
							});
						}
					}
				})
				.catch((err) => {
					console.log(err);
				});
		});

		// google
		// 	.list({
		// 		keyword: argv.s,
		// 		num: 100,
		// 		detail: true,
		// 		nightmare: {
		// 			show: true,
		// 		},
		// 		advanced: {
		// 			imgType: ":animated",
		// 		},
		// 	})
		// 	.then(function(res) {
		// 		console.log("google.list then in");
		// 		res.forEach((thing) => {
		// 			const options = {
		// 				url: thing.url,
		// 				dest: path.resolve("images", "tmp", randomstring.generate() + ".gif"),
		// 			};
		// 			console.log("downloading before");
		// 			download
		// 				.image(options)
		// 				.then(({ filename, image }) => {
		// 					//Verify the thing we downloaded was even an image.
		// 					const buffer = readChunk.sync(filename, 0, 12);
		// 					let image_type = imageType(buffer);
		// 					console.log(filename);
		// 					if (image_type === undefined || image_type === null || !image_type.mime.includes("image")) {
		// 						console.log(`Skipped file ${filename} because it wasnt an image.`);
		// 					} else {
		// 						//Ok it was an image, lets check its size
		// 						let size = UTIL.getFileSizeInMegaBytes(filename);
		// 						if (size > 8) {
		// 							//Size exceeds discords upload limit, trash it.
		// 							console.log(`Skipped file ${filename} because it was too big.`);
		// 							fs.unlink(filename, function(err3) {
		// 								if (err3) {
		// 									console.log("Failed to delete image that was too big");
		// 									console.log(err3);
		// 								}
		// 							});
		// 						} else {
		// 							//Image was small enough to upload to discord
		// 							//Correct extension on file because I arbitrarily assigned .gif to make sure the download always works
		// 							let filename_no_ext = filename.replace(/\.[^/.]+$/, "");
		// 							let corrected_filename = `${filename_no_ext}.${image_type.ext}`;

		// 							fs.rename(filename, corrected_filename, (err) => {
		// 								if (err) {
		// 									console.log(`Failed to rename file, ${filename} to ${corrected_filename}`);
		// 									console.log(err);
		// 								} else {
		// 									let i_err = UTIL.processImageFile(corrected_filename, [argv.t], message.author.id);
		// 									if (i_err) {
		// 										console.log(i_err);
		// 									}
		// 								}
		// 							});
		// 						}
		// 					}
		// 				})
		// 				.catch((err) => {
		// 					console.log(err);
		// 				});
		// 		});
		// 	})
		// 	.catch(function(err) {
		// 		console.log("err", err);
		// 	});
	}
}

const grab_pics: Command = new GrabPics({
	name: "grab_pics",
	aliases: [],
	description:
		"THIS DOES NOT WORK ON THE LIVE BOT ON DIGITAL OCEAN.  Grabs 100 animated images from google and stores them in the DB.  A new tag must be made using the tag create command.  Make sure your search terms are quoted.  NOTE: This does NOT create the command to display the images.",
	defaultAccess: 0,
	parent: "",
	syntax: `grab_pics -s "[search_terms]" -t [tag_name]`,
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Grab Anime clapping images.",
			code: `grag_pics -s "anime clapping" -t clap`,
		},
	],
});

export default grab_pics;
