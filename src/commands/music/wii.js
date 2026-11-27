import { SlashCommandBuilder, MessageFlags } from 'discord.js';

import * as DAL from "../../dal";
import * as UTIL from "../../utils";

export const data = new SlashCommandBuilder()
    .setName('wii')
    .setDescription("Induce anxiety by playing some Wii music......");

export async function execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    let server = global.servers.get(interaction.guildId);
    let vc = interaction.member.voice.channel;

    if (!vc) {
        return interaction.editReply({ content: "You must be in a Voice Channel, I'm not gonna play this shit for no one.", ephemeral: true });
    }

    let anxiety = [2058, 2059, 2117, 2328, 2329, 2331, 2332, 2333, 2334];
    let song_identifier = anxiety[anxiety.length * Math.random() | 0];

    let { err, song } = DAL.findSongByIdentifier(song_identifier);

    if (err) {
        return interaction.editReply({ content: "An error occured while searching for song.", ephemeral: true });
    } else if (song === undefined) {
        return interaction.editReply({ content: "Wii broke because it couldnt find an internally defined id. Oops?", ephemeral: true });
    } else {
        server.song_queue = [];
        server.song_queue.push(song);
        UTIL.playAudio(interaction, vc, server);
        await interaction.deleteReply();
    }
}
