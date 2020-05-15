const path = require("path");
const fs   = require("fs");
const DAL  = require(path.resolve("dal.js"));

module.exports = {
	name          : "clean_db",
	aliases       : [],
	description   :
		"Searches the DB for any songs that are in the DB but the files do not exist.  Then destroys the records.",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Admin", "General"],
	execute(client, message, args) {
		const end                 = global.metrics.summaries.labels("admin_clean_db").startTimer();
		const {err: s_err, songs} = DAL.getAllSongs();

		if (s_err) {
			console.log("Failed to get songs");
		} else {
			songs.forEach(song => {
				if (!fs.existsSync(song.source)) {
					const {err: d_err} = DAL.deleteSongById(song.song_id);
					if (d_err) {
						console.log(`Failed to delete ${song.song_id}`);
						console.log(d_err);
					}
				}
			});
		}

		end();
	}
};
