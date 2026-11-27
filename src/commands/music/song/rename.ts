import type { ChatInputCommandInteraction } from 'discord.js';
import * as DAL from "../../../dal";
import * as UTIL from "../../../utils";

export async function execute(interaction: ChatInputCommandInteraction) {
    let song_id = interaction.options.getInteger('id')!;
    let new_name = interaction.options.getString('name')!;

    if (!UTIL.isInt(String(song_id))) {
        return interaction.reply({ content: 'You must provide the id of the song.', ephemeral: true });
    }
    if (UTIL.isInt(new_name)) {
        return interaction.reply({ content: 'New name must not be an integer.', ephemeral: true });
    }

    let result = DAL.findSongById(song_id) as any;
    if (result.err) {
        console.log(result.err);
        return interaction.reply({ content: "Crashed while finding song.", ephemeral: true });
    } else if (result.song === undefined) {
        return interaction.reply({ content: "No song with that id exists.", ephemeral: true });
    } else {
        let song = result.song;
        let old_name = song.name;
        song.name = new_name;
        let u_result = DAL.updateSong(song) as any;
        if (u_result.err) {
            console.log(u_result.err);
            return interaction.reply({ content: "Crashed while updating song name.", ephemeral: true });
        } else if (u_result.info.changes === 0) {
            return interaction.reply({ content: "You didnt actually change the name, get some glasses.", ephemeral: true });
        } else {
            await interaction.reply(`${old_name} is now ${song.name}.`);
        }
    }
}
