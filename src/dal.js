let Database = require('better-sqlite3')
const path = require('path');

const validator = require('validator');

const SONG_TABLE = "song"
const PLAYLIST_TABLE = "playlist"
const PLAYLIST_SONG_TABLE = "playlist_song"
const IMAGE_TABLE = "image"
const TAG_TABLE = "tag"
const IMAGE_TAG_TABLE = "image_tag"
const ACCESS_TABLE = "access"
const COMMAND_TABLE = "command"
const MEMBER_TABLE = "member"

const SONG_FIELDS = "song.song_id, song.name, song.hash_id, song.source, song.num_plays, song.last_played, song.url, song.is_clip, song.duration, song.added_by "
const PLAYLIST_FIELDS = "playlist.playlist_id, playlist.name, playlist.num_songs, playlist.created_by "
const PLAYLIST_SONG_FIELDS = "playlist_song.relation_id, playlist_song.playlist_id, playlist_song.song_id "
const IMAGE_FIELDS = "image.image_id, image.hash_id, image.extension, image.added_by "
const TAG_FIELDS = "tag.tag_id, tag.name "
const IMAGE_TAG_FIELDS = "image_tag.image_tag_id, image_tag.tag_id, image_tag.image_id "
const ACCESS_FIELDS = "access.user_id, access.command, access.is_allowed, access.set_by, access.added_at "
const COMMAND_FIELDS = "command.command, command.default_access "
const MEMBER_FIELDS = "member.user_id, member.username, member.added_at "

let DB = new Database('playlists.sql');

DB.pragma("foreign_keys = ON;");
DB.pragma('journal_mode = WAL');

let isInt = function (value) {
    var er = /^-?[0-9]+$/;
    return er.test(value);
}

/**
 * Find a Song by id.
 * 
 * @param {Integer} song_id - The id of the song to find
 */
var findSongById = function (song_id) {
    if (!isInt(song_id)) {
        let err = new Error("song_id must be an integer.")
        return { err: err, song: undefined };
    }
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE song_id = ?`;

    try {
        return { err: undefined, song: DB.prepare(query).get(song_id) };
    } catch (err) {
        console.log(`findSongById song_id: ${song_id} \nError: `)
        console.log(err);
        return { err: err, song: undefined };
    }
}

var findSongByHashId = function (hash_id) {
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE hash_id = ?`;

    try {
        return { err: undefined, song: DB.prepare(query).get(hash_id) };
    } catch (err) {
        console.log(`findSongByHashId song_id: ${hash_id} \nError: `)
        console.log(err);
        return { err: err, song: undefined };
    }
}

var findSongByName = function (name) {
    if (isInt(name)) {
        let err = new Error("name must NOT be an integer.")
        return { err: err, song: undefined };
    }
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE name = ?`;

    try {
        return { err: undefined, song: DB.prepare(query).get(name) };
    } catch (err) {
        console.log(`findSongById name: ${name} \nError: `)
        console.log(err);
        return { err: err, song: undefined };
    }
}

let findSongByUrl = function (url) {
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE url = ?`;

    try {
        return { err: undefined, song: DB.prepare(query).get(url) };
    } catch (err) {
        console.log(`findSongByUrl url: ${url} \nError: `)
        console.log(err);
        return { err: err, song: undefined };
    }
}

let findSongByIdentifier = function (identifier, identifier_type = null) {
    let valid_identifiers = ["song_id", "hash_id", "name", "url"];

    if (identifier_type === null) { //Type not specified, lets figure it out

        if (isInt(identifier)) {
            return findSongById(identifier);
        } else if (validator.isMD5(identifier)) {
            return findSongByHashId(identifier);
        } else if (validator.isURL(identifier)) {
            return findSongByUrl(identifier);
        } else { //Welp, I guess its a song name
            return findSongByName(identifier);
        }
    } else {
        if (!valid_identifiers.includes(identifier_type)) { //Invalid identifier type sent
            let err = new Error(`Invalid identifier_type passed. Valid types: ${valid_identifiers.join(", ")}.`);
            return { err: err, song: undefined }
        } else { //Valid identifier type sent, just run the query
            switch (identifier_type) {
                case "song_id": return findSongById(identifier);
                case "hash_id": return findSongByHashId(identifier);
                case "name": return findSongByName(identifier);
                case "url": return findSongByUrl(identifier);
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
    if (!isInt(playlist_id)) {
        let err = new Error("playlist_id must be an integer.")
        return null;
    }
    let query = `SELECT ${PLAYLIST_FIELDS} FROM ${PLAYLIST_TABLE} WHERE playlist_id = ?`;

    try {
        return { err: undefined, playlist: DB.prepare(query).get(playlist_id) };
    } catch (err) {
        console.log(`findPlaylistById playlist_id: ${playlist_id} \nError: `)
        console.log(err);
        return { err: err, playlist: undefined };
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
        return { err: undefined, playlist: DB.prepare(query).get(name) };
    } catch (err) {
        console.log(`findPlaylistByName name: ${name}\nError: `)
        console.log(err);
        return { err: err, playlist: undefined };
    }
}

let findPlaylistByIdentifier = function (identifier, identifier_type = null) {
    let valid_identifiers = ["playlist_id", "name"];

    if (identifier_type === null) { //Type not specified, lets figure it out
        if (isInt(identifier)) {
            return findPlaylistById(identifier);
        } else { //Welp, I guess its a song name
            return findPlaylistByName(identifier);
        }
    } else {
        if (!valid_identifiers.includes(identifier_type)) { //Invalid identifier type sent
            let err = new Error(`Invalid identifier_type passed. Valid types: ${valid_identifiers.join(", ")}.`);
            return { err: err, playlist: undefined }
        } else { //Valid identifier type sent, just run the query
            switch (identifier_type) {
                case "playlist_id": return findPlaylistById(identifier);
                case "name": return findPlaylistByName(identifier);
            }
        }
    }
}



let getSongsByPlaylistIdentifier = function (identifier, identifier_type = null) {
    let valid_identifiers = ["playlist_id", "name"];

    if (identifier_type === null) { //Type not specified, lets figure it out
        if (isInt(identifier)) {
            return getSongsByPlaylist("playlist_id", identifier);
        } else { //Welp, I guess its a song name
            return getSongsByPlaylist("name", identifier);
        }
    } else {
        if (!valid_identifiers.includes(identifier_type)) { //Invalid identifier type sent
            let err = new Error(`Invalid identifier_type passed. Valid types: ${valid_identifiers.join(", ")}.`);
            return { err: err, playlist: undefined }
        } else { //Valid identifier type sent, just run the query
            return getSongsByPlaylist(identifier_type);
        }
    }
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
        return { err: undefined, songs: DB.prepare(query).all(id) };
    } catch (err) {
        console.log(`getSongsByPlaylist: search_field: ${search_field} id: ${id} \nError: `)
        console.log(err);
        return { err: err, songs: undefined };
    }
}

/**
 * Adds a new Playlist to the table.
 * @param {String} name - The name to use for the play list
 * @param {Integer} user_id - The user id of the person creating the play list.
 */
let createPlaylist = function (name, user_id) {
    let query = `INSERT INTO ${PLAYLIST_TABLE} (name, created_by) VALUES (?, ?)`
    try {
        return { err: undefined, info: DB.prepare(query).run(name, user_id) };
    } catch (err) {
        if (err.message.indexOf("UNIQUE") == -1) {
            console.log(`createPlaylist: name: ${name}  user_id: ${user_id} \nError: `)
            console.log(err);
        }
        return { err: err, info: undefined };
    }
}

/**
 * Deletes a Playlist from the table, and deletes all references
 * @param {String} name - The name to use for the play list
 */
let deletePlaylistById = function (playlist_id) {
    let query = `DELETE FROM ${PLAYLIST_TABLE} WHERE playlist_id = ?`
    try {
        return { err: undefined, info: DB.prepare(query).run(playlist_id) };
    } catch (err) {
        console.log(`deletePlaylist: playlist_id: ${playlist_id} \nError: `);
        console.log(err);
        return { err: err, info: undefined };
    }
}

/**
 * Adds a Song to a Playlist
 * @param {Integer} playlist_id - The id of the playlist to add the song to
 * @param {Integer} song_id - The id of the song to add to the playlist
 */
let addToPlaylist = function (playlist_id, song_id) {
    if (!isInt(playlist_id) || !isInt(song_id)) {
        let err = new Error("playlist_id and song_id must be integers.");
        return { err: err, info: undefined };
    }
    let query = "INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)";
    try {
        return { err: undefined, info: DB.prepare("INSERT INTO playlist_song (playlist_id, song_id) VALUES (?, ?)").run(playlist_id, song_id) }
    } catch (err) {
        console.log(`addToPlaylist: playlist_id: ${playlist_id} song_id: ${song_id} \nError: `);
        console.log(err);
        return { err: err, info: undefined };
    }
}

/**
 * Removes a Song from a Playlist.  If the song appears on the playlist more than once, the last one added is removed.
 * @param {Integer} playlist_id - The id of the playlist to remove the song from
 * @param {Integer} song_id - The id of the song to remove from the playlist
 */
let removeFromPlaylist = function (playlist_id, song_id) {
    if (!isInt(playlist_id) || !isInt(song_id)) {
        let err = new Error("playlist_id and song_id must be integers.");
        return { err: err, info: undefined };
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
        return { err: undefined, info: DB.prepare(query).run(playlist_id, song_id) }
    } catch (err) {
        console.log(`removeFromPlaylist: playlist_id: ${playlist_id} song_id: ${song_id} \nError: `);
        console.log(err);
        return { err: err, info: undefined };
    }
}

/**
 * Returns all playlists in the DB.  Hopefully we dont add too many.
 */
let getPlaylists = function () {
    let query = `SELECT ${PLAYLIST_FIELDS} FROM ${PLAYLIST_TABLE}`;

    try {
        return { err: undefined, playlists: DB.prepare(query).all() };
    } catch (err) {
        console.log(`getPlaylists: \nError: `)
        console.log(err);
        return { err: err, playlists: undefined };
    }
}


let searchForSongs = function (name, max_songs = 10) {

    if (!name || name.trim() === "") {
        let err = new Error("search term must not be blank.");
        return { err: err, songs: undefined };
    }

    let clauses = [];
    let prepped_args = [];
    let args = name.split(" ").filter((word) => { return word.trim() !== "" });

    args.forEach((arg) => {
        clauses.push("name LIKE ?");
        prepped_args.push(`%${arg}%`);
    })
    let prepped_statement = clauses.join(" AND ")

    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} WHERE ${prepped_statement} LIMIT ${max_songs}`;

    try {
        return { err: undefined, songs: DB.prepare(query).all(prepped_args) };
    } catch (err) {
        console.log(`searchForSongs: \nError: `)
        console.log(err);
        return { err: err, songs: undefined };
    }
}

let getAllSongs = function () {
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE}`

    try {
        return { err: undefined, songs: DB.prepare(query).all() };
    } catch (err) {
        console.log(`getAllSongs: \nError: `)
        console.log(err);
        return { err: err, songs: undefined };
    }
}

let getSongListData = function () {
    let query = `
        SELECT song.song_id, song.name, song.num_plays, song.last_played, song.is_clip, song.duration, member.username 
        FROM ${SONG_TABLE}
        JOIN ${MEMBER_TABLE} ON (song.added_by = member.member_id)`

    try {
        return { err: undefined, songs: DB.prepare(query).all() };
    } catch (err) {
        console.log(`getSongListData: \nError: `)
        console.log(err);
        return { err: err, songs: undefined };
    }
}
let insertIntoSongs = function (hash_id, name, source, url = null, user_id) {
    if (isInt(name)) {
        let err = new Error("song name must not be an integer.");
        return { err: err, info: undefined };
    }
    let query = "INSERT INTO song (hash_id, name, source, url, added_by) VALUES (?, ?, ?, ?, ?)"
    try {
        return { err: undefined, info: DB.prepare(query).run(hash_id, name, source, url, user_id) };
    } catch (err) {
        console.log(`insertIntoSongs: \nError: `)
        console.log(err);
        return { err: err, info: undefined };
    }
}

let getPlaylistsWithSong = function (identifier) {
    let { err: s_err, song } = findSongByIdentifier(identifier);
    if (s_err) {
        console.log(s_err);
        return { err: s_err, playlists: undefined }
    } else if (song === undefined) {
        return { err: new Error("There is no song by that identifier"), playlists: undefined }
    } else {
        let query = `SELECT DISTINCT ${PLAYLIST_FIELDS} FROM ${PLAYLIST_TABLE} JOIN ${PLAYLIST_SONG_TABLE} USING (playlist_id) WHERE song_id = ?`

        try {
            return { err: undefined, playlists: DB.prepare(query).all(song.song_id) };
        } catch (err) {
            return { err: err, playlists: undefined };
        }
    }
}
let deleteSongById = function (song_id) {
    if (!isInt(song_id)) {
        let err = new Error("song_id must be an integer.");
        return { err: err, info: undefined };
    }
    let query = "DELETE FROM song WHERE song_id = ?"
    try {
        return { err: undefined, info: DB.prepare(query).run(song_id) };
    } catch (err) {
        if (err.message.includes("FOREIGN KEY")) {
            return { err: err, info: undefined };
        } else {
            console.log(`deleteSongById: \nError: `)
            console.log(err);
            return { err: err, info: undefined };
        }
    }
}

let incrementNumPlays = function (song_id) {
    if (!isInt(song_id)) {
        let err = new Error("song_id must be an integer.");
        return { err: err, info: undefined };
    }
    //Update num plays and set last_played to current unix timestamp
    let query = `UPDATE ${SONG_TABLE} SET num_plays = num_plays + 1, last_played = strftime('%s','now') WHERE song_id = ?`
    try {
        return { err: undefined, info: DB.prepare(query).run(song_id) };
    } catch (err) {
        console.log(`incrementNumPlays: \nError: `)
        console.log(err);
        return { err: err, info: undefined };
    }
}

let updateSong = function (song) {
    let query = `UPDATE song SET name = :name, is_clip = :is_clip, duration = :duration WHERE song_id = :song_id;`
    if (song.duration <= global.clip_length) {
        song.is_clip = 1;
    } else {
        song.is_clip = 0;
    }
    try {
        return { err: undefined, info: DB.prepare(query).run({ name: song.name, is_clip: song.is_clip, duration: song.duration, song_id: song.song_id }) };
    } catch (err) {
        console.log(`updateSongById: \nError: `)
        console.log(err);
        return { err: err, info: undefined };
    }
}

let getTopSongs = function (num_songs = 5) {
    let query = `SELECT ${SONG_FIELDS} FROM ${SONG_TABLE} ORDER BY num_plays DESC LIMIT ?`

    try {
        return { err: undefined, songs: DB.prepare(query).all(num_songs) };
    } catch (err) {
        return { err: err, songs: undefined };
    }
}

let insertIntoImages = function (hash, ext, user_id) {

    let query = `INSERT INTO ${IMAGE_TABLE} (hash_id, extension, added_by) VALUES (?, ?, ?)`
    try {
        return { err: undefined, info: DB.prepare(query).run(hash, ext, user_id) };
    } catch (err) {
        console.log(`insertIntoImages: \nError: `)
        console.log(err);
        return { err: err, info: undefined };
    }
}

var findImageById = function (image_id) {
    if (!isInt(image_id)) {
        let err = new Error("image_id must be an integer.")
        return { err: err, image: undefined };
    }
    let query = `SELECT ${IMAGE_FIELDS} FROM ${IMAGE_TABLE} WHERE image_id = ?`;

    try {
        return { err: undefined, image: DB.prepare(query).get(image_id) };
    } catch (err) {
        console.log(`findImageById image_id: ${image_id} \nError: `)
        console.log(err);
        return { err: err, image: undefined };
    }
}

var findImageByHashId = function (hash_id) {
    let query = `SELECT ${IMAGE_FIELDS} FROM ${IMAGE_TABLE} WHERE hash_id = ?`;

    try {
        return { err: undefined, image: DB.prepare(query).get(hash_id) };
    } catch (err) {
        console.log(`findImageByHashId hash_id: ${hash_id} \nError: `)
        console.log(err);
        return { err: err, image: undefined };
    }
}

let findImageByIdentifier = function (identifier, identifier_type = null) {
    let valid_identifiers = ["image_id", "hash_id"];

    if (identifier_type === null) { //Type not specified, lets figure it out
        if (isInt(identifier)) {
            return findImageById(identifier);
        } else if (validator.isMD5(identifier)) {
            return findImageByHashId(identifier);
        } else {
            return { err: new Error("Invalid indentifier"), image: undefined }
        }
    } else {
        if (!valid_identifiers.includes(identifier_type)) { //Invalid identifier type sent
            let err = new Error(`Invalid identifier_type passed. Valid types: ${valid_identifiers.join(", ")}.`);
            return { err: err, image: undefined }
        } else { //Valid identifier type sent, just run the query
            switch (identifier_type) {
                case "image_id": return findImageById(identifier);
                case "hash_id": return findImageByHashId(identifier);
            }
        }
    }
}

let deleteImageById = function (image_id) {
    let query = `DELETE FROM ${IMAGE_TABLE} WHERE image_id = ?`
    try {
        return { err: undefined, info: DB.prepare(query).run(image_id) };
    } catch (err) {
        console.log(`deleteImageById: image_id: ${image_id} \nError: `);
        console.log(err);
        return { err: err, info: undefined };
    }
}

let getRandomImageByTag = function (tag_id) {
    let query = `
        SELECT ${IMAGE_FIELDS} 
        FROM ${IMAGE_TABLE}
        JOIN ${IMAGE_TAG_TABLE} USING (image_id)
        WHERE tag_id = ? 
        ORDER BY RANDOM() 
        LIMIT 1
    `;

    try {
        let img = DB.prepare(query).get(tag_id);
        return { err: undefined, image: img };
    } catch (err) {
        console.log(`getRandomImageByTag tag: ${tag_id} \nError: `)
        console.log(err);
        return { err: err, image: undefined };
    }
}

let findTagByName = function (name) {
    if (isInt(name)) {
        let err = new Error("name must NOT be an integer.")
        return { err: err, song: undefined };
    }
    let query = `SELECT ${TAG_FIELDS} FROM ${TAG_TABLE} WHERE name LIKE ?`;

    try {
        return { err: undefined, tag: DB.prepare(query).get(name) };
    } catch (err) {
        console.log(`g name: ${name} \nError: `)
        console.log(err);
        return { err: err, tag: undefined };
    }
}

let findTagsByNames = function (names) {
    let term_clauses = [];
    names.forEach(name => {
        term_clauses.push("name LIKE ?")
    })

    let where = term_clauses.join(" OR ")
    let query = `SELECT ${TAG_FIELDS} FROM ${TAG_TABLE} WHERE ${where}`;


    try {
        return { err: undefined, tags: DB.prepare(query).all(names) };
    } catch (err) {
        console.log(`names:`, names)
        console.log(`Error: `, err);
        return { err: err, tags: undefined };
    }
}

let createTag = function (name) {
    let query = `INSERT INTO ${TAG_TABLE} (name) VALUES (?)`
    try {
        return { err: undefined, info: DB.prepare(query).run(name) };
    } catch (err) {
        if (err.message.indexOf("UNIQUE") == -1) {
            console.log(`createTag: name: ${name} \nError: `)
            console.log(err);
        }
        return { err: err, info: undefined };
    }
}

let insertIntoTag = function (name) {
    let query = `INSERT INTO ${TAG_TABLE} (name) VALUES (?)`
    try {
        return { err: undefined, info: DB.prepare(query).run(name) };
    } catch (err) {
        console.log(`insertIntoTags: \nError: `)
        console.log(err);
        return { err: err, info: undefined };
    }
}

let insertIntoImageTag = function (image_ids, tag_ids) {
    let terms = [];
    image_ids.forEach(i_id => {
        tag_ids.forEach(t_id => {
            terms.push(`(${i_id}, ${t_id})`);
        })
    })
    let query = `INSERT OR IGNORE INTO ${IMAGE_TAG_TABLE} (image_id, tag_id) VALUES ${terms.join(',')}`

    try {
        return { err: undefined, info: DB.prepare(query).run() };
    } catch (err) {
        console.log(`insertIntoImageTag: \nError: `)
        console.log(err);
        return { err: err, info: undefined };
    }
}

let deleteFromImageTag = function (image_id, tag_id) {
    let query = `DELETE FROM ${IMAGE_TAG_TABLE} WHERE image_id = ? AND tag_id = ?`

    try {
        return { err: undefined, info: DB.prepare(query).run(image_id, tag_id) };
    } catch (err) {
        console.log(`deleteFromImageTag: \nError: `, err);
        return { err: err, info: undefined };
    }
}

let searchImageTagByImageId = function (image_id) {
    let query = `SELECT ${IMAGE_TAG_FIELDS} FROM ${IMAGE_TAG_TABLE} WHERE image_id = ?`;

    try {
        return { err: undefined, image_tags: DB.prepare(query).all(image_id) };
    } catch (err) {
        console.log(`searchImageTagByImageId: \nError: `)
        console.log(err);
        return { err: err, image_tags: undefined };
    }
}


//Command Access Stuff

let findAccessByUserIdAndCommand = function (user_id, command) {
    let query = `SELECT ${ACCESS_FIELDS} FROM ${ACCESS_TABLE} WHERE user_id = ? AND command = ?`;

    try {
        return { err: undefined, access: DB.prepare(query).get(user_id, command) };
    } catch (err) {
        console.log(`findAccessByUserAndCommand: \nError: `)
        console.log(err);
        return { err: err, access: undefined };
    }
}

let updateAccessByUserIdAndCommand = function (user_id, command, is_allowed, admin) {

    let stamp = new Date().getTime()
    let query = `INSERT OR REPLACE INTO ${ACCESS_TABLE} (user_id, command, is_allowed, set_by, added_at)  VALUES (${user_id}, '${command}', ${is_allowed}, '${admin}', ${stamp})`

    try {
        return { err: undefined, info: DB.prepare(query).run() };
    } catch (err) {
        console.log(`updateAccessByUserIdAndCommand: \nError: `)
        console.log(err);
        return { err: err, info: undefined };
    }
}

let revokeAccessByUserIdAndCommand = function (user_id, command, admin) {
    return updateAccessByUserIdAndCommand(user_id, command, 0, admin)
}
let grantAccessByUserIdAndCommand = function (user_id, command, admin) {
    return updateAccessByUserIdAndCommand(user_id, command, 1, admin)
}

let insertCommands = function (commands) {
    const insert = DB.prepare(`INSERT OR REPLACE INTO ${COMMAND_TABLE} (command, default_access) VALUES (@command, @default_access) `);
    const insertMany = DB.transaction((commands) => {
        for (const cmd of commands) insert.run(cmd);
    });

    insertMany(commands)
}

let findCommandByName = function (str_command) {
    let query = `SELECT ${COMMAND_FIELDS} FROM ${COMMAND_TABLE} WHERE command = ?`;

    try {
        return { err: undefined, command: DB.prepare(query).get(str_command) };
    } catch (err) {
        console.log(`findCommandByName: \nError: `)
        console.log(err);
        return { err: err, command: undefined };
    }
}

let initUserAccess = function (user_id) {
    let stamp = new Date().getTime()
    let query = `INSERT OR IGNORE INTO ${ACCESS_TABLE} (user_id, command, is_allowed, set_by, added_at) SELECT ${user_id}, command, default_access, 'System', ${stamp} FROM ${COMMAND_TABLE}`;

    try {
        let commands = DB.prepare(query).run()

    } catch (err) {
        console.log(`initUserAccess: \nError: `)
        console.log(err);
        return { err: err, commands: undefined };
    }
}

let updateMembersList = function(member_list) {
    let stamp = new Date().getTime()
    const insert = DB.prepare(`INSERT OR IGNORE INTO ${MEMBER_TABLE} (member_id, username, added_at) VALUES (@member_id, @username, ${stamp}) `);
    const insertMany = DB.transaction((member_list) => {
        for (const member of member_list) insert.run(member);
    });

    insertMany(member_list)
}
module.exports.isInt = isInt;
module.exports.findSongByIdentifier = findSongByIdentifier;
module.exports.findSongById = findSongById;
module.exports.findSongByName = findSongByName;
module.exports.findPlaylistById = findPlaylistById;
module.exports.findPlaylistByName = findPlaylistByName;
module.exports.findPlaylistByIdentifier = findPlaylistByIdentifier;
module.exports.getSongsByPlaylistIdentifier = getSongsByPlaylistIdentifier;
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
module.exports.getTopSongs = getTopSongs;

module.exports.insertIntoImages = insertIntoImages;
module.exports.findImageByIdentifier = findImageByIdentifier;
module.exports.findImageById = findImageById;
module.exports.findImageByHashId = findImageByHashId;
module.exports.getRandomImageByTag = getRandomImageByTag;
module.exports.findTagByName = findTagByName;
module.exports.findTagsByNames = findTagsByNames;
module.exports.createTag = createTag;

module.exports.insertIntoTag = insertIntoTag;
module.exports.insertIntoImageTag = insertIntoImageTag;
module.exports.deleteFromImageTag = deleteFromImageTag;

module.exports.deleteImageById = deleteImageById;
module.exports.searchImageTagByImageId = searchImageTagByImageId;

module.exports.findAccessByUserIdAndCommand = findAccessByUserIdAndCommand
module.exports.revokeAccessByUserIdAndCommand = revokeAccessByUserIdAndCommand
module.exports.grantAccessByUserIdAndCommand = grantAccessByUserIdAndCommand;
module.exports.insertCommands = insertCommands;
module.exports.findCommandByName = findCommandByName;
module.exports.initUserAccess = initUserAccess;

module.exports.updateMembersList = updateMembersList;
module.exports.getSongListData = getSongListData;

export { isInt }
export { findSongByIdentifier }
export { findSongById };
export { findSongByName };
export { findPlaylistById };
export { findPlaylistByName };
export { findPlaylistByIdentifier };
export { getSongsByPlaylistIdentifier };
export { createPlaylist };
export { deletePlaylistById };
export { addToPlaylist };
export { removeFromPlaylist };
export { getPlaylists };
export { searchForSongs };
export { insertIntoSongs };
export { findSongByHashId };
export { findSongByUrl };
export { incrementNumPlays };
export { updateSong };
export { getAllSongs };
export { deleteSongById };
export { getPlaylistsWithSong };
export { getTopSongs };

export { insertIntoImages };
export { findImageByIdentifier };
export { findImageById };
export { findImageByHashId };
export { getRandomImageByTag };
export { findTagByName };
export { findTagsByNames };
export { createTag };

export { insertIntoTag };
export { insertIntoImageTag };
export { deleteFromImageTag };

export { deleteImageById };
export { searchImageTagByImageId };

export { findAccessByUserIdAndCommand };
export { revokeAccessByUserIdAndCommand };
export { grantAccessByUserIdAndCommand };
export { insertCommands };
export { findCommandByName };
export { initUserAccess };

export {updateMembersList};
export {getSongListData};