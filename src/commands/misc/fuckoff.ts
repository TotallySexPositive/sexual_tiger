import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { CustomNodeJsGlobal } from "../../types/CustomNodeJsGlobal";
declare const global: CustomNodeJsGlobal;

export const data = new SlashCommandBuilder()
    .setName('fuckoff')
    .setDescription("Removes the bot from the voice channel at all costs");

export async function execute(interaction: ChatInputCommandInteraction) {
    const server = interaction.guildId ? global.servers.get(interaction.guildId) : undefined;

    if (!server) {
        await interaction.reply("No, You Fuck Off!");
        return;
    }

    if (server.voiceConnection != null) {
        server.song_queue.length = 0;
        server.audioPlayer?.stop();
        server.voiceConnection.destroy();
        await interaction.reply(":cry:");
    } else {
        await interaction.reply("No, You Fuck Off!");
    }
}
