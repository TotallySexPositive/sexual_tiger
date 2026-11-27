import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('grab_pics')
    .setDescription("Grabs animated images and stores them in the DB.")
    .addStringOption(option => option.setName('tag').setDescription("The tag name for the images").setRequired(true));

export async function execute(interaction) {
    let tag = interaction.options.getString('tag');
}
