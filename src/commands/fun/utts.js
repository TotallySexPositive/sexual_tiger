import { SlashCommandBuilder } from 'discord.js';

import * as UTIL from "../../utils";
const path = require("path");
const auth = require(path.resolve('auth.json'));

export const data = new SlashCommandBuilder()
    .setName('utts')
    .setDescription("Uberduck text to speech with character voices.")
    .addStringOption(opt => opt
        .setName('text')
        .setDescription('Text to convert to speech')
        .setRequired(true))
    .addStringOption(opt => opt
        .setName('voice')
        .setDescription('Voice name (e.g. strong-bad, spongebob)')
        .setRequired(false));

export async function execute(interaction) {
    const text = interaction.options.getString('text');
    const voiceName = interaction.options.getString('voice') || 'strong-bad';

    let vc = interaction.member.voice.channel;
    if (!vc) {
        return interaction.reply({ content: "You must be in a Voice Channel, I'm not gonna play this shit for no one.", ephemeral: true });
    }

    try {
        const { getAudioUrl } = require("uberduck-api");
        const url = await getAudioUrl(text, voiceName);
        UTIL.playUrl(url, interaction, vc);
    } catch (err) {
        console.error(err);
        return interaction.reply({ content: "Error generating speech.", ephemeral: true });
    }
}
