import { SlashCommandBuilder } from 'discord.js';

const path = require("path");
const fs = require("fs");
import * as UTIL from "../../utils";
var Queue = require('better-queue');

export const data = new SlashCommandBuilder()
    .setName('process_queued_uploads')
    .setDescription("Process any songs that have been FTP uploaded onto the server.");

export async function execute(interaction) {
    let uploaded_audio_folder = global.audio_dirs.get('uploaded');
    let files_to_process = fs.readdirSync(uploaded_audio_folder).filter(file => file !== ".placeholder");

    await interaction.deferReply();

    var q = new Queue(UTIL.processAudioFileTask, function (err, result) { });

    q.on('drain', function () { interaction.followUp("Done processing all files in queue.").catch(() => {}); });

    for (let file of files_to_process) {
        let uploaded_file_path = path.resolve(uploaded_audio_folder, file);
        console.log(`Adding file ${uploaded_file_path} to the queue.`);
        q.push({ file_path: uploaded_file_path, url: null, message: { channel: { send: (msg) => interaction.followUp(msg).catch(() => {}) }, author: interaction.user } })
            .on('finish', function (result) { interaction.followUp(result).catch(() => {}); })
            .on('failed', function (err) { interaction.followUp(String(err)).catch(() => {}); });
    }

    await interaction.editReply("Processing queued uploads...");
}
