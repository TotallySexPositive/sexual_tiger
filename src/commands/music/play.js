import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import * as DAL from "../../dal";
import * as UTIL from "../../utils";
const asciitable = require("asciitable");

var options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "song_id", name: "ID" },
        { field: "name", name: "Name" }
    ],
};

export const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription("Play a song by name or ID.")
    .addStringOption(opt => opt
        .setName('song')
        .setDescription('Song name or ID to play')
        .setRequired(true));

export async function playSongByIdentifier(interaction, song_identifier) {
    var server = global.servers.get(interaction.guildId);
    let vc = interaction.member.voice.channel;

    if (!vc) {
        return interaction.reply({ content: "You must be in a Voice Channel, I'm not gonna play this shit for no one.", ephemeral: true });
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
            let table = asciitable(options, songs);
            let chunks = UTIL.splitTable(table);
            for (let i = 0; i < chunks.length; i++) {
                await interaction.channel.send({ content: "```" + chunks[i] + "```" });
            }
            return;
        }
    } else {
        found_song = song;
    }

    server.song_queue = [];
    server.song_queue.push(found_song);
    await interaction.reply({ 
      content: 'Done.', 
      flags: MessageFlags.Ephemeral 
    });
    UTIL.playAudio(interaction, vc, server);
}

export async function execute(interaction) {
    let song_identifier = interaction.options.getString('song');
    return playSongByIdentifier(interaction, song_identifier);
}
