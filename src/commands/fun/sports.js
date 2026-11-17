import { SlashCommandBuilder } from 'discord.js';

import * as UTIL from "../../utils";

export const data = new SlashCommandBuilder()
    .setName('sports')
    .setDescription("Post an image of anime sports.");

export async function execute(interaction) {
    await interaction.deferReply();
    UTIL.postRandomImageByTag(interaction, "sports");
}
