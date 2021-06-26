import { Playlist } from "./Playlist";
import { PlaylistSong } from "./PlaylistSong";
import { Song } from "./Song";

export interface ResultBase {
	result?: any;
	err?: Error;
}

export interface SongResult extends ResultBase {
	song?: Song;
}

export interface PlaylistResult extends ResultBase {
	playlist?: Playlist;
}

export interface PlaylistSongResult extends ResultBase {
	playlistSong?: PlaylistSong;
}

export type SongIdentifier = "song_id" | "hash_id" | "name" | "url" | undefined;
