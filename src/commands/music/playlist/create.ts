import type { ChatInputCommandInteraction } from 'discord.js';
import * as DAL from "../../../dal";

export async function execute(interaction: ChatInputCommandInteraction) {
    let name = interaction.options.getString('name')!;
    if (DAL.isInt(name)) {
        return interaction.reply({ content: "Playlist names can not be Integers. Just because.", ephemeral: true });
    }

    let result = DAL.createPlaylist(name, interaction.user.id) as any;
    let err = result.err;
    let info = result.info;

    if (err && err.message.indexOf("UNIQUE") > -1) {
        await interaction.reply(`There is already a Playlist with the name, ${name}`);
    } else if (err) {
        console.log(err);
        await interaction.reply(`Sorry, ${interaction.user.username}, it seems something unexpected happened.`);
    } else {
        await interaction.reply(`The playlist ID: ${info.lastInsertRowid} Name: ${name} has been created, You're the DJ ${interaction.user.username}!`);
    }
}
