import type { ChatInputCommandInteraction } from 'discord.js';
import * as DAL from "../../../dal";
import * as UTIL from "../../../utils";
import asciitable from "asciitable";

const options = {
    skinny: true,
    intersectionCharacter: "+",
    columns: [
        { field: "song_id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "num_plays", name: "Plays" }
    ],
};

export async function execute(interaction: ChatInputCommandInteraction) {
    let top_n = interaction.options.getInteger('count') || 5;
    if (top_n > 10) top_n = 10;

    let result = DAL.getTopSongs(top_n) as any;
    if (result.err) {
        console.log(result.err);
        return interaction.reply({ content: "Failed to grab top songs", ephemeral: true });
    } else {
        let table = asciitable(options, result.songs);
        let chunks = UTIL.splitTable(table);
        await interaction.reply({ content: "```" + chunks[0] + "```" });
        for (let i = 1; i < chunks.length; i++) {
            await (interaction.channel as any).send({ content: "```" + chunks[i] + "```" });
        }
    }
}
