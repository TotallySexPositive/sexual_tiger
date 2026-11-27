import { SlashCommandBuilder } from 'discord.js';

const fs = require("fs");
const path = require("path");
import * as DAL from "../../dal";
import * as UTIL from "../../utils";
const sanitize = require("sanitize-filename");
const youtubedl = require("youtube-dl-exec");
const extractDomain = require("extract-domain").default;
const validator = require("validator");

export const data = new SlashCommandBuilder()
    .setName('download')
    .setDescription("Download a video's audio and store it in the DB.")
    .addStringOption(opt => opt
        .setName('url')
        .setDescription('URL of the video to download audio from')
        .setRequired(true));

export async function execute(interaction) {
    let server = global.servers.get(interaction.guildId);
    let url = interaction.options.getString('url');

    if (!validator.isURL(url)) {
        return interaction.reply({ content: "Invalid url sent.", ephemeral: true });
    }

    await interaction.deferReply();

    let domain = extractDomain(url);
    let { err, song } = DAL.findSongByUrl(url);

    if (err) {
        console.log("Shit, what?");
        console.log(err);
        return interaction.editReply("Ummm, we kind of crashed but are trying to continue, wish me luck.");
    } else if (song !== undefined) {
        return interaction.editReply(`That clip is already in the DB under the name, ${song.name}`);
    } else {
        try {
            let info = await youtubedl(url, { dumpSingleJson: true });
            let save_to = path.resolve(global.audio_dirs.get('tmp'), sanitize(info.title) + `.mp3`);
            if (info.duration > 600) {
                return interaction.editReply("That video is too fucking long.");
            } else {
                await youtubedl(url, { "extract-audio": true, "audio-format": "mp3", output: save_to, jsRuntimes:  "node"});
                UTIL.processAudioFile(save_to, url, { channel: { send: (msg) => interaction.followUp(msg).catch(() => {}) }, author: interaction.user }, (err, success) => {
                    if (err) {
                        interaction.followUp(err.message).catch(() => {});
                    } else {
                        interaction.followUp(success).catch(() => {});
                    }
                });
                return interaction.editReply(`Download of, ${info.title}, from ${domain} has started.`);
            }
        } catch (e) {
            console.error(e);
            return interaction.editReply("Failed to download audio.");
        }
    }
}
