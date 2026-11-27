import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription("Stops any playing audio and empties the queue.");

export async function execute(interaction) {
    var server = global.servers.get(interaction.guildId);
    let vc = interaction.member.voice.channel;

    if (!vc) {
        return interaction.reply({ content: "You are not in a voice channel. I'm not going to listen to you.", ephemeral: true });
    }

    if (server.voiceConnection != null) {
        server.song_queue.length = 0;
        if (server.audioPlayer === undefined) {
            await interaction.reply("No audio is playing. You must be hearing things.");
        } else {
            server.audioPlayer.stop();
            server.voiceConnection.destroy();
            await interaction.reply("Stopped.");
        }
    }
}
