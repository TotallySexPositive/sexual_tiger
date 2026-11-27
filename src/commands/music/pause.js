import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('pause')
    .setDescription("Pauses the currently playing song.");

export async function execute(interaction) {
    let vc = interaction.member.voice.channel;
    var server = global.servers.get(interaction.guildId);

    if (!vc) {
        return interaction.reply({ content: "You are not in a voice channel. I'm not going to listen to you.", ephemeral: true });
    }
    if (server.audioPlayer === undefined) {
        return interaction.reply({ content: "No audio is playing. You must be hearing things.", ephemeral: true });
    }

    server.audioPlayer.pause();
    await interaction.reply("Paused.");
}
