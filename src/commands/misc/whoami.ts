import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import * as UTIL from "../../utils";

export const data = new SlashCommandBuilder()
    .setName('whoami')
    .setDescription("Displays some general information about the user.");

export async function execute(interaction: ChatInputCommandInteraction) {
    const author = interaction.user;
    const member = interaction.member as any;

    const is_admin: boolean = UTIL.isAdmin(member);

    const description = `
User id: ${author.id}
Username: ${author.username}
Nickname: ${member.nickname}
Display Name: ${member.displayName}
On Server: ${interaction.guildId}
isAdmin: ${is_admin}
`.replace(/\n +/g, `\n`);

    await interaction.reply(description);
}
