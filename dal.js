let Database                = require('better-sqlite3')

const SONG_TABLE            = "song"
const PLAYLIST_TABLE        = "playlist"
const PLAYLIST_SONG_TABLE   = "playlist_song"

const SONG_FIELDS           = "song.song_id, song.name, song.hash_id, song.source"
const PLAYLIST_FIELDS       = "playlist.playlist_id, playlist.name, playlist.created_by "
const PLAYLIST_SONG_FIELDS  = "playlist_song.relation_id, playlist_song.playlist_id, playlist_song.song_id "


let DB = new Database('playlists.sql');

DB.pragma("foreign_keys = ON;");


function isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
  }

  /**
   * Find a Song by id.
   * 
   * @param {Integer} song_id - The id of the song to find
   * @param {Function} callback - The callback function (err, song) =>
   */
var findSongById = function (song_id) {
    if(!isInt(song_id)) {
        let err = new Error("song_id must be an integer.")
        return null;
    }
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE song_id = ?`;

    try {
        return DB.prepare(query).get(song_id);
    } catch (err) {
        console.log("findSongById Error: ")
        console.log(err);
        return null;
    }
}

/**
   * Find a Playlist by id.
   * 
   * @param {Integer} playlist_id - The id of the playlist to find
   * @param {Function} callback - The callback function (err, playlist) =>
   */
  var findPlaylistById = function (playlist_id, callback) {
    if(!isInt(song_id)){
        let err = new Error("playlist_id must be an integer.")
        return null;
    }
    let query = `SELECT ${PLAYLIST_FIELDS} FROM ${PLAYLIST_TABLE} WHERE playlist_id = ?`;
    
    try {
        return DB.prepare(query).get(playlist_id);
    } catch (err) {
        console.log("findPlaylistById Error: ")
        console.log(err);
        return null;
    }
}

  /**
   * Find a Playlist by Name.
   * 
   * @param {String} name - The name of the Playlist to find
   * @param {Function} callback - The callback function (err, playlist) =>
   */
var findPlaylistByName = function (name, callback) {
    let query = `SELECT ${PLAYLIST_FIELDS} FROM ${PLAYLIST_TABLE} WHERE name = ?`;
    try {
        return DB.prepare(query).get(name);
    } catch (err) {
        console.log("findPlaylistByName Error: ")
        console.log(err);
        return null;
    }
}

  /**
   * Get all Songs on a playlist by playlist_id.
   * 
   * @param {Integer} playlist_id - The id of the playlist to get songs from
   * @param {Function} callback - The callback function (err, songs) =>
   */
var getSongsByPlaylistId = function (playlist_id, callback) {
    getSongsByPlaylist("playlist_id", playlist_id, callback)
}

  /**
   * Get all Songs on a playlist by Playlist name.
   * 
   * @param {String} name - The name of the playlist to get songs from
   * @param {Function} callback - The callback function (err, songs) =>
   */
var getSongsByPlaylistName = function (name, callback) {
    getSongsByPlaylist("name", name, callback)
}

/**
 * PRIVATE FUNCTION, DO NOT EXPORT.
 * 
 * Get all songs on a playlist by id/name
 * @param {String} search_field - Which field to search on
 * @param {*} id - The value to search on
 * @param {*} callback - The callback function (err, songs)
 */
let getSongsByPlaylist = function (search_field, id, callback) {
    let query = `
        SELECT ${SONG_FIELDS} 
        FROM ${PLAYLIST_SONG_TABLE} 
        JOIN ${SONG_TABLE} USING (song_id)
        JOIN ${PLAYLIST_TABLE} USING (playlist_id)
        WHERE playlist.${search_field} = ?
    `;
   
    try {
        return DB.prepare(query).get( );
    } catch (err) {
        console.log(`getSongsByPlaylist: ${search_field} Error: `)
        console.log(err);
        return null;
    }
}

module.exports.findSongById = findSongById;
module.exports.findPlaylistById = findPlaylistById;
module.exports.findPlaylistByName = findPlaylistByName;
module.exports.getSongsByPlaylistId = getSongsByPlaylistId;
module.exports.getSongsByPlaylistName = getSongsByPlaylistName;