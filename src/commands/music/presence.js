import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('presence')
    .setDescription("Toggles whether or not the bot should stay in voice channel after playing.");

export async function execute(interaction) {
    let server = global.servers.get(interaction.guildId);
    server.maintain_presence = !server.maintain_presence;
    let m = "";
    if (server.maintain_presence) {
        m = "Ok, I'll hang out for a bit.";
    } else {
        m = "Dont worry, I'll fucking drop you like a shit covered potato.";
    }

    await interaction.reply(m);
}
