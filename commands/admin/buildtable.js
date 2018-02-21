const path = require("path")
const asciitable = require("asciitable")

exports.run = (client, message, args) => {
    DB.serialize(function() {
        DB.run(`CREATE TABLE song (
            song_id	INTEGER,
            name	TEXT NOT NULL UNIQUE,
            hash_id	TEXT NOT NULL UNIQUE,
            duration	INTEGER,
            is_clip	INTEGER DEFAULT 0,
            num_plays	INTEGER DEFAULT 0,
            last_played	INTEGER,
            url	TEXT UNIQUE,
            source	TEXT NOT NULL,
            added_by	TEXT,
            PRIMARY KEY(song_id)
        );`);
        DB.run(`CREATE TABLE IF NOT EXIST playlist (
            playlist_id	INTEGER,
            name	TEXT NOT NULL UNIQUE,
            num_songs	INTEGER NOT NULL DEFAULT 0,
            created_by	TEXT NOT NULL,
            PRIMARY KEY(playlist_id)
        );`);
        DB.run(`CREATE TABLE IF NOT EXIST playlist_song (
            relation_id INTEGER PRIMARY KEY,
            playlist_id INTEGER NOT NULL,
            song_id INTEGER NOT NULL,
            FOREIGN KEY(playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE,
            FOREIGN KEY(song_id) REFERENCES song(song_id)
        );`);
        DB.run(`CREATE TABLE image (
            image_id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            hash_id	TEXT NOT NULL UNIQUE,
            extension	TEXT NOT NULL,
            added_by	TEXT NOT NULL
        );`);
        DB.run(`CREATE TABLE image_tag (
            image_tag_id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            image_id	INTEGER NOT NULL,
            tag_id	INTEGER NOT NULL,
            FOREIGN KEY(tag_id) REFERENCES tag(tag_id) ON DELETE CASCADE,
            FOREIGN KEY(image_id) REFERENCES image(image_id) ON DELETE CASCADE
        );`)
        DB.run(`CREATE TABLE tag (
            tag_id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            name	TEXT NOT NULL UNIQUE,
            description	TEXT
        );`)
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
        DB.run(`
            CREATE INDEX image_hash_id ON image (
                hash_id
            );
        `);
        DB.run(`
            CREATE INDEX image_id ON image (
                image_id
            );
        `);
        DB.run(`
            CREATE INDEX tag_id ON tag (
                tag_id
            );
        `);
    });

    DB.close();
};

exports.help = () =>{
    return "Initializes your tables.";
};
