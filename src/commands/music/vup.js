import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('vup')
    .setDescription("Turn up the volume the bot is playing at.");

export async function execute(interaction) {
    var server = global.servers.get(interaction.guildId);
    let vc = interaction.member.voice.channel;

    if (!vc) {
        return interaction.reply({ content: "You must be in a Voice Channel to change the volume.", ephemeral: true });
    }

    let higher_volume = server.volume * 2;

    if (higher_volume > server.max_volume) {
        await interaction.reply("This is plenty loud enough.");
    } else {
        server.volume = higher_volume;
        await interaction.reply(`Raised volume: ${server.volume * 100}%`);
    }
}
