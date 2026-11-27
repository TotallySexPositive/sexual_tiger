import { SlashCommandBuilder } from 'discord.js';

const probe = require('node-ffprobe');
const path = require("path");
const fs = require('fs');
import * as DAL from "../../dal";

export const data = new SlashCommandBuilder()
    .setName('probe_audio')
    .setDescription("Probes all hashed audio files and updates their length in the database.");

export async function execute(interaction) {
    let hashed_audio_path = global.audio_dirs.get('hashed');
    let files_to_process = fs.readdirSync(global.audio_dirs.get('hashed'));
    console.log("Probing audio!");

    probe.SYNC = true;
    files_to_process.some(function (file) {
        probe(path.resolve(global.audio_dirs.get('hashed'), file)).then(data => {
            let { err: s_err, song } = DAL.findSongByIdentifier(file.substring(0, 32));
            if (s_err) {
                console.log("Failed to find song in DB that existed in hash folder.  Uh oh...");
                console.log(file.substring(0, 32));
            } else {
                song.duration = Math.ceil(data.streams[0].duration);
                DAL.updateSong(song);
            }
            console.log("in that probe yo");
        });
    });
    console.log("Probing audio Finished!");
}
