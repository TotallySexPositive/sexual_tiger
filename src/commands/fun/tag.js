import { SlashCommandBuilder } from 'discord.js';

import * as DAL from "../../dal";

export const data = new SlashCommandBuilder()
    .setName('tag')
    .setDescription("Manage image tags.")
    .addSubcommand(sub => sub
        .setName('create')
        .setDescription("Create a new tag. Tag names must be 1 word.")
        .addStringOption(opt => opt
            .setName('name')
            .setDescription('Tag name (single word)')
            .setRequired(true)));

export async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
        let name = interaction.options.getString('name');
        if (DAL.isInt(name)) {
            return interaction.reply({ content: "Tag names can not be Integers. Just because.", ephemeral: true });
        }
        if (name.indexOf(" ") > -1) {
            return interaction.reply({ content: "Tag names must only be a single word.", ephemeral: true });
        }

        let { err, info } = DAL.createTag(name);

        if (err && err.message.indexOf("UNIQUE") > -1) {
            await interaction.reply(`That tag already exists.`);
        } else if (err) {
            console.log(err);
            await interaction.reply(`Sorry, ${interaction.user.username}, it seems something unexpected happened.`);
        } else {
            await interaction.reply(`The tag ${name} has been created!`);
        }
    }
}
