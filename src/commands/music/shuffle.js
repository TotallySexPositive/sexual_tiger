import { SlashCommandBuilder } from 'discord.js';

const shuffle = require('array-shuffle');
import * as DAL from "../../dal";
import * as UTIL from "../../utils";

export const data = new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription("Shuffle the current song queue or replace with a shuffled playlist.")
    .addStringOption(opt => opt
        .setName('playlist')
        .setDescription('Playlist name or ID to shuffle and play. Omit to shuffle current queue.')
        .setRequired(false));

export async function execute(interaction) {
    var server = global.servers.get(interaction.guildId);
    let vc = interaction.member.voice.channel;
    let playlist_identifier = interaction.options.getString('playlist');

    if (!vc) {
        return interaction.reply({ content: "You must be in a Voice Channel, I'm not gonna play this shit for no one.", ephemeral: true });
    }

    if (!playlist_identifier) {
        server.song_queue = shuffle(server.song_queue);
        return interaction.reply("Shuffled the remaining songs in the queue.");
    } else {
        let { err, songs } = DAL.getSongsByPlaylistIdentifier(playlist_identifier);

        if (err) {
            return interaction.reply({ content: "Unknown error occured while fetching playlist songs.", ephemeral: true });
        } else if (songs === undefined || songs.length == 0) {
            return interaction.reply({ content: "This playlist has no songs, you suck as a DJ.", ephemeral: true });
        }

        server.song_queue = shuffle(songs);
        UTIL.playAudio(interaction, vc, server);
    }
}
