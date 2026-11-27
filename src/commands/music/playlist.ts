import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { execute as createPlaylist } from './playlist/create';
import { execute as addPlaylist } from './playlist/add';
import { execute as removePlaylist } from './playlist/remove';
import { execute as listPlaylist } from './playlist/list';
import { execute as deletePlaylist } from './playlist/delete';
import { execute as playPlaylist } from './playlist/play';

export const data = new SlashCommandBuilder()
    .setName('playlist')
    .setDescription("Manage playlists.")
    .addSubcommand(sub => sub
        .setName('create')
        .setDescription("Create a new playlist.")
        .addStringOption(opt => opt.setName('name').setDescription('Playlist name').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('add')
        .setDescription("Add song(s) to a playlist.")
        .addStringOption(opt => opt.setName('playlist').setDescription('Playlist ID or name').setRequired(true))
        .addStringOption(opt => opt.setName('songs').setDescription('Song IDs/names (comma separated)').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('remove')
        .setDescription("Remove song(s) from a playlist.")
        .addStringOption(opt => opt.setName('playlist').setDescription('Playlist ID or name').setRequired(true))
        .addStringOption(opt => opt.setName('songs').setDescription('Song IDs/names (comma separated)').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('list')
        .setDescription("List all playlists or songs in a playlist.")
        .addStringOption(opt => opt.setName('playlist').setDescription('Playlist ID/name to list songs. Omit for all playlists.').setRequired(false)))
    .addSubcommand(sub => sub
        .setName('delete')
        .setDescription("Delete a playlist by ID or name.")
        .addStringOption(opt => opt.setName('identifier').setDescription('Playlist ID or name').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('play')
        .setDescription("Play a playlist by identifier.")
        .addStringOption(opt => opt.setName('playlist').setDescription('Playlist ID or name').setRequired(true)));

export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case 'create':
            return createPlaylist(interaction);
        case 'add':
            return addPlaylist(interaction);
        case 'remove':
            return removePlaylist(interaction);
        case 'list':
            return listPlaylist(interaction);
        case 'delete':
            return deletePlaylist(interaction);
        case 'play':
            return playPlaylist(interaction);
    }
}
