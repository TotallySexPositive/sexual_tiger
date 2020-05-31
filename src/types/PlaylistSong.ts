"use strict";
import {CustomNodeJsGlobal} from "./CustomNodeJsGlobal";

declare const global: CustomNodeJsGlobal;
const Database = require("better-sqlite3");
const DB       = new Database("playlists.sql");

DB.pragma("foreign_keys = ON;");
DB.pragma("journal_mode = WAL");

export class PlaylistSong {
	static FIELDS: string = "playlist_song.relation_id, playlist_song.playlist_id, playlist_song.song_id ";
	static TABLE: string  = "playlist_song";

	id: string;
	playlist_id: string;
	song_id: string;

	constructor(obj: any) {
		this.id          = obj.relation_id;
		this.playlist_id = obj.playlist_id;
		this.song_id     = obj.song_id;
	}

	/**
	 * Get a PlaylistSong relationship by id
	 * @param identifier
	 */
	static get(identifier: string): Promise<PlaylistSong> {
		return new Promise((resolve, reject) => {
			const query = `SELECT * FROM ${PlaylistSong.TABLE} WHERE relation_id = ?`;

			try {
				const pls_obj = DB.prepare(query).get(identifier);
				const pls     = pls_obj ? new PlaylistSong(pls_obj) : undefined;

				resolve(pls);
			} catch (err) {
				console.log(`PlaylistSong.get: ${identifier} \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}

	save(): Promise<PlaylistSong> {
		return new Promise((resolve, reject) => {
			if (!this.id) {
				this.insert().then(playlist => resolve(playlist)).catch(err => reject(err));
			} else {
				reject(new Error("Updating PlaylistSong relations is not allowed."));
			}
		});
	}

	/**
	 * Inserts a new playlist record into the database
	 */
	insert(): Promise<PlaylistSong> {
		return new Promise((resolve, reject) => {
			const query = `INSERT INTO ${PlaylistSong.TABLE} (playlist_id, song_id) VALUES (:playlist_id, :song_id)`;

			try {
				const info = DB.prepare(query).run({
					playlist_id: this.playlist_id,
					song_id    : this.song_id
				});

				PlaylistSong.get(info.lastInsertRowid).then(pls => {
					resolve(pls);
				});

			} catch (err) {
				console.log(`PlaylistSong.insert: \nError: `);
				console.log(err);
				reject(err);
			}
		});
	}


}