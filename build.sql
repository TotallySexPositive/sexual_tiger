CREATE TABLE IF NOT EXISTS song (
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
);

CREATE TABLE IF NOT EXISTS playlist (
    playlist_id	INTEGER,
    name	TEXT NOT NULL UNIQUE,
    num_songs	INTEGER NOT NULL DEFAULT 0,
    created_by	TEXT NOT NULL,
    PRIMARY KEY(playlist_id)
);

CREATE TABLE IF NOT EXISTS playlist_song (
    relation_id INTEGER PRIMARY KEY,
    playlist_id INTEGER NOT NULL,
    song_id INTEGER NOT NULL,
    FOREIGN KEY(playlist_id) REFERENCES playlist(playlist_id) ON DELETE CASCADE,
    FOREIGN KEY(song_id) REFERENCES song(song_id)
);

CREATE TABLE IF NOT EXISTS image (
    image_id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    hash_id	TEXT NOT NULL UNIQUE,
    extension	TEXT NOT NULL,
    added_by	TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS image_tag (
    image_tag_id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    image_id	INTEGER NOT NULL,
    tag_id	INTEGER NOT NULL,
    FOREIGN KEY(tag_id) REFERENCES tag(tag_id) ON DELETE CASCADE,
    FOREIGN KEY(image_id) REFERENCES image(image_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tag (
    tag_id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
    name	TEXT NOT NULL UNIQUE,
    description	TEXT
);

CREATE TABLE IF NOT EXISTS access (
    user_id	TEXT NOT NULL,
    command	TEXT NOT NULL,
    is_allowed	INTEGER NOT NULL,
    set_by	TEXT,
    added_at    TEXT,
    PRIMARY KEY(user_id, command),
    FOREIGN KEY(command) REFERENCES command(command) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS command (
    command	TEXT NOT NULL UNIQUE,
    default_access INTEGER NOT NULL,
    PRIMARY KEY(command)
);

CREATE TRIGGER IF NOT EXISTS increment_num_songs AFTER INSERT ON playlist_song
BEGIN
    UPDATE playlist SET num_songs = num_songs + 1 WHERE playlist.playlist_id = NEW.playlist_id;
END;

CREATE TRIGGER IF NOT EXISTS decrement_num_songs AFTER DELETE ON playlist_song
BEGIN
    UPDATE playlist SET num_songs = num_songs - 1 WHERE playlist.playlist_id = OLD.playlist_id;
END;

CREATE INDEX IF NOT EXISTS playlist_id_song_id ON playlist_song (
    playlist_id,
    song_id
);

CREATE INDEX IF NOT EXISTS playlist_name ON playlist (
    name
);

CREATE INDEX IF NOT EXISTS song_name ON song (
    name
);

CREATE INDEX IF NOT EXISTS image_hash_id ON image (
    hash_id
);

CREATE INDEX IF NOT EXISTS image_id ON image (
    image_id
);

CREATE INDEX IF NOT EXISTS tag_id ON tag (
    tag_id
);