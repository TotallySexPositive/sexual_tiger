import { SlashCommandBuilder } from 'discord.js';

import * as UTIL from "../../utils.js";

export const data = new SlashCommandBuilder()
    .setName('build_gist')
    .setDescription("Rebuilds the Audio Gist on github from the current DB.");

export async function execute(interaction) {
    let err = UTIL.rebuildAudioGist();
    if (err) {
        interaction.reply({ content: err.message });
    } else {
        interaction.reply({ content: "Updated!" });
    }
}
