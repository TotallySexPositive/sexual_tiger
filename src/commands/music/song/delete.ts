import type { ChatInputCommandInteraction } from 'discord.js';
import * as DAL from "../../../dal";
import * as UTIL from "../../../utils";
import fs from "fs";
import path from "path";

export async function execute(interaction: ChatInputCommandInteraction) {
    let server = global.servers.get(interaction.guildId);
    let song_id = interaction.options.getInteger('id')!;

    let user_is_super_admin = server.super_admins.includes(interaction.user.id);

    let result = DAL.findSongById(song_id) as any;
    if (result.err) {
        console.log(result.err);
        return interaction.reply({ content: "Crashed while looking for that song.", ephemeral: true });
    } else if (result.song === undefined) {
        return interaction.reply({ content: "Thanks for wasting my time, there was not song by that id.", ephemeral: true });
    } else {
        let song = result.song;
        if (interaction.user.id != song.added_by && !user_is_super_admin) {
            return interaction.reply({ content: "Hey, how about you dont be a twat and not try and delete other peoples uploads.", ephemeral: true });
        } else {
            let d_result = DAL.deleteSongById(song.song_id) as any;
            if (d_result.err) {
                if (d_result.err.message.includes("FOREIGN KEY")) {
                    let pl_result = DAL.getPlaylistsWithSong(song.song_id) as any;
                    if (pl_result.err) {
                        console.log(pl_result.err);
                        return interaction.reply({ content: "We couldnt delete that song because it is currently on at least one playlist. But we crashed while retreiving those playlist.", ephemeral: true });
                    } else {
                        let playlists_str = "";
                        pl_result.playlists.forEach((playlist: any) => {
                            playlists_str = playlists_str + `ID: ${playlist.playlist_id}    Name: ${playlist.name}\n`;
                        });
                        return interaction.reply({ content: `We couldnt delete that song because it is currently on the following playlist(s).\n\n${playlists_str}`, ephemeral: true });
                    }
                } else {
                    console.log(d_result.err);
                    return interaction.reply({ content: "We couldnt delete that song and have no idea why not.", ephemeral: true });
                }
            } else {
                let hashed_file = song.hash_id + ".mp3";
                let stored_file = song.source;

                fs.unlink(path.resolve(global.audio_dirs.get('hashed'), hashed_file), function (err3) {
                    if (err3) {
                        console.log("Failed to delete requested hashed file.");
                        console.log(err3);
                    }
                });
                fs.unlink(path.resolve(global.audio_dirs.get('stored'), stored_file), function (err3) {
                    if (err3) {
                        console.log("Failed to delete requested stored file.");
                        console.log(err3);
                    }
                });
                return interaction.reply(`${song.name} has been deleted from the database.`);
            }
        }
    }
}
