import { SlashCommandBuilder } from 'discord.js';

import * as UTIL from "../../utils";
import * as TTS from 'google-tts-api';

export const data = new SlashCommandBuilder()
    .setName('tts')
    .setDescription("Converts Text to Speech using Google API.")
    .addStringOption(opt => opt
        .setName('text')
        .setDescription('Text to convert to speech')
        .setRequired(true))
    .addStringOption(opt => opt
        .setName('language')
        .setDescription('Language code (e.g. en-US, fr, ja)')
        .setRequired(false))
    .addBooleanOption(opt => opt
        .setName('slow')
        .setDescription('Speak slowly')
        .setRequired(false));

export async function execute(interaction) {
    const text = interaction.options.getString('text');
    const lang = interaction.options.getString('language') || 'en-US';
    const slow = interaction.options.getBoolean('slow') || false;

    let vc = interaction.member.voice.channel;
    if (!vc) {
        return interaction.reply({ content: "You must be in a Voice Channel, I'm not gonna play this shit for no one.", ephemeral: true });
    }

    const url = TTS.getAudioUrl(text, { lang: lang, slow: slow });
    UTIL.playUrl(url, interaction, vc);
}
