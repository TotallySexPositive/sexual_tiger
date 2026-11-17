import { SlashCommandBuilder } from 'discord.js';

import * as UTIL from "../../utils.js";

export const data = new SlashCommandBuilder()
    .setName('update_audio')
    .setDescription("Rebuilds the Audio list json data file from the current DB.");

export async function execute(interaction) {
    let err = UTIL.generateAudioList();
    if (err) {
        interaction.reply({ content: err.message });
    } else {
        interaction.reply({ content: "Updated!" });
    }
}
