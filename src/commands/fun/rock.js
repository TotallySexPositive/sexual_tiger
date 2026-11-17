import { SlashCommandBuilder } from 'discord.js';

import * as UTIL from "../../utils";

export const data = new SlashCommandBuilder()
    .setName('rock')
    .setDescription("Post an image of anime rock.");

export async function execute(interaction) {
    await interaction.deferReply();
    UTIL.postRandomImageByTag(interaction, "rock");
}
