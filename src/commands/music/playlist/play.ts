import type { ChatInputCommandInteraction, StringSelectMenuInteraction } from 'discord.js';
import { MessageFlags } from 'discord.js';
import * as DAL from "../../../dal";
import * as UTIL from "../../../utils";

export async function playPlaylistByIdentifier(
    interaction: ChatInputCommandInteraction | StringSelectMenuInteraction,
    playlist_identifier: string
) {
    let server = global.servers.get(interaction.guildId);
    let vc = (interaction.member as any).voice.channel;

    if (!vc) {
        return interaction.reply({ content: "You must be in a Voice Channel, I'm not gonna play this shit for no one.", ephemeral: true });
    }

    let result = DAL.getSongsByPlaylistIdentifier(playlist_identifier) as any;

    if (result.err) {
        return interaction.reply({ content: "Unknown error occured while fetching playlist songs.", ephemeral: true });
    } else if (result.songs === undefined || result.songs.length == 0) {
        return interaction.reply({ content: "This playlist has no songs, you suck as a DJ.", ephemeral: true });
    }

    server.song_queue = result.songs;
    UTIL.playAudio(interaction, vc, server);
    await interaction.reply({
        content: 'Done.',
        flags: MessageFlags.Ephemeral,
    });
}

export async function execute(interaction: ChatInputCommandInteraction) {
    let playlist_identifier = interaction.options.getString('playlist')!;
    return playPlaylistByIdentifier(interaction, playlist_identifier);
}
