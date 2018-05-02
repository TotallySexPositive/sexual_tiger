CREATE TABLE playlist (
            playlist_id	INTEGER,
            name	TEXT NOT NULL UNIQUE,
            num_songs	INTEGER NOT NULL DEFAULT 0,
            created_by	TEXT NOT NULL,
            PRIMARY KEY(playlist_id)
        );
CREATE INDEX playlist_name ON playlist (
                name
            );
CREATE TABLE "playlist_song" (
	`relation_id`	INTEGER,
	`playlist_id`	INTEGER NOT NULL,
	`song_id`	INTEGER NOT NULL,
	FOREIGN KEY(`song_id`) REFERENCES `song`(`song_id`),
	PRIMARY KEY(`relation_id`),
	FOREIGN KEY(`playlist_id`) REFERENCES `playlist`(`playlist_id`) ON DELETE CASCADE
);
CREATE INDEX `playlist_id_song_id` ON `playlist_song` (
	`playlist_id`,
	`song_id`
);
CREATE TRIGGER increment_num_songs AFTER INSERT ON playlist_song
BEGIN
	UPDATE playlist SET num_songs = num_songs + 1 WHERE playlist.playlist_id = NEW.playlist_id;
END;
CREATE TRIGGER decrement_num_songs AFTER DELETE ON playlist_song BEGIN UPDATE playlist SET num_songs = num_songs - 1 WHERE playlist.playlist_id = OLD.playlist_id; END;
CREATE TABLE "song" (
	`song_id`	INTEGER,
	`name`	TEXT NOT NULL UNIQUE,
	`hash_id`	TEXT NOT NULL UNIQUE,
	`duration`	INTEGER,
	`is_clip`	INTEGER DEFAULT 0,
	`num_plays`	INTEGER DEFAULT 0,
	`last_played`	INTEGER,
	`url`	TEXT UNIQUE,
	`source`	TEXT NOT NULL,
	`added_by`	TEXT,
	PRIMARY KEY(`song_id`)
);
CREATE INDEX `song_name` ON `song` (
	`name`
);
CREATE TABLE `tag` (
	`tag_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`name`	TEXT NOT NULL UNIQUE,
	`description`	TEXT
);
CREATE INDEX `tag_id` ON `tag` (
	`tag_id`
);
CREATE TABLE "image_tag" (
	`image_tag_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`image_id`	INTEGER NOT NULL,
	`tag_id`	INTEGER NOT NULL,
	FOREIGN KEY(`image_id`) REFERENCES `image`(`image_id`) ON DELETE CASCADE,
	FOREIGN KEY(`tag_id`) REFERENCES `tag`(`tag_id`) ON DELETE CASCADE
);
CREATE TABLE "image" (
	`image_id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	`hash_id`	TEXT NOT NULL UNIQUE,
	`extension`	TEXT NOT NULL,
	`added_by`	TEXT NOT NULL,
	`added`	TEXT DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX `image_id` ON `image` (
	`image_id`
);
CREATE INDEX `image_hash_id` ON `image` (
	`hash_id`
);
CREATE UNIQUE INDEX `image_id_tag_id` ON `image_tag` (
	`image_id`,
	`tag_id`
);
