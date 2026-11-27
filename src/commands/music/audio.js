import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('audio')
    .setDescription("Display the link to the audio list on the site.");

export async function execute(interaction) {
    await interaction.reply("You lazy sack of feces, here...\n<https://tiger.wentzel.dev/audio.html>");
}
