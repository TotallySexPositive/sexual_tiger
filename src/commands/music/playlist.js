import { SlashCommandBuilder } from 'discord.js';

import * as DAL from "../../dal";
import * as UTIL from "../../utils";
const asciitable = require("asciitable");

var playlists_options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "playlist_id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "num_songs", name: "# Songs" }
    ],
};

var songs_options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "song_id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "num_plays", name: "plays" }
    ],
};

export const data = new SlashCommandBuilder()
    .setName('playlist')
    .setDescription("Manage playlists.")
    .addSubcommand(sub => sub
        .setName('create')
        .setDescription("Create a new playlist.")
        .addStringOption(opt => opt.setName('name').setDescription('Playlist name').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('add')
        .setDescription("Add song(s) to a playlist.")
        .addStringOption(opt => opt.setName('playlist').setDescription('Playlist ID or name').setRequired(true))
        .addStringOption(opt => opt.setName('songs').setDescription('Song IDs/names (comma separated)').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('remove')
        .setDescription("Remove song(s) from a playlist.")
        .addStringOption(opt => opt.setName('playlist').setDescription('Playlist ID or name').setRequired(true))
        .addStringOption(opt => opt.setName('songs').setDescription('Song IDs/names (comma separated)').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('list')
        .setDescription("List all playlists or songs in a playlist.")
        .addStringOption(opt => opt.setName('playlist').setDescription('Playlist ID/name to list songs. Omit for all playlists.').setRequired(false)))
    .addSubcommand(sub => sub
        .setName('delete')
        .setDescription("Delete a playlist by ID or name.")
        .addStringOption(opt => opt.setName('identifier').setDescription('Playlist ID or name').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('play')
        .setDescription("Play a playlist by identifier.")
        .addStringOption(opt => opt.setName('playlist').setDescription('Playlist ID or name').setRequired(true)));

export async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'create') {
        let name = interaction.options.getString('name');
        if (DAL.isInt(name)) {
            return interaction.reply({ content: "Playlist names can not be Integers. Just because.", ephemeral: true });
        }

        let { err, info } = DAL.createPlaylist(name, interaction.user.id);

        if (err && err.message.indexOf("UNIQUE") > -1) {
            await interaction.reply(`There is already a Playlist with the name, ${name}`);
        } else if (err) {
            console.log(err);
            await interaction.reply(`Sorry, ${interaction.user.username}, it seems something unexpected happened.`);
        } else {
            await interaction.reply(`The playlist ID: ${info.lastInsertRowid} Name: ${name} has been created, You're the DJ ${interaction.user.username}!`);
        }
    } else if (subcommand === 'add') {
        let playlist_identifier = interaction.options.getString('playlist');
        let song_identifiers = interaction.options.getString('songs').split(',').map(s => s.trim());

        let { err: p_err, playlist } = DAL.findPlaylistByIdentifier(playlist_identifier);
        if (p_err) return interaction.reply({ content: `Oops, issue trying to find the specified playlist, ${p_err.message}`, ephemeral: true });
        if (playlist === undefined) return interaction.reply({ content: `The specified playlist doesnt exist.`, ephemeral: true });

        let skipped_songs = [];
        let added_songs = [];

        for (let identifier of song_identifiers) {
            let { err: s_err, song } = DAL.findSongByIdentifier(identifier);
            if (s_err) {
                skipped_songs.push(`X_X: ${identifier}`);
                console.log(s_err);
            } else if (song === undefined) {
                skipped_songs.push(`DNE: ${identifier}`);
            } else {
                let { err, info } = DAL.addToPlaylist(playlist.playlist_id, song.song_id);
                if (err) {
                    console.log(err);
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
    } else if (subcommand === 'remove') {
        let playlist_identifier = interaction.options.getString('playlist');
        let song_identifiers = interaction.options.getString('songs').split(',').map(s => s.trim());

        let { err: p_err, playlist } = DAL.findPlaylistByIdentifier(playlist_identifier);
        if (p_err) return interaction.reply({ content: `Oops, issue trying to find the specified playlist, ${p_err.message}`, ephemeral: true });
        if (playlist === undefined) return interaction.reply({ content: `The specified playlist doesnt exist.`, ephemeral: true });

        let skipped_songs = [];
        let removed_songs = [];

        for (let identifier of song_identifiers) {
            let { err: s_err, song } = DAL.findSongByIdentifier(identifier);
            if (s_err) {
                skipped_songs.push(`X_X: ${identifier}`);
                console.log(s_err);
            } else if (song === undefined) {
                skipped_songs.push(`DNE: ${identifier}`);
            } else {
                let { err, info } = DAL.removeFromPlaylist(playlist.playlist_id, song.song_id);
                if (err) {
                    console.log(err);
                    skipped_songs.push(`X_X: ${song.song_id}: ${song.name}`);
                } else if (!info.changes) {
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
    } else if (subcommand === 'list') {
        let playlist_identifier = interaction.options.getString('playlist');

        if (!playlist_identifier) {
            let { err, playlists } = DAL.getPlaylists();
            if (err) {
                return interaction.reply({ content: `Sorry, ${interaction.user.username}, it seems something unexpected happened.`, ephemeral: true });
            } else {
                let table = asciitable(playlists_options, playlists);
                await interaction.reply({ content: "```" + table + "```", split: true });
            }
        } else {
            let { err, songs } = DAL.getSongsByPlaylistIdentifier(playlist_identifier);
            if (err) {
                return interaction.reply({ content: `Sorry, ${interaction.user.username}, it seems something unexpected happened.`, ephemeral: true });
            } else {
                let table = asciitable(songs_options, songs);
                await interaction.reply({ content: "```" + table + "```", split: true });
            }
        }
    } else if (subcommand === 'delete') {
        var identifier = interaction.options.getString('identifier');
        let playlist_id = undefined;

        if (DAL.isInt(identifier)) {
            playlist_id = identifier;
        } else {
            var { err, playlist } = DAL.findPlaylistByName(identifier);
            if (err) {
                return interaction.reply({ content: `Sorry, ${interaction.user.username}, it seems something unexpected happened.`, ephemeral: true });
            } else if (playlist === undefined) {
                return interaction.reply({ content: `Sorry, ${interaction.user.username}, a playlist with that name doesn't exist.`, ephemeral: true });
            } else {
                playlist_id = playlist.playlist_id;
            }
        }

        var { err, info } = DAL.deletePlaylistById(playlist_id);

        if (err) {
            await interaction.reply(`Sorry, ${interaction.user.username}, it seems something unexpected happened.`);
        } else if (info.changes == 0) {
            await interaction.reply(`Sorry, ${interaction.user.username}, but that playlist didn't exist.`);
        } else {
            await interaction.reply(`The playlist ${identifier} has been deleted, your DJ career is over, ${interaction.user.username}!`);
        }
    } else if (subcommand === 'play') {
        let server = global.servers[interaction.guildId];
        let vc = interaction.member.voice.channel;

        if (!vc) {
            return interaction.reply({ content: "You must be in a Voice Channel, I'm not gonna play this shit for no one.", ephemeral: true });
        }

        let playlist_identifier = interaction.options.getString('playlist');
        let { err, songs } = DAL.getSongsByPlaylistIdentifier(playlist_identifier);

        if (err) {
            return interaction.reply({ content: "Unknown error occured while fetching playlist songs.", ephemeral: true });
        } else if (songs === undefined || songs.length == 0) {
            return interaction.reply({ content: "This playlist has no songs, you suck as a DJ.", ephemeral: true });
        }

        server.song_queue = songs;
        UTIL.playAudio(interaction, vc, server);
    }
}
