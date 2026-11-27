import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('home')
    .setDescription("Displays the link to the Sexual Tiger website.");

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Come visit me at, https://tiger.wentzel.dev");
}
