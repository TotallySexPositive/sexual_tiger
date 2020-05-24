"use strict";
import validator            from "validator";
import {CustomNodeJsGlobal} from "./CustomNodeJsGlobal";
import {Playlist}           from "./Playlist";
import {PlaylistSong}       from "./PlaylistSong";

declare const global: CustomNodeJsGlobal;
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

	/**
	 * Get a song by one of its unique identifiers.
	 * @param identifier The song id, name, hash, or url
	 */
	static get(identifier: string): Promise<{ song: Song, err: Error }> {
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
				resolve({err: undefined, song: new Song(DB.prepare(query).get(identifier))});
			} catch (err) {
				console.log(`Song.get: ${identifier} \nError: `);
				console.log(err);
				reject({err: err, song: undefined});
			}
		});
	}

	/**
	 * Search for songs with a given name.
	 * @param name The name of the song to search for
	 * @param max_songs The max number of results to return. Default = 10
	 */
	static search(name: string, max_songs: number = 10): Promise<{ songs: Array<Song>, err: Error }> {
		return new Promise((resolve, reject) => {

			if (!name || name.trim() === "") {
				reject({err: new Error("search term must not be blank."), songs: undefined});
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
				const songs = DB.prepare(query).all(prepped_args).map(song => { new Song(song);});
				resolve({err: undefined, songs: songs});
			} catch (err) {
				console.log(`Song.search: ${name} \nError: `);
				console.log(err);
				reject({err: err, songs: undefined});
			}

		});
	}

	/**
	 * Get ALL the songs in the database
	 */
	static all(): Promise<{ songs: Array<Song>, err: Error }> {
		return new Promise((resolve, reject) => {
			const query = `SELECT * FROM ${Song.TABLE}`;

			try {
				const songs = DB.prepare(query).all().map(song => { new Song(song);});
				resolve({err: undefined, songs: songs});
			} catch (err) {
				console.log(`Song.all: \nError: `);
				console.log(err);
				reject({err: err, songs: undefined});
			}
		});
	}

	/**
	 * Saves the Song object to the database.
	 * If the object has an id, it updates the existing record
	 * If the object does not have id, it inserts it into the DB
	 */

	/*save() {
		if (Number.isInteger(Number(this.name)) || 0) {
			return {err: new Error("Song name must not be an integer."), info: undefined};
		}

		if (this.id) {
			this.update();
		} else {
			this.insert();
		}

	}*/

	/**
	 * Inserts the song into the database
	 */
	insert(): Promise<{ song: Song, err: Error }> {
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

				Song.get(info.lastInsertRowid).then(resp => {
					resolve({err: undefined, song: resp.song});
				});

			} catch (err) {
				console.log(`Song.insert: \nError: `);
				console.log(err);
				reject({err: err, song: undefined});
			}
		});
	}


	/**
	 * Update an existing database song record
	 */
	update(): Promise<{ song: Song, err: Error }> {
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

				Song.get(this.id).then(resp => {
					resolve({err: undefined, song: resp.song});
				});
			} catch (err) {
				console.log(`Song.update: \nError: `);
				console.log(err);
				reject({err: err, song: undefined});
			}
		});
	}

	/**
	 * Get a list of all playlists the song is on.
	 */
	playlists(): Promise<{ playlists: Array<Playlist>, err: Error }> {
		return new Promise((resolve, reject) => {
			const query = `SELECT DISTINCT ${Playlist.FIELDS} FROM ${Playlist.TABLE} JOIN ${PlaylistSong.TABLE} USING (playlist_id) WHERE song_id = ?`;

			try {
				const playlists = DB.prepare(query).all(this.id).map(playlist => { new Playlist(playlist);});
				resolve({err: undefined, playlists: playlists});
			} catch (err) {
				console.log(`Song.playlists:  \nError: `);
				console.log(err);
				reject({err: err, playlists: undefined});
			}
		});
	}
}