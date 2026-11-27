import { SlashCommandBuilder } from 'discord.js';

import * as DAL from "../../dal";

export const data = new SlashCommandBuilder()
    .setName('revoke')
    .setDescription("Revoke a user's access to a command.")
    .addUserOption(option => option.setName('user').setDescription("The user to revoke access from").setRequired(true))
    .addStringOption(option => option.setName('command').setDescription("The command name").setRequired(true));

export async function execute(interaction) {
    let server = global.servers.get(interaction.guildId);
    let secure_commands = ["revoke", "grant"];

    let user = interaction.options.getUser('user');
    let str_command = interaction.options.getString('command');

    if (!user || !str_command) {
        return interaction.reply({ content: "You must provide a user and command." });
    }

    let { err, command } = DAL.findCommandByName(str_command);

    if (command === undefined) {
        return interaction.reply({ content: `${str_command} is not a valid command.` });
    } else {
        let user_is_super_admin = server.super_admins.includes(user.id);

        if (secure_commands.includes(command.command) && user_is_super_admin) {
            return interaction.reply({ content: "You are not allowed to grant/revoke from super admins." });
        }

        let { find_err, access } = DAL.findAccessByUserIdAndCommand(user.id, command.command);
        if (find_err) {
            console.log("Failed to find access for a command during revoke, oops");
            console.log(find_err);
        }
        if (access && !access.is_allowed) {
            return interaction.reply({ content: `That user already does not have access to the command, ${command.command}` });
        }
        let { grant_err, result } = DAL.revokeAccessByUserIdAndCommand(user.id, command.command, interaction.user.id);
        if (grant_err) {
            console.log(grant_err);
            return interaction.reply({ content: `Something went wrong Error: ${grant_err}` });
        } else {
            return interaction.reply({ content: `That user's access has been revoked for the command, ${command.command}` });
        }
    }
}
