import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('skip')
    .setDescription("Skip to the next song in the queue.");

export async function execute(interaction) {
    var server = global.servers[interaction.guildId];
    let vc = interaction.member.voice.channel;

    if (!vc) {
        return interaction.reply({ content: "You are not in a voice channel. I'm not going to listen to you.", ephemeral: true });
    }

    if (server.audioPlayer) {
        server.audioPlayer.stop();
        await interaction.reply("Skipped.");
    } else {
        await interaction.reply({ content: "No audio is playing.", ephemeral: true });
    }
}
