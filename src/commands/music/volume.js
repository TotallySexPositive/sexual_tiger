import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('volume')
    .setDescription("Display or set the volume of the bot. Accepts input as 0-1 or 1-100.")
    .addIntegerOption(opt => opt
        .setName('level')
        .setDescription('Volume level (0-100)')
        .setRequired(false));

export async function execute(interaction) {
    let vc = interaction.member.voice.channel;
    if (!vc) {
        return interaction.reply({ content: "I'm not even in a channel.", ephemeral: true });
    }

    let server = global.servers[interaction.guildId];
    if (server.audioPlayer === undefined) {
        return interaction.reply({ content: "No audio is playing. You must be hearing things.", ephemeral: true });
    }

    let level = interaction.options.getInteger('level');
    if (level !== null) {
        if (level == 69) {
            await interaction.reply("Hehe nice.");
        }
        let req_vol = Math.round(((level > 1 ? level / 100.0 : level) + Number.EPSILON) * 100) / 100;

        if (req_vol > server.max_volume) {
            return interaction.reply({ content: `Your request for a volume of ${req_vol * 100}% is higher than the servers max volume of ${server.max_volume * 100}%`, ephemeral: true });
        } else if (req_vol < 0) {
            return interaction.reply({ content: `Your request for a volume of ${req_vol * 100}% is physically impossible, No.`, ephemeral: true });
        }

        server.volume = req_vol;
        await interaction.reply(`Set Volume: ${req_vol * 100}%`);
    } else {
        let current_volume = server.volume;
        return interaction.reply(`Current Volume: ${current_volume * 100}%. To set the volume, send a single number.`);
    }
}
