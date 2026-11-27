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
    let removed_songs: string[] = [];

    for (let identifier of song_identifiers) {
        let s_result = DAL.findSongByIdentifier(identifier) as any;
        if (s_result.err) {
            skipped_songs.push(`X_X: ${identifier}`);
            console.log(s_result.err);
        } else if (s_result.song === undefined) {
            skipped_songs.push(`DNE: ${identifier}`);
        } else {
            let song = s_result.song;
            let r_result = DAL.removeFromPlaylist(playlist.playlist_id, song.song_id) as any;
            if (r_result.err) {
                console.log(r_result.err);
                skipped_songs.push(`X_X: ${song.song_id}: ${song.name}`);
            } else if (!r_result.info.changes) {
                skipped_songs.push(`NOL: ${song.song_id}: ${song.name}`);
            } else {
                removed_songs.push(`${song.name}`);
            }
        }
    }

    if (removed_songs.length) {
        await interaction.reply(`The following songs were removed from **${playlist.name}**:\n${removed_songs.join('\n')}`);
    }
    if (skipped_songs.length) {
        await interaction.followUp(`The following songs either didnt exist or crashed the query and were not removed:\n${skipped_songs.join('\n')}`);
    }
}
