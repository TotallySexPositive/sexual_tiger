import { SlashCommandBuilder } from 'discord.js';

import { EmbedBuilder } from 'discord.js';
import * as DAL from "../../dal";
import * as UTIL from "../../utils";
const fs = require('fs');
const path = require("path");
const asciitable = require("asciitable");

var options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "song_id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "num_plays", name: "Plays" }
    ],
};

export const data = new SlashCommandBuilder()
    .setName('song')
    .setDescription("Song management commands.")
    .addSubcommand(sub => sub
        .setName('current')
        .setDescription("Display the currently playing song's name and id."))
    .addSubcommand(sub => sub
        .setName('rename')
        .setDescription("Rename a song in the database.")
        .addIntegerOption(opt => opt.setName('id').setDescription('Song ID').setRequired(true))
        .addStringOption(opt => opt.setName('name').setDescription('New song name').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('delete')
        .setDescription("Delete a song from the database by ID.")
        .addIntegerOption(opt => opt.setName('id').setDescription('Song ID to delete').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('top')
        .setDescription("Get the most played songs in the database.")
        .addIntegerOption(opt => opt.setName('count').setDescription('Number of top songs (1-10, default 5)').setRequired(false)));

export async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'current') {
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
    } else if (subcommand === 'rename') {
        let song_id = interaction.options.getInteger('id');
        let new_name = interaction.options.getString('name');

        if (!UTIL.isInt(String(song_id))) {
            return interaction.reply({ content: 'You must provide the id of the song.', ephemeral: true });
        }
        if (UTIL.isInt(new_name)) {
            return interaction.reply({ content: 'New name must not be an integer.', ephemeral: true });
        }

        let { err, song } = DAL.findSongById(song_id);
        if (err) {
            console.log(err);
            return interaction.reply({ content: "Crashed while finding song.", ephemeral: true });
        } else if (song === undefined) {
            return interaction.reply({ content: "No song with that id exists.", ephemeral: true });
        } else {
            let old_name = song.name;
            song.name = new_name;
            let { err: u_err, info } = DAL.updateSong(song);
            if (u_err) {
                console.log(u_err);
                return interaction.reply({ content: "Crashed while updating song name.", ephemeral: true });
            } else if (info.changes === 0) {
                return interaction.reply({ content: "You didnt actually change the name, get some glasses.", ephemeral: true });
            } else {
                await interaction.reply(`${old_name} is now ${song.name}.`);
            }
        }
    } else if (subcommand === 'delete') {
        let server = global.servers.get(interaction.guildId);
        let song_id = interaction.options.getInteger('id');

        let user_is_super_admin = server.super_admins.includes(interaction.user.id);

        let { err, song } = DAL.findSongById(song_id);
        if (err) {
            console.log(err);
            return interaction.reply({ content: "Crashed while looking for that song.", ephemeral: true });
        } else if (song === undefined) {
            return interaction.reply({ content: "Thanks for wasting my time, there was not song by that id.", ephemeral: true });
        } else {
            if (interaction.user.id != song.added_by && !user_is_super_admin) {
                return interaction.reply({ content: "Hey, how about you dont be a twat and not try and delete other peoples uploads.", ephemeral: true });
            } else {
                let { err, info } = DAL.deleteSongById(song.song_id);
                if (err) {
                    if (err.message.includes("FOREIGN KEY")) {
                        let { err: pl_err, playlists } = DAL.getPlaylistsWithSong(song.song_id);
                        if (pl_err) {
                            console.log(pl_err);
                            return interaction.reply({ content: "We couldnt delete that song because it is currently on at least one playlist. But we crashed while retreiving those playlist.", ephemeral: true });
                        } else {
                            let playlists_str = "";
                            playlists.forEach((playlist) => {
                                playlists_str = playlists_str + `ID: ${playlist.playlist_id}    Name: ${playlist.name}\n`;
                            });
                            return interaction.reply({ content: `We couldnt delete that song because it is currently on the following playlist(s).\n\n${playlists_str}`, ephemeral: true });
                        }
                    } else {
                        console.log(err);
                        return interaction.reply({ content: "We couldnt delete that song and have no idea why not.", ephemeral: true });
                    }
                } else {
                    let gist_err = UTIL.rebuildAudioGist();
                    if (gist_err) {
                        console.log("Failed to update audio gist on song delete.");
                        console.log(gist_err);
                    }
                    let hashed_file = song.hash_id + ".mp3";
                    let stored_file = song.source;

                    fs.unlink(path.resolve(global.audio_dirs.get('hashed'), hashed_file), function (err3) {
                        if (err3) {
                            console.log("Failed to delete requested hashed file.");
                            console.log(err3);
                        }
                    });
                    fs.unlink(path.resolve(global.audio_dirs.get('stored'), stored_file), function (err3) {
                        if (err3) {
                            console.log("Failed to delete requested stored file.");
                            console.log(err3);
                        }
                    });
                    return interaction.reply(`${song.name} has been deleted from the database.`);
                }
            }
        }
    } else if (subcommand === 'top') {
        let top_n = interaction.options.getInteger('count') || 5;
        if (top_n > 10) top_n = 10;

        let { err, songs } = DAL.getTopSongs(top_n);
        if (err) {
            console.log(err);
            return interaction.reply({ content: "Failed to grab top songs", ephemeral: true });
        } else {
            let table = asciitable(options, songs);
            let chunks = UTIL.splitTable(table);
            await interaction.reply({ content: "```" + chunks[0] + "```" });
            for (let i = 1; i < chunks.length; i++) {
                await interaction.channel.send({ content: "```" + chunks[i] + "```" });
            }
        }
    }
}
