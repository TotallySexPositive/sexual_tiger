import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { execute as currentSong } from './song/current';
import { execute as renameSong } from './song/rename';
import { execute as deleteSong } from './song/delete';
import { execute as topSongs } from './song/top';

export const data = new SlashCommandBuilder()
    .setName('song')
    .setDescription("Song management commands.")
    .addSubcommand(sub => sub
        .setName('current')
        .setDescription("Display the currently playing song's name and id."))
    .addSubcommand(sub => sub
        .setName('rename')
        .setDescription("Rename a song in the database.")
        .addIntegerOption(opt => opt.setName('id').setDescription('Song ID').setRequired(true))
        .addStringOption(opt => opt.setName('name').setDescription('New song name').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('delete')
        .setDescription("Delete a song from the database by ID.")
        .addIntegerOption(opt => opt.setName('id').setDescription('Song ID to delete').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('top')
        .setDescription("Get the most played songs in the database.")
        .addIntegerOption(opt => opt.setName('count').setDescription('Number of top songs (1-10, default 5)').setRequired(false)));

export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case 'current':
            return currentSong(interaction);
        case 'rename':
            return renameSong(interaction);
        case 'delete':
            return deleteSong(interaction);
        case 'top':
            return topSongs(interaction);
    }
}
