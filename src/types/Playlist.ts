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

	constructor(obj: any) {
		this.id         = obj.song_id;
		this.name       = obj.name;
		this.num_songs  = obj.num_songs;
		this.created_by = obj.created_by;
	}

	id: string;
	name: string;
	num_songs: number;
	created_by: string;


	static get(identifier: string): Promise<{ playlist: Playlist, err: Error }> {
		return new Promise((resolve, reject) => {
			let identifier_type: string;

			if (validator.isInt(identifier)) {
				identifier_type = "song_id";
			} else { //Welp, I guess its a playlist name
				identifier_type = "name";
			}

			const query = `SELECT * FROM ${Playlist.TABLE} WHERE ${identifier_type} = ?`;

			try {
				resolve({err: undefined, playlist: new Playlist(DB.prepare(query).get(identifier))});
			} catch (err) {
				console.log(`Playlist.get: ${identifier} \nError: `);
				console.log(err);
				reject({err: err, playlist: undefined});
			}
		});
	}

	static all(): Promise<{ playlists: Array<Playlist>, err: Error }> {
		return new Promise((resolve, reject) => {
			const query = `SELECT * FROM ${Playlist.TABLE}`;

			try {
				const playlists = DB.prepare(query).all().map(playlist => { new Playlist(playlist);});
				resolve({err: undefined, playlists: playlists});
			} catch (err) {
				console.log(`Playlist.all: \nError: `);
				console.log(err);
				reject({err: err, playlists: undefined});
			}
		});
	}


	/*save() {
		if (validator.isInt(this.id)) {
			return {err: new Error("Playlist name must not be an integer."), info: undefined};
		}

		if (this.id) {
			this.update();
		} else {
			this.insert();
		}
	}*/


	insert(): Promise<{ playlist: Playlist, err: Error }> {
		return new Promise((resolve, reject) => {
			const query = `INSERT INTO ${Playlist.TABLE} (name, created_by) VALUES (?, ?)`;

			try {
				const info = DB.prepare(query).run({
					name      : this.name,
					created_by: this.created_by
				});

				Playlist.get(info.lastInsertRowid).then(resp => {
					resolve({err: undefined, playlist: resp.playlist});
				});

			} catch (err) {
				console.log(`Playlist.insert: \nError: `);
				console.log(err);
				reject({err: err, playlist: undefined});
			}
		});
	}


	update(): Promise<{ playlist: Playlist, err: Error }> {
		return new Promise((resolve, reject) => {
			const query = `UPDATE ${Playlist.TABLE} SET name = :name WHERE playlist_id = :playlist_id;`;

			try {
				DB.prepare(query).run({
					name       : this.name,
					playlist_id: this.id
				});

				Playlist.get(this.id).then(resp => {
					resolve({err: undefined, playlist: resp.playlist});
				});
			} catch (err) {
				console.log(`Playlist.update: \nError: `);
				console.log(err);
				reject({err: err, playlist: undefined});
			}
		});
	}


	songs(): Promise<{ songs: Array<Song>, err: Error }> {
		return new Promise((resolve, reject) => {

			const query = `SELECT ${Song.FIELDS} FROM ${Song.TABLE} JOIN ${PlaylistSong.TABLE} USING (playlist_id) WHERE playlist_id = ?`;

			try {
				const songs = DB.prepare(query).all(this.id).map(song => { new Song(song);});
				resolve({err: undefined, songs: songs});
			} catch (err) {
				console.log(`Song.playlists:  \nError: `);
				console.log(err);
				reject({err: err, song: undefined});
			}

		});
	}
}