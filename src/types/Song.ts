"use strict";
import validator from "validator";

const Database = require("better-sqlite3");
const DB       = new Database("playlists.sql");

DB.pragma("foreign_keys = ON;");
DB.pragma("journal_mode = WAL");

export class Song {
	static FIELDS: string = "song.song_id, song.name, song.hash_id, song.source, song.num_plays, song.last_played, song.url, song.is_clip, song.duration, song.added_by ";
	static TABLE: string  = "song";

	constructor(obj: any) {
		this.id          = obj.song_id;
		this.name        = obj.name;
		this.hash_id     = obj.hash_id;
		this.source      = obj.source;
		this.num_plays   = obj.num_plays;
		this.last_played = obj.last_played;
		this.url         = obj.url;
		this.is_clip     = obj.is_clip;
		this.duration    = obj.duration;
		this.added_by    = obj.added_by;
	}

	id: string;
	name: string;
	hash_id: string;
	source: string;
	num_plays: number;
	last_played: string;
	url: string;
	is_clip: number;
	duration: number;
	added_by: string;

	static get(identifier): Promise<{ song: Song, err: Error }> {
		return new Promise((resolve, reject) => {
			let identifier_type = "";

			if (validator.isInt(identifier)) {
				identifier_type = "song_id";
			} else if (validator.isMD5(identifier)) {
				identifier_type = "hash_id";
			} else if (validator.isURL(identifier)) {
				identifier_type = "url";
			} else { //Welp, I guess its a song name
				identifier_type = "name";
			}

			const query = `SELECT * FROM ${Song.TABLE} WHERE ${identifier_type} = ?`;

			try {
				resolve({err: null, song: new Song(DB.prepare(query).get(identifier))});
			} catch (err) {
				console.log(`Song.get: ${identifier} \nError: `);
				console.log(err);
				reject({err: err, song: undefined}) ;
			}
		});
	}

	save() {
		if (Number.isInteger(Number(this.name)) || 0) {
			const err = new Error("Song name must not be an integer.");
			return {err: err, info: undefined};
		}

		if (this.id) {
			this.update();
		} else {
			this.insert();
		}

	}

	insert() {
		//song.song_id, song.name, song.hash_id, song.source, song.num_plays, song.last_played, song.url, song.is_clip, song.duration, song.added_by
		const query = "INSERT INTO song (name, hash_id, source, url, is_clip, duration, added_by) VALUES (:name, :hash_id, :source, :url, :is_clip, :duration, :added_by)";

		try {
			return {
				err : undefined,
				info: DB.prepare(query)
						.run({
							name    : this.name,
							hash_id : this.hash_id,
							source  : this.source,
							url     : this.url,
							is_clip : this.is_clip,
							duration: this.duration,
							added_by: this.added_by
						})
			};
		} catch (err) {
			console.log(`Song.insert: \nError: `);
			console.log(err);
			return {err: err, info: undefined};
		}
	}

	update() {
		const query = `UPDATE song SET name = :name, is_clip = :is_clip, duration = :duration WHERE song_id = :song_id;`;
		//this.is_clip = this.duration <= global.clip_length

		try {
			return {
				err : undefined,
				info: DB.prepare(query)
						.run({
							name    : this.name,
							is_clip : this.is_clip,
							duration: this.duration,
							song_id : this.id
						})
			};
		} catch (err) {
			console.log(`Song.update: \nError: `);
			console.log(err);
			return {err: err, info: undefined};
		}
	}
}