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

}