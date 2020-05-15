const path          = require("path");
const fs            = require("fs");
const DAL           = require(path.resolve("dal.js"));
const UTIL          = require(path.resolve("utils.js"));
const Scraper       = require("images-scraper");
const google        = new Scraper("https://google.com");
const download      = require("image-downloader");
const parser        = require("yargs-parser");
const random_string = require("randomstring");
const read_chunk    = require("read-chunk");
const image_type    = require("image-type");

const opts = {
	alias        : {
		tag   : ["t"],
		search: ["s"]
	},
	configuration: {
		"short-option-groups": false
	}
};

module.exports = {
	name          : "grab_pics",
	aliases       : [],
	description   : "THIS DOES NOT WORK ON THE LIVE BOT ON DIGITAL OCEAN.  Grabs 100 animated images from google and stores them in the DB.  A new tag must be made using the tag create command.  Make sure your search terms are quoted.  NOTE: This does NOT create the command to display the images.",
	default_access: 0,
	args          : true,
	usage         : "-s \"[search terms]\" -t \"[tag name]\"",
	parent        : "",
	category      : ["Admin", "General"],
	execute(client, message, args) {
		let end        = global.metrics.summaries.labels("admin_grab_pics").startTimer();
		let arg_string = message.content.slice(10); //Chop off $grab_pics
		const argv     = parser(arg_string.replace(/= +/g, "="), opts);

		if (!argv.s || !argv.t || argv.t.indexOf(" ") > -1) {
			return message.channel.send("You must provide a tag and a search term. Tag must be one word only. EX: $grab_pics -t pout -s \"anime pout\"");
		}
		console.log("google.list before");
		google.list({
			keyword  : argv.s,
			num      : 100,
			detail   : true,
			nightmare: {
				show: true
			},
			advanced : {
				imgType: ":animated"
			}
		}).then(function (res) {
			console.log("google.list then in");
			res.forEach((thing) => {
				const options = {
					url : thing.url,
					dest: path.resolve("images", "tmp", random_string.generate() + ".gif")
				};
				console.log("downloading before");
				download.image(options).then(({filename, image}) => {
					//Verify the thing we downloaded was even an image.
					const buffer   = read_chunk.sync(filename, 0, 12);
					let image_type = image_type(buffer);
					console.log(filename);
					if (image_type === undefined || image_type === null || !image_type.mime.includes("image")) {
						console.log(`Skipped file ${filename} because it wasnt an image.`);
					} else {//Ok it was an image, lets check its size
						let size = UTIL.getFileSizeInMegaBytes(filename);
						if (size > 8) { //Size exceeds discords upload limit, trash it.
							console.log(`Skipped file ${filename} because it was too big.`);
							fs.unlink(filename, function (err3) {
								if (err3) {
									console.log("Failed to delete image that was too big");
									console.log(err3);
								}
							});
						} else { //Image was small enough to upload to discord
							//Correct extension on file because I arbitrarily assigned .gif to make sure the download always works
							let filename_no_ext    = filename.replace(/\.[^/.]+$/, "");
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
				}).catch((err) => {
					console.log(err);
				});
			});
		}).catch(function (err) {
			console.log("err", err);
		});
		end();
	}
};