import { SlashCommandBuilder } from 'discord.js';

import * as UTIL from "../../utils";

export const data = new SlashCommandBuilder()
    .setName('lewd')
    .setDescription("Post an image of anime lewd.");

export async function execute(interaction) {
    await interaction.deferReply();
    UTIL.postRandomImageByTag(interaction, "lewd");
}
