const path = require("path")
const asciitable = require("asciitable")

exports.run = (client, message, args) => {
    DB.serialize(function() {
        DB.run(`CREATE TABLE IF NOT EXIST song (
            song_id INTEGER PRIMARY KEY,
            hash_id TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            source TEXT NOT NULL
        );`);
        DB.run(`CREATE TABLE IF NOT EXIST playlist (
            playlist_id	INTEGER,
            name	TEXT NOT NULL UNIQUE,
            num_songs	INTEGER NOT NULL DEFAULT 0,
            created_by	TEXT NOT NULL,
            PRIMARY KEY(playlist_id)
        );`);
        DB.run(`CREATE TABLE IF NOT EXIST playlist_song (
            relationship_id INTEGER PRIMARY KEY,
            playlist_id INTEGER NOT NULL,
            song_id INTEGER NOT NULL,
            FOREIGN KEY(playlist_id) REFERENCES playlist(playlist_id),
            FOREIGN KEY(song_id) REFERENCES song(song_id)
        );`);
        DB.run(`
            CREATE TRIGGER IF NOT EXIST increment_num_songs AFTER INSERT ON playlist_song
            BEGIN
                UPDATE playlist SET num_songs = num_songs + 1 WHERE playlist.playlist_id = NEW.playlist_id;
            END;
        `);
        DB.run(`
            CREATE TRIGGER IF NOT EXIST decrement_num_songs AFTER DELETE ON playlist_song
            BEGIN
                UPDATE playlist SET num_songs = num_songs - 1 WHERE playlist.playlist_id = OLD.playlist_id;
            END;
        `);
        DB.run(`
            CREATE INDEX IF NOT EXIST playlist_id_song_id ON playlist_song (
                playlist_id,
                song_id
            );
        `);
        DB.run(`
            CREATE INDEX IF NOT EXIST playlist_name ON playlist (
                name
            );
        `);
        DB.run(`
            CREATE INDEX IF NOT EXIST song_name ON song (
                name
            );
        `);
    });

    DB.close();
};

exports.help = () =>{
    return "Initializes your tables.";
};
