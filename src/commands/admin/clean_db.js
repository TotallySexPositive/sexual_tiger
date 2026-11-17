import { SlashCommandBuilder } from 'discord.js';

const fs = require('fs');
import * as DAL from "../../dal";

export const data = new SlashCommandBuilder()
    .setName('clean_db')
    .setDescription("Deletes all Song entries from the DB where the source file no longer exists.");

export async function execute(interaction) {
    let { err: s_err, songs } = DAL.getAllSongs();
    if (s_err) {
        console.log("Failed to get songs");
    } else {
        songs.forEach(song => {
            if (!fs.existsSync(song.source)) {
                let { err: d_err, info } = DAL.deleteSongById(song.song_id);
                if (d_err) {
                    console.log(`Failed to delete ${song.song_id}`);
                    console.log(d_err);
                }
            }
        });
    }
}
