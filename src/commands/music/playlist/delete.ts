import type { ChatInputCommandInteraction } from 'discord.js';
import * as DAL from "../../../dal";

export async function execute(interaction: ChatInputCommandInteraction) {
    let identifier = interaction.options.getString('identifier')!;
    let playlist_id: any = undefined;

    if (DAL.isInt(identifier)) {
        playlist_id = identifier;
    } else {
        let result = DAL.findPlaylistByName(identifier) as any;
        if (result.err) {
            return interaction.reply({ content: `Sorry, ${interaction.user.username}, it seems something unexpected happened.`, ephemeral: true });
        } else if (result.playlist === undefined) {
            return interaction.reply({ content: `Sorry, ${interaction.user.username}, a playlist with that name doesn't exist.`, ephemeral: true });
        } else {
            playlist_id = result.playlist.playlist_id;
        }
    }

    let d_result = DAL.deletePlaylistById(playlist_id) as any;

    if (d_result.err) {
        await interaction.reply(`Sorry, ${interaction.user.username}, it seems something unexpected happened.`);
    } else if (d_result.info.changes == 0) {
        await interaction.reply(`Sorry, ${interaction.user.username}, but that playlist didn't exist.`);
    } else {
        await interaction.reply(`The playlist ${identifier} has been deleted, your DJ career is over, ${interaction.user.username}!`);
    }
}
