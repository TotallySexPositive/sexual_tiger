import { SlashCommandBuilder } from 'discord.js';

import * as UTIL from "../../utils";

export const data = new SlashCommandBuilder()
    .setName('sorry')
    .setDescription("Post an image of anime sorry.");

export async function execute(interaction) {
    await interaction.deferReply();
    UTIL.postRandomImageByTag(interaction, "sorry");
}
