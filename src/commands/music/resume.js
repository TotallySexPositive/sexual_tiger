import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('resume')
    .setDescription("Resumes playing a previously paused song where it left off.");

export async function execute(interaction) {
    let vc = interaction.member.voice.channel;
    var server = global.servers[interaction.guildId];

    if (!vc) {
        return interaction.reply({ content: "You are not in a voice channel. I'm not going to listen to you.", ephemeral: true });
    }
    if (server.audioPlayer === undefined) {
        return interaction.reply({ content: "Nothing to resume.", ephemeral: true });
    }

    server.audioPlayer.unpause();
    await interaction.reply("Resumed.");
}
