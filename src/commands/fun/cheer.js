import { SlashCommandBuilder } from 'discord.js';

import * as UTIL from "../../utils";

export const data = new SlashCommandBuilder()
    .setName('cheer')
    .setDescription("Post an image of anime cheer.");

export async function execute(interaction) {
    await interaction.deferReply();
    UTIL.postRandomImageByTag(interaction, "cheer");
}
