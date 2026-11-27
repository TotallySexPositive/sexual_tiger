import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

import { execute as tagImage } from './image/tag';
import { execute as untagImage } from './image/untag';
import { execute as retagImage } from './image/retag';

export const data = new SlashCommandBuilder()
    .setName('image')
    .setDescription("Manage images in the database.")
    .addSubcommand(sub => sub
        .setName('tag')
        .setDescription("Tag an image by message ID.")
        .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the image post').setRequired(true))
        .addStringOption(opt => opt.setName('tags').setDescription('Tags to add (comma separated)').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('untag')
        .setDescription("Remove a tag from an image by message ID.")
        .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the image post').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('retag')
        .setDescription("Replace tags on an image by message ID.")
        .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the image post').setRequired(true))
        .addStringOption(opt => opt.setName('tags').setDescription('New tags (comma separated)').setRequired(true)));

export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
        case 'tag':
            return tagImage(interaction);
        case 'untag':
            return untagImage(interaction);
        case 'retag':
            return retagImage(interaction);
    }
}
