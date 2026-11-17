import { SlashCommandBuilder, Attachment } from 'discord.js';

const path = require("path");
const request = require("request");
const fs = require("fs");
import * as UTIL from "../../utils";

export const data = new SlashCommandBuilder()
    .setName('upload')
    .setDescription("Upload a song to the bot so it can be played back. Max file size is 8MB.")
    .addAttachmentOption(opt => opt
        .setName('file')
        .setDescription('Audio file to upload')
        .setRequired(true));

export async function execute(interaction) {
    const attachment = interaction.options.getAttachment('file');
    if (!attachment) {
        return interaction.reply({ content: "Need to actually attach something", ephemeral: true });
    }

    await interaction.deferReply();

    let fpath = path.resolve(global.audio_dirs.get('uploaded'), attachment.name);
    request(attachment.url)
        .pipe(fs.createWriteStream(fpath))
        .on('finish', () => {
            UTIL.processAudioFile(fpath, null, { channel: { send: (msg) => interaction.followUp(msg).catch(() => {}) }, author: interaction.user }, (err, success) => {
                if (err) {
                    interaction.followUp(err.message).catch(() => {});
                } else {
                    interaction.followUp(success).catch(() => {});
                }
            });
        })
        .on('error', (err) => { console.error(err); interaction.editReply("Failed to download attachment.").catch(() => {}); });
}
