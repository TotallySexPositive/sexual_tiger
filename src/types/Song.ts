"use strict";
import {CustomNodeJsGlobal} from "./CustomNodeJsGlobal";
import {Playlist}           from "./Playlist";
import {PlaylistSong}       from "./PlaylistSong";
import validator            from "validator";
import * as Database        from "better-sqlite3";
import * as path            from "path";
import * as fs              from "fs";

declare const global: CustomNodeJsGlobal;
const DB = new Database("playlists.sql");

DB.pragma("foreign_keys = ON;");
DB.pragma("journal_mode = WAL");

export class Song {
	static FIELDS: string = "song.song_id, song.name, song.hash_id, song.source, song.num_plays, song.last_played, song.url, song.is_clip, song.duration, song.added_by ";
	static TABLE: string  = "song";

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

	constructor(obj: any) {

		const errors = [];

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

		if (errors.length) {
			throw new Error(errors.join("\n"));
		}
	}


	/**
	 * Get a song by one of its unique identifiers.
	 * @param identifier The song id, name, hash, or url
	 */
	static get(identifier: string): Promise<Song> {
		return new Promise((resolve, reject) => {
			let identifier_type: string;

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
				const song_obj = DB.prepare(query).get(identifier);
				const song     = song_obj ? new Song(song_obj) : undefined;
				resolve(song);
			} catch (err) {
				console.log(`Song.get: ${identifier} \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Search for songs with a given name.
	 * @param name The name of the song to search for
	 * @param max_songs The max number of results to return. Default = 10
	 */
	static search(name: string, max_songs: number = 10): Promise<Array<Song>> {
		return new Promise((resolve, reject) => {
			if (!name || name.trim() === "") {
				reject(new Error("search term must not be blank."));
			}
			if (!max_songs || max_songs <= 0) {
				reject(new Error("max_songs must be a positive number."));
			}

			const clauses      = [];
			const prepped_args = [];
			const args         = name.replace(/ +/, " ").split(" ").filter((word) => { return word.trim() !== ""; });

			args.forEach((arg) => {
				clauses.push("name LIKE ?");
				prepped_args.push(`%${arg}%`);
			});
			const prepped_statement = clauses.join(" AND ");

			const query = `SELECT * FROM ${Song.TABLE} WHERE ${prepped_statement} LIMIT ${max_songs}`;

			try {
				let songs: Array<Song> = DB.prepare(query).all(prepped_args).map(song => { return new Song(song);});
				songs                  = songs.length ? songs : undefined;
				resolve(songs);
			} catch (err) {
				console.log(`Song.search: ${name} \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Get ALL the songs in the database
	 */
	static all(): Promise<Array<Song>> {
		return new Promise((resolve, reject) => {
			const query = `SELECT * FROM ${Song.TABLE}`;

			try {
				let songs = DB.prepare(query).all().map(song => { return new Song(song);});
				songs     = songs.length ? songs : undefined;
				resolve(songs);
			} catch (err) {
				console.log(`Song.all: \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Saves the Song object to the database.
	 * If the object has an id, it updates the existing record
	 * If the object does not have id, it inserts it into the DB
	 */
	save(): Promise<Song> {
		return new Promise((resolve, reject) => {
			if (Number.isInteger(Number(this.name)) || 0) {
				reject(new Error("Song name must not be an integer."));
			}

			if (this.id) {
				console.log("Updating");
				this.update().then(song => resolve(song)).catch(err => reject(err));
			} else {
				this.insert().then(song => resolve(song)).catch(err => reject(err));
			}
		});
	}

	/**
	 * Inserts the song into the database
	 */
	insert(): Promise<Song> {
		return new Promise((resolve, reject) => {
			const query = "INSERT INTO song (name, hash_id, source, url, is_clip, duration, added_by) VALUES (:name, :hash_id, :source, :url, :is_clip, :duration, :added_by)";

			try {
				const info = DB.prepare(query).run({
					name    : this.name,
					hash_id : this.hash_id,
					source  : this.source,
					url     : this.url,
					is_clip : this.is_clip,
					duration: this.duration,
					added_by: this.added_by
				});

				Song.get("" + info.lastInsertRowid).then(song => {
					resolve(song);
				}).catch(err => {
					const error = new Error("Failed to get song after Insert.\n" + err);
					reject(error);
				});

			} catch (err) {
				console.log(`Song.insert: \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Update an existing database song record
	 */
	update(): Promise<Song> {
		return new Promise((resolve, reject) => {
			const query  = `UPDATE song SET name = :name, is_clip = :is_clip, duration = :duration WHERE song_id = :song_id;`;
			this.is_clip = Number(this.duration <= global.clip_length);

			try {
				DB.prepare(query).run({
					name    : this.name,
					is_clip : this.is_clip,
					duration: this.duration,
					song_id : this.id
				});

				Song.get(this.id).then((song) => {
					resolve(song);
				}).catch(err => {
					const error = new Error("Failed to get song after Update.\n" + err);
					reject(error);
				});
			} catch (err) {
				console.log(`Song.update: \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Delete the song from the database. Also removes the file from both the Hash and Source folders.
	 */
	delete(): Promise<Song> {
		return new Promise((resolve, reject) => {
			const query = `DELETE FROM ${Song.TABLE} WHERE song_id = :song_id;`;
			this.playlists().then(playlists => {
				if (playlists) {
					const playlist_names: string = (playlists.map(playlist => playlist.name)).join(", ");
					reject(new Error(`You can not delete a song that is on a playlist.  This song is on the following ${playlists.length} playlist(s), ${playlist_names}.`));
				} else { //Delete the song.
					const info = DB.prepare(query).run({
						song_id: this.id
					});

					if (info.changes) {
						//Delete the hashed file.
						const hashed_file = path.resolve(global.audio_dirs["hashed"], this.hash_id + ".mp3");
						fs.unlink(hashed_file, function (err) {
							if (err) {
								console.log(`Failed to delete requested hashed file. File: ${hashed_file}`);
								console.log(err);
							}
						});
						//Delete the source file.
						const source_file = this.source;
						fs.unlink(source_file, function (err) {
							if (err) {
								console.log(`Failed to delete requested stored file. File: ${source_file}`);
								console.log(err);
							}
						});
						resolve(this);
					} else {
						resolve(undefined);
					}
				}
			}).catch(err => {
				console.log(`Song.delete: \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Get a list of all playlists the song is on.
	 */
	playlists(): Promise<Array<Playlist>> {
		return new Promise((resolve, reject) => {
			const query = `SELECT DISTINCT ${Playlist.FIELDS} FROM ${Playlist.TABLE} JOIN ${PlaylistSong.TABLE} USING (playlist_id) WHERE song_id = ?`;

			try {
				const playlists = DB.prepare(query).all(this.id).map(playlist => { return new Playlist(playlist);});
				resolve(playlists);
			} catch (err) {
				console.log(`Song.playlists:  \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

}
