import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('repeat')
    .setDescription("Toggles whether or not clips and songs will repeat.");

export async function execute(interaction) {
    let server = global.servers[interaction.guildId];
    server.repeat = !server.repeat;
    let m = "";

    if (server.repeat) {
        m = "Sounds will repeat";
    } else {
        m = "Sounds will not repeat";
    }

    await interaction.reply(m);
}
