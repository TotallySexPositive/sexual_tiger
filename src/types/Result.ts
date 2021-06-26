import { Playlist } from "./Playlist";
import { PlaylistSong } from "./PlaylistSong";
import { Song } from "./Song";

export interface ResultBase {
	result?: any;
	err?: Error;
}

export interface SongResult extends ResultBase {
	result: Song;
}

export interface PlaylistResult extends ResultBase {
	result: Playlist;
}

export interface PlaylistSongResult extends ResultBase {
	result: PlaylistSong;
}
