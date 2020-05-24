import {Song} from "../../types/Song.ts";

exports.run = (client, message, args) => {
	message.reply("testing")
	let song = Song.get("wow")
	console.log(song)
}