let Database                = require('better-sqlite3')
const path                  = require('path');

const UTIL                  = require(path.resolve("utils.js"))
const validator             = require('validator');

const SONG_TABLE            = "song"
const PLAYLIST_TABLE        = "playlist"
const PLAYLIST_SONG_TABLE   = "playlist_song"

const SONG_FIELDS           = "song.song_id, song.name, song.hash_id, song.source, song.num_plays, song.last_played, song.url, song.is_clip, song.duration, song.added_by "
const PLAYLIST_FIELDS       = "playlist.playlist_id, playlist.name, playlist.num_songs, playlist.created_by "
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

var findSongByHashId = function (hash_id) {
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE hash_id = ?`;

    try {
        return {err: undefined, song:DB.prepare(query).get(hash_id)};
    } catch (err) {
        console.log(`findSongByHashId song_id: ${hash_id} \nError: `)
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

let findSongByUrl = function(url) {
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE url = ?`;

    try {
        return {err: undefined, song:DB.prepare(query).get(url)};
    } catch (err) {
        console.log(`findSongByUrl url: ${url} \nError: `)
        console.log(err);
        return {err: err, song: undefined};
    }
}

let findSongByIdentifier = function(identifier, identifier_type = null) {
    let valid_identifiers = ["song_id", "hash_id", "name", "url"];

    if(identifier_type === null) { //Type not specified, lets figure it out

        if(isInt(identifier)) {
            return findSongById(identifier);
        } else if(validator.isMD5(identifier)) {
            return findSongByHashId(identifier);
        } else if(validator.isURL(identifier)) {
            return findSongByUrl(identifier);
        } else { //Welp, I guess its a song name
            return findSongByName(identifier);
        }
    } else {
        if(!valid_identifiers.includes(identifier_type)) { //Invalid identifier type sent
            let err = new Error(`Invalid identifier_type passed. Valid types: ${valid_identifiers.join(", ")}.`);
            return { err: err, song: undefined }
        } else { //Valid identifier type sent, just run the query
            switch(identifier_type) {
                case "song_id"  : return findSongById(identifier);
                case "hash_id"  : return findSongByHashId(identifier);
                case "name"     : return findSongByName(identifier);
                case "url"      : return findSongByUrl(identifier);
            }
        }
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
        return {err: undefined, playlist: DB.prepare(query).get(playlist_id)};
    } catch (err) {
        console.log(`findPlaylistById playlist_id: ${playlist_id} \nError: `)
        console.log(err);
        return {err: err, playlist: undefined};
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

let findPlaylistByIdentifier = function(identifier, identifier_type = null) {
    let valid_identifiers = ["playlist_id", "name"];

    if(identifier_type === null) { //Type not specified, lets figure it out
        if(isInt(identifier)) {
            return findPlaylistById(identifier);
        } else { //Welp, I guess its a song name
            return findPlaylistByName(identifier);
        }
    } else {
        if(!valid_identifiers.includes(identifier_type)) { //Invalid identifier type sent
            let err = new Error(`Invalid identifier_type passed. Valid types: ${valid_identifiers.join(", ")}.`);
            return { err: err, playlist: undefined }
        } else { //Valid identifier type sent, just run the query
            switch(identifier_type) {
                case "playlist_id"  : return findPlaylistById(identifier);
                case "name"         : return findPlaylistByName(identifier);
            }
        }
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
        return {err: undefined, songs: DB.prepare(query).all(id)};
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
 * @param {Integer} playlist_id - The id of the playlist to add the song to
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

/**
 * Removes a Song from a Playlist.  If the song appears on the playlist more than once, the last one added is removed.
 * @param {Integer} playlist_id - The id of the playlist to remove the song from
 * @param {Integer} song_id - The id of the song to remove from the playlist
 */
let removeFromPlaylist = function(playlist_id, song_id) {
    if(!isInt(playlist_id) || !isInt(song_id)) {
        let err = new Error("playlist_id and song_id must be integers.");
        return {err: err, info: undefined};
    }

    //This crazy query makes it so if the song is on the list multiple times, it only removes the last instance.
    let query = `
        DELETE FROM playlist_song 
        WHERE relation_id IN (
            SELECT relation_id 
            FROM playlist_song 
            WHERE playlist_id = ? AND song_id = ? 
            ORDER BY relation_id DESC
            LIMIT 1
        )`

    try {
        return {err: undefined, info: DB.prepare(query).run(playlist_id, song_id)}
    } catch(err) {
        console.log(`removeFromPlaylist: playlist_id: ${playlist_id} song_id: ${song_id} \nError: `);
        console.log(err);
        return {err: err, info: undefined};
    }
}

/**
 * Returns all playlists in the DB.  Hopefully we dont add too many.
 */
let getPlaylists = function() {
    let query = `SELECT ${PLAYLIST_FIELDS} FROM ${PLAYLIST_TABLE}`;
   
    try {
        return {err: undefined, playlists: DB.prepare(query).all()};
    } catch (err) {
        console.log(`getPlaylists: \nError: `)
        console.log(err);
        return {err: err, playlists: undefined};
    }
}


let searchForSongs = function(name, max_songs = 10) {

    if(name.trim() === "") {
        let err = new Error("search term must not be blank.");
        return {err: err, songs: undefined};
    }

    let clauses = [];
    let prepped_args = [];
    let args = name.split(" ").filter((word) => { return word.trim() !== ""});

    args.forEach((arg) => {
        clauses.push("name LIKE ?");
        prepped_args.push(`%${arg}%`);
    })
    let prepped_statement = clauses.join(" AND ")

    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE ${prepped_statement} LIMIT ${max_songs}`;
   
    try {
        return {err: undefined, songs: DB.prepare(query).all(prepped_args)};
    } catch (err) {
        console.log(`searchForSongs: \nError: `)
        console.log(err);
        return {err: err, songs: undefined};
    }
}

let getAllSongs = function() {
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE}`

    try {
        return {err: undefined, songs: DB.prepare(query).all()};
    } catch (err) {
        console.log(`getAllSongs: \nError: `)
        console.log(err);
        return {err: err, songs: undefined};
    }
}

let insertIntoSongs = function(hash_id, name, source, url = null, user_id) {
    if(isInt(name)) {
        let err = new Error("song name must not be an integer.");
        return {err: err, info: undefined};
    }
    let query = "INSERT INTO song (hash_id, name, source, url, added_by) VALUES (?, ?, ?, ?, ?)"
    try {
        return {err: undefined, info: DB.prepare(query).run(hash_id, name, source, url, user_id)};
    } catch (err) {
        console.log(`insertIntoSongs: \nError: `)
        console.log(err);
        return {err: err, info: undefined};
    }
}

let getPlaylistsWithSong = function(identifier) {
    let {err: s_err, song} = findSongByIdentifier(identifier);
    if(s_err) {
        console.log(s_err);
        return {err: s_err, playlists: undefined}
    } else if (song === undefined) {
        return {err: new Error("There is no song by that identifier"), playlists: undefined}
    } else {
        let query = `SELECT DISTINCT ${PLAYLIST_FIELDS} FROM ${PLAYLIST_TABLE} JOIN ${PLAYLIST_SONG_TABLE} USING (playlist_id) WHERE song_id = ?`

        try {
            return {err: undefined, playlists: DB.prepare(query).all(song.song_id)};
        } catch (err) {
            return {err: err, playlists: undefined};
        }
    }
}
let deleteSongById = function(song_id) {
    if(!isInt(song_id)) {
        let err = new Error("song_id must be an integer.");
        return {err: err, info: undefined};
    }
    let query = "DELETE FROM song WHERE song_id = ?"
    try {
        return {err: undefined, info: DB.prepare(query).run(song_id)};
    } catch (err) {
        if(err.message.includes("FOREIGN KEY")) {
            return {err: err, info: undefined};
        } else {
            console.log(`deleteSongById: \nError: `)
            console.log(err);
            return {err: err, info: undefined};
        }
    }
}

let incrementNumPlays = function(song_id) {
    if(!isInt(song_id)) {
        let err = new Error("song_id must be an integer.");
        return {err: err, info: undefined};
    }
    //Update num plays and set last_played to current unix timestamp
    let query = `UPDATE ${SONG_TABLE} SET num_plays = num_plays + 1, last_played = strftime('%s','now') WHERE song_id = ?`
    try {
        return {err: undefined, info: DB.prepare(query).run(song_id)};
    } catch (err) {
        console.log(`incrementNumPlays: \nError: `)
        console.log(err);
        return {err: err, info: undefined};
    }
}

let updateSong = function(song) {
    let query = `UPDATE song SET name = :name, is_clip = :is_clip, duration = :duration WHERE song_id = :song_id;`

    try {
        return {err: undefined, info: DB.prepare(query).run({name: song.name, is_clip: song.is_clip, duration: song.duration, song_id: song.song_id})};
    } catch (err) {
        console.log(`updateSongById: \nError: `)
        console.log(err);
        return {err: err, info: undefined};
    }
}


module.exports.isInt = isInt;

module.exports.findSongByIdentifier = findSongByIdentifier;
module.exports.findSongById = findSongById;
module.exports.findSongByName = findSongByName;
module.exports.findPlaylistById = findPlaylistById;
module.exports.findPlaylistByName = findPlaylistByName;
module.exports.findPlaylistByIdentifier = findPlaylistByIdentifier;
module.exports.getSongsByPlaylistId = getSongsByPlaylistId;
module.exports.getSongsByPlaylistName = getSongsByPlaylistName;
module.exports.createPlaylist = createPlaylist;
module.exports.deletePlaylistById = deletePlaylistById;
module.exports.addToPlaylist = addToPlaylist;
module.exports.removeFromPlaylist = removeFromPlaylist;
module.exports.getPlaylists = getPlaylists;
module.exports.searchForSongs = searchForSongs;
module.exports.insertIntoSongs = insertIntoSongs;
module.exports.findSongByHashId = findSongByHashId;
module.exports.findSongByUrl = findSongByUrl;
module.exports.incrementNumPlays = incrementNumPlays;
module.exports.updateSong = updateSong;
module.exports.getAllSongs = getAllSongs;
module.exports.deleteSongById = deleteSongById;
module.exports.getPlaylistsWithSong = getPlaylistsWithSong;

