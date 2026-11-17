import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('vdown')
    .setDescription("Turn down the volume the bot is playing at.");

export async function execute(interaction) {
    var server = global.servers[interaction.guildId];
    let vc = interaction.member.voice.channel;

    if (!vc) {
        return interaction.reply({ content: "You must be in a Voice Channel to change the volume.", ephemeral: true });
    }

    server.volume = server.volume / 2;
    await interaction.reply(`Lowered volume: ${server.volume * 100}%`);
}
