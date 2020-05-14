const path = require("path");
const DAL  = require(path.resolve("dal.js"));
const UTIL = require(path.resolve("utils.js"));
const fs   = require("fs");

module.exports = {
	name          : "delete",
	aliases       : [],
	description   : "Delete a song from the database.  You can only delete songs added by yourself, unless you are an admin.",
	default_access: 1,
	args          : true,
	usage         : "[song_id]",
	parent        : "song",
	category      : ["Music", "Song"],
	execute(message, args) {
		let end                 = global.metrics.summaries.labels("delete").startTimer();
		let server              = global.servers[message.guild.id];
		let identifier          = args.join(" ");
		let user_is_super_admin = server.super_admins.includes(message.author.id);

		if (!UTIL.isInt(identifier)) {
			end();
			return message.channel.send("Song can only be delete by ID herp derp...");
		}

		let {err, song} = DAL.findSongById(identifier);

		if (err) {
			console.log(err);
			end();
			return message.channel.send("Crashed while looking for that song, thanks alot.");
		} else if (song === undefined) {
			end();
			return message.channel.send("Thanks for wasting my time, there was not song by that id.");
		} else {
			if (message.author.id !== song.added_by && !user_is_super_admin) { //Yell at the user for trying to delete other peoples stuff, unless this user is a super admin. (Adam/Steve)
				end();
				return message.channel.send("Hey, how about you dont be a twat and not try and delete other peoples uploads.");
			} else {
				let {err, info} = DAL.deleteSongById(song.song_id);

				if (err) {
					if (err.message.includes("FOREIGN KEY")) {
						let {err: pl_err, playlists} = DAL.getPlaylistsWithSong(song.song_id);

						if (pl_err) {
							console.log(pl_err);
							end();
							return message.channel.send("We couldnt delete that song because it is currently on at least one playlist.  But we crashed while retreiving those playlist.");
						} else {
							let playlists_str = "";

							playlists.forEach((playlist) => {
								playlists_str = playlists_str + `ID: ${playlist.playlist_id}    Name: ${playlist.name}\n`;
							});
							end();
							return message.channel.send(`We couldnt delete that song because it is currently on the following playlist(s).\n\n${playlists_str}`);
						}
					} else {
						console.log(err);
						end();
						return message.channel.send("We couldnt delete that song and have no idea why not.");
					}
				} else {
					let gist_err    = UTIL.rebuildAudioGist();
					let hashed_file = song.hash_id + ".mp3";
					let stored_file = song.source;

					if (gist_err) {
						console.log("Failed to update audio gist on song delete.");
						console.log(gist_err);
					}

					fs.unlink(path.resolve(global.audio_dirs.hashed, hashed_file), function (err3) {
						if (err3) {
							console.log("Failed to delete requested hashed file.");
							console.log(err3);
						}
					});
					fs.unlink(path.resolve(global.audio_dirs.stored, stored_file), function (err3) {
						if (err3) {
							console.log("Failed to delete requested stored file.");
							console.log(err3);
						}
					});
					end();
					return message.channel.send(`${song.name} has been delete from the database.`);
				}
			}
		}
	}
};
