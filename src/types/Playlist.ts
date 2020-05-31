"use strict";
import validator            from "validator";
import {CustomNodeJsGlobal} from "./CustomNodeJsGlobal";
import {Song}               from "./Song";
import {PlaylistSong}       from "./PlaylistSong";

declare const global: CustomNodeJsGlobal;
const Database = require("better-sqlite3");
const DB       = new Database("playlists.sql");

DB.pragma("foreign_keys = ON;");
DB.pragma("journal_mode = WAL");

export class Playlist {
	static FIELDS: string = "playlist.playlist_id, playlist.name, playlist.num_songs, playlist.created_by ";
	static TABLE: string  = "playlist";

	id: string;
	name: string;
	num_songs: number;
	created_by: string;

	constructor(obj: any) {
		this.id         = obj.song_id;
		this.name       = obj.name;
		this.num_songs  = obj.num_songs;
		this.created_by = obj.created_by;
	}

	/**
	 * Get a playlist by identifier
	 * @param identifier Playlist ID or name
	 */
	static get(identifier: string): Promise<Playlist> {
		return new Promise((resolve, reject) => {
			let identifier_type: string;

			if (validator.isInt(identifier)) {
				identifier_type = "song_id";
			} else { //Welp, I guess its a playlist name
				identifier_type = "name";
			}


			const query = `SELECT * FROM ${Playlist.TABLE} WHERE ${identifier_type} = ?`;

			try {
				const playlist_obj = DB.prepare(query).get(identifier);
				const playlist     = playlist_obj ? new Playlist(playlist_obj) : undefined;
				resolve(playlist);
			} catch (err) {
				console.log(`Playlist.get: ${identifier} \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Get all playlists
	 */
	static all(): Promise<Array<Playlist>> {
		return new Promise((resolve, reject) => {
			const query = `SELECT * FROM ${Playlist.TABLE}`;

			try {
				let playlists = DB.prepare(query).all().map(playlist => { return new Playlist(playlist);});
				playlists     = playlists.length ? playlists : undefined;

				resolve(playlists);
			} catch (err) {
				console.log(`Playlist.all: \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Saves a playlist object.  Updates existing record or creates a new one if new.
	 */
	save(): Promise<Playlist> {
		return new Promise((resolve, reject) => {
			if (Number.isInteger(Number(this.name)) || 0) {
				reject(new Error("Playlist name must not be an integer."));
			}

			if (this.id) {
				this.update().then(playlist => resolve(playlist)).catch(err => reject(err));
			} else {
				this.insert().then(playlist => resolve(playlist)).catch(err => reject(err));
			}
		});
	}

	/**
	 * Inserts a new playlist record into the database
	 */
	insert(): Promise<Playlist> {
		return new Promise((resolve, reject) => {
			const query = `INSERT INTO ${Playlist.TABLE} (name, created_by) VALUES (?, ?)`;

			try {
				const info = DB.prepare(query).run({
					name      : this.name,
					created_by: this.created_by
				});

				Playlist.get(info.lastInsertRowid).then(playlist => {
					resolve(playlist);
				});

			} catch (err) {
				console.log(`Playlist.insert: \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Updates an existing playlist record in the database
	 */
	update(): Promise<Playlist> {
		return new Promise((resolve, reject) => {
			const query = `UPDATE ${Playlist.TABLE} SET name = :name WHERE playlist_id = :playlist_id;`;

			try {
				DB.prepare(query).run({
					name       : this.name,
					playlist_id: this.id
				});

				Playlist.get(this.id).then(playlist => {
					resolve(playlist);
				});
			} catch (err) {
				console.log(`Playlist.update: \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	/**
	 * Get a list of all songs on this playlist.
	 */
	songs(): Promise<Array<Song>> {
		return new Promise((resolve, reject) => {
			const query = `SELECT ${Song.FIELDS} FROM ${Song.TABLE} JOIN ${PlaylistSong.TABLE} USING (playlist_id) WHERE playlist_id = ?`;

			try {
				let songs = DB.prepare(query).all(this.id).map(song => { new Song(song);});
				songs     = songs.length ? songs : undefined;

				resolve(songs);
			} catch (err) {
				console.log(`Song.playlists:  \nError: `);
				console.log(err);
				reject(err);
			}

		});
	}

	/**
	 * Adds songs to a playlist.
	 * @param t_songs The song/songs to add to the playlist.
	 */
	add(t_songs: Song | Array<Song>): Promise<Array<Song>> {
		return new Promise((resolve, reject) => {
			const songs: Array<Song>                     = t_songs instanceof Song ? [t_songs] : t_songs;
			const added_songs: Array<Song>               = [];
			const promises: Array<Promise<PlaylistSong>> = [];

			try {
				songs.forEach((song) => {
					const ps = new PlaylistSong({playlist_id: this.id, song_id: song.id});
					promises.push(ps.save());
				});
				const song_map = new Map(songs.map(song => [song.id, song]));

				Promise.all(promises).then(plss => {
					plss.forEach(pls => {
						if (pls) {
							added_songs.push(song_map[pls.song_id]);
						}
					});
					resolve(added_songs);
				}).catch(err => {
					console.log(err);
					reject(err);
				});
			} catch (err) {
				console.log(`Playlist.add:  \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}
}