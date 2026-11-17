import { SlashCommandBuilder } from 'discord.js';

import * as DAL from "../../dal";
const asciitable = require("asciitable");

var options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "song_id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "num_plays", name: "plays" }
    ],
};

export const data = new SlashCommandBuilder()
    .setName('queue')
    .setDescription("Queue a song by name or ID, or view the queue.")
    .addStringOption(opt => opt
        .setName('song')
        .setDescription('Song name or ID to queue. Omit to view queue.')
        .setRequired(false));

export async function execute(interaction) {
    var server = global.servers[interaction.guildId];
    let vc = interaction.member.voice.channel;

    if (!vc) {
        return interaction.reply({ content: "You must be in a Voice Channel, I'm not gonna play this shit for no one.", ephemeral: true });
    }

    let song_identifier = interaction.options.getString('song');
    if (!song_identifier) {
        if (server.song_queue.length) {
            await interaction.reply({ content: "```" + asciitable(options, server.song_queue) + "```", split: true });
            return interaction.followUp("If you wish to add a song to the queue, use /queue with a song name or id.");
        } else {
            return interaction.reply({ content: "There are no songs in the queue.", ephemeral: true });
        }
    }

    let found_song = undefined;
    let { err, song } = DAL.findSongByIdentifier(song_identifier);

    if (err) {
        return interaction.reply({ content: "An error occured while searching for song.", ephemeral: true });
    } else if (song === undefined) {
        let { err: err_s, songs } = DAL.searchForSongs(song_identifier, 15);
        if (err_s) {
            return interaction.reply({ content: "We crashed while searching for similar songs.", ephemeral: true });
        } else if (songs === undefined || songs.length === 0) {
            return interaction.reply({ content: "There is no song by that name/id, and couldnt find any close matches.", ephemeral: true });
        } else if (songs.length === 1) {
            found_song = songs[0];
        } else {
            await interaction.reply("That song didnt exist and we found several close matches. Pick one to play.");
            return interaction.followUp({ content: "```" + asciitable(options, songs) + "```", split: true });
        }
    } else {
        found_song = song;
    }

    server.song_queue.push(found_song);
    await interaction.reply(`Queued: ${found_song.name}`);
}
