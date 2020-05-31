import {Song}     from "../../types/Song";
import {Playlist} from "../../types/Playlist";

exports.run = (client, message, args) => {
	message.reply("testing");
	Song.get("wow11").then((song) => {
		if(song) {
			song.save().then((song) => {
				console.log(song);
				song.playlists().then((playlists) => {
					console.log(playlists);
				}).catch(({err}) => {
					console.log(err);
				});
			}).catch(({err}) => {
				console.log(err);
			});
		} else {
			console.log("Song was undefined.")
		}

	}).catch(({err}) => {
		console.log(err);
	});
/*
	Playlist.get("14").then(({playlist}) => {
		console.log(playlist);
		playlist.songs().then(({songs}) => {
			console.log(songs);
		}).catch(({err}) => {
			console.log(err);
		});
	}).catch(({err}) => {
		console.log(err);
	});
*/
};

exports.help = () => {
	return "Rebuilds the Audio Gist on github from the current DB.";
};

exports.docs = () => {
	let docs = {
		default_access: 1,
		tab           : "admin",
		link          : "general",
		parent        : "",
		full_command  : "build_gist",
		command       : "build_gist",
		description   : "Rebuilds the 'audio' gist.  Rescans the entire DB and regenerates the list of songs..",
		syntax        : "build_gist",
		examples      : [
			{
				description: "Rebuild audio gist.",
				code       : "build_gist"
			}
		]
	};
	return docs;
};