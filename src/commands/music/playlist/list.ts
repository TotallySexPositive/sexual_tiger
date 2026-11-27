import type { ChatInputCommandInteraction } from 'discord.js';
import * as DAL from "../../../dal";
import * as UTIL from "../../../utils";
import asciitable from "asciitable";

const playlists_options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "playlist_id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "num_songs", name: "# Songs" }
    ],
};

const songs_options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "song_id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "num_plays", name: "plays" }
    ],
};

export async function execute(interaction: ChatInputCommandInteraction) {
    let playlist_identifier = interaction.options.getString('playlist');

    if (!playlist_identifier) {
        let result = DAL.getPlaylists() as any;
        if (result.err) {
            return interaction.reply({ content: `Sorry, ${interaction.user.username}, it seems something unexpected happened.`, ephemeral: true });
        } else {
            let table = asciitable(playlists_options, result.playlists);
            let chunks = UTIL.splitTable(table);
            await interaction.reply({ content: "```" + chunks[0] + "```" });
            for (let i = 1; i < chunks.length; i++) {
                await (interaction.channel as any).send({ content: "```" + chunks[i] + "```" });
            }
        }
    } else {
        let result = DAL.getSongsByPlaylistIdentifier(playlist_identifier) as any;
        if (result.err) {
            return interaction.reply({ content: `Sorry, ${interaction.user.username}, it seems something unexpected happened.`, ephemeral: true });
        } else {
            let table = asciitable(songs_options, result.songs);
            let chunks = UTIL.splitTable(table);
            await interaction.reply({ content: "```" + chunks[0] + "```" });
            for (let i = 1; i < chunks.length; i++) {
                await (interaction.channel as any).send({ content: "```" + chunks[i] + "```" });
            }
        }
    }
}
