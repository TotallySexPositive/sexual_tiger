import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pings the bot to check if it is alive.');

export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(`My sexual ping is ${interaction.client.ws.ping}ms`);
}
