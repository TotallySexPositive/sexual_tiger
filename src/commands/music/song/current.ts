import type { ChatInputCommandInteraction } from 'discord.js';
import { EmbedBuilder } from 'discord.js';

export async function execute(interaction: ChatInputCommandInteraction) {
    let server = global.servers.get(interaction.guildId);
    let current_song = server.current_song;

    if (!current_song || current_song === undefined || current_song.name === undefined) {
        return interaction.reply({ content: "Either nothing is playing or its not a playlist song.", ephemeral: true });
    } else {
        let embed = new EmbedBuilder()
            .setTitle("Currently Playing...")
            .setColor(Math.floor(Math.random() * 16777215))
            .addFields(
                { name: "Song:", value: current_song.name, inline: true },
                { name: "Id:", value: String(current_song.song_id), inline: true },
                { name: "Plays:", value: String(current_song.num_plays), inline: true }
            );
        await interaction.reply({ embeds: [embed] });
    }
}
