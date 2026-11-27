import { SlashCommandBuilder } from 'discord.js';

import { EmbedBuilder } from 'discord.js';
const xkcd = require('xkcd-api');

export const data = new SlashCommandBuilder()
    .setName('xkcd')
    .setDescription("Grab a XKCD image")
    .addIntegerOption(opt => opt
        .setName('comic_id')
        .setDescription('Specific comic ID to fetch. Omit for latest.')
        .setRequired(false));

export async function execute(interaction) {
    const comicId = interaction.options.getInteger('comic_id');
    await interaction.deferReply();

    if (comicId !== null) {
        xkcd.get(comicId, function (error, response) {
            if (error) {
                console.error(error);
                return interaction.editReply("Error fetching comic.");
            } else {
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(response.title)
                    .setImage(response.img)
                    .setFooter({ text: response.alt });
                interaction.editReply({ embeds: [embed] });
            }
        });
    } else {
        xkcd.latest(function (error, response) {
            if (error) {
                console.error(error);
                return interaction.editReply("Error fetching comic.");
            } else {
                const embed = new EmbedBuilder()
                    .setColor('Random')
                    .setTitle(response.title)
                    .setImage(response.img)
                    .setFooter({ text: response.alt });
                interaction.editReply({ embeds: [embed] });
            }
        });
    }
}
