let Database                = require('better-sqlite3')

const SONG_TABLE            = "song"
const PLAYLIST_TABLE        = "playlist"
const PLAYLIST_SONG_TABLE   = "playlist_song"

const SONG_FIELDS           = "song.song_id, song.name, song.hash_id, song.source"
const PLAYLIST_FIELDS       = "playlist.playlist_id, playlist.name, playlist.created_by "
const PLAYLIST_SONG_FIELDS  = "playlist_song.relation_id, playlist_song.playlist_id, playlist_song.song_id "


let DB = new Database('playlists.sql');

DB.pragma("foreign_keys = ON;");


let isInt = function(value) {
    var er = /^-?[0-9]+$/;
    return er.test(value);
}

  /**
   * Find a Song by id.
   * 
   * @param {Integer} song_id - The id of the song to find
   */
var findSongById = function (song_id) {
    if(!isInt(song_id)) {
        let err = new Error("song_id must be an integer.")
        return {err: err, song: undefined};
    }
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE song_id = ?`;

    try {
        return {err: undefined, song:DB.prepare(query).get(song_id)};
    } catch (err) {
        console.log(`findSongById song_id: ${song_id} \nError: `)
        console.log(err);
        return {err: err, song: undefined};
    }
}

var findSongByName = function (name) {
    if(isInt(name)) {
        let err = new Error("name must NOT be an integer.")
        return {err: err, song: undefined};
    }
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE name = ?`;

    try {
        return {err: undefined, song:DB.prepare(query).get(name)};
    } catch (err) {
        console.log(`findSongById name: ${name} \nError: `)
        console.log(err);
        return {err: err, song: undefined};
    }
}

/**
   * Find a Playlist by id.
   * 
   * @param {Integer} playlist_id - The id of the playlist to find
   */
  var findPlaylistById = function (playlist_id) {
    if(!isInt(playlist_id)){
        let err = new Error("playlist_id must be an integer.")
        return null;
    }
    let query = `SELECT ${PLAYLIST_FIELDS} FROM ${PLAYLIST_TABLE} WHERE playlist_id = ?`;
    
    try {
        return DB.prepare(query).get(playlist_id);
    } catch (err) {
        console.log(`findPlaylistById playlist_id: ${playlist_id} \nError: `)
        console.log(err);
        return null;
    }
}

  /**
   * Find a Playlist by Name.
   * 
   * @param {String} name - The name of the Playlist to find
   */
var findPlaylistByName = function (name) {
    let query = `SELECT ${PLAYLIST_FIELDS} FROM ${PLAYLIST_TABLE} WHERE name = ?`;
    try {
        return {err: undefined, playlist: DB.prepare(query).get(name)};
    } catch (err) {
        console.log(`findPlaylistByName name: ${name}\nError: `)
        console.log(err);
        return {err: err, playlist: undefined};
    }
}

  /**
   * Get all Songs on a playlist by playlist_id.
   * 
   * @param {Integer} playlist_id - The id of the playlist to get songs from
   */
var getSongsByPlaylistId = function (playlist_id) {
    if(!isInt(playlist_id)) {
        let err = new Error("playlist_id must be an integer.")
        return {err: err, songs: undefined};
    }
    return getSongsByPlaylist("playlist_id", playlist_id)
}

  /**
   * Get all Songs on a playlist by Playlist name.
   * 
   * @param {String} name - The name of the playlist to get songs from
   */
var getSongsByPlaylistName = function (name) {
    if(isInt(name)) {
        let err = new Error("name must not be an integer.")
        return {err: err, songs: undefined};
    }
    return getSongsByPlaylist("name", name)
}

/**
 * PRIVATE FUNCTION, DO NOT EXPORT.
 * 
 * Get all songs on a playlist by id/name
 * @param {String} search_field - Which field to search on
 * @param {*} id - The value to search on
 */
let getSongsByPlaylist = function (search_field, id) {
    let query = `
        SELECT ${SONG_FIELDS} 
        FROM ${PLAYLIST_SONG_TABLE} 
        JOIN ${SONG_TABLE} USING (song_id)
        JOIN ${PLAYLIST_TABLE} USING (playlist_id)
        WHERE playlist.${search_field} = ?
    `;
   
    try {
        return {err: undefined, songs: DB.prepare(query).get(id)};
    } catch (err) {
        console.log(`getSongsByPlaylist: search_field: ${search_field} id: ${id} \nError: `)
        console.log(err);
        return {err: err, songs: undefined};
    }
}

/**
 * Adds a new Playlist to the table.
 * @param {String} name - The name to use for the play list
 * @param {Integer} user_id - The user id of the person creating the play list.
 */
let createPlaylist = function(name, user_id) {
    let query = `INSERT INTO ${PLAYLIST_TABLE} (name, created_by) VALUES (?, ?)`
    try {
        return {err: undefined, info: DB.prepare(query).run(name, user_id)};
    } catch (err) {
        if(err.message.indexOf("UNIQUE") == -1) {
            console.log(`createPlaylist: name: ${name}  user_id: ${user_id} \nError: `)
            console.log(err);
        }
        return {err: err, info: undefined};
    }
}

/**
 * Deletes a Playlist from the table, and deletes all references
 * @param {String} name - The name to use for the play list
 */
let deletePlaylistById = function(playlist_id) {
    let query = `DELETE FROM ${PLAYLIST_TABLE} WHERE playlist_id = ?`
    try {
        return {err: undefined, info: DB.prepare(query).run(playlist_id)};
    } catch (err) {
        console.log(`deletePlaylist: playlist_id: ${playlist_id} \nError: `);
        console.log(err);
        return {err: err, info: undefined};
    }
}

/**
 * Adds a Song to a Playlist
 * @param {Integer} playlist_id - The id of the play to add the song to
 * @param {Integer} song_id - The id of the song to add to the playlist
 */
let addToPlaylist = function(playlist_id, song_id) {
    if(!isInt(playlist_id) || !isInt(song_id)) {
        let err = new Error("playlist_id and song_id must be integers.");
        return {err: err, info: undefined};
    }
    let query = "INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)";
    try {
        return {err: undefined, info: DB.prepare("INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)").run(playlist_id, song_id)}
    } catch(err) {
        console.log(`addToPlaylist: playlist_id: ${playlist_id} song_id: ${song_id} \nError: `);
        console.log(err);
        return {err: err, info: undefined};
    }
}





module.exports.isInt = isInt;

module.exports.findSongById = findSongById;
module.exports.findSongByName = findSongByName;
module.exports.findPlaylistById = findPlaylistById;
module.exports.findPlaylistByName = findPlaylistByName;
module.exports.getSongsByPlaylistId = getSongsByPlaylistId;
module.exports.getSongsByPlaylistName = getSongsByPlaylistName;
module.exports.createPlaylist = createPlaylist;
module.exports.deletePlaylistById = deletePlaylistById;
module.exports.addToPlaylist = addToPlaylist;
