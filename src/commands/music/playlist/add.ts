import type { ChatInputCommandInteraction } from 'discord.js';
import * as DAL from "../../../dal";

export async function execute(interaction: ChatInputCommandInteraction) {
    let playlist_identifier = interaction.options.getString('playlist')!;
    let song_identifiers = interaction.options.getString('songs')!.split(',').map(s => s.trim());

    let p_result = DAL.findPlaylistByIdentifier(playlist_identifier) as any;
    if (p_result.err) return interaction.reply({ content: `Oops, issue trying to find the specified playlist, ${p_result.err.message}`, ephemeral: true });
    let playlist = p_result.playlist;
    if (playlist === undefined) return interaction.reply({ content: `The specified playlist doesnt exist.`, ephemeral: true });

    let skipped_songs: string[] = [];
    let added_songs: string[] = [];

    for (let identifier of song_identifiers) {
        let s_result = DAL.findSongByIdentifier(identifier) as any;
        if (s_result.err) {
            skipped_songs.push(`X_X: ${identifier}`);
            console.log(s_result.err);
        } else if (s_result.song === undefined) {
            skipped_songs.push(`DNE: ${identifier}`);
        } else {
            let song = s_result.song;
            let a_result = DAL.addToPlaylist(playlist.playlist_id, song.song_id) as any;
            if (a_result.err) {
                console.log(a_result.err);
                skipped_songs.push(`X_X: ${song.song_id}: ${song.name}`);
            } else {
                added_songs.push(`${song.name}`);
            }
        }
    }

    if (added_songs.length) {
        await interaction.reply(`The following songs were added to **${playlist.name}**:\n${added_songs.join('\n')}`);
    }
    if (skipped_songs.length) {
        await interaction.followUp(`The following songs either didnt exist or crashed the query and were not add:\n${skipped_songs.join('\n')}`);
    }
}
