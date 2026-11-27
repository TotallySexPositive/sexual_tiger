import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';
import { EmbedBuilder } from 'discord.js';
const fs = require('fs');
const path = require('path');
import { CustomNodeJsGlobal } from '../../types/CustomNodeJsGlobal';
declare const global: CustomNodeJsGlobal;

export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription("Displays general usage info for commands.")
    .addStringOption(opt => opt
        .setName('category')
        .setDescription('Command category to get help for')
        .setRequired(false)
        .addChoices(
            { name: 'admin', value: 'admin' },
            { name: 'fun', value: 'fun' },
            { name: 'misc', value: 'misc' },
            { name: 'music', value: 'music' }
        ));

export async function execute(interaction: ChatInputCommandInteraction) {
    const category = interaction.options.getString('category');

    if (!category) {
        const embed = new EmbedBuilder()
            .setTitle("Command Categories")
            .setColor(16312092)
            .setTimestamp();
        global.commandTypes.forEach((i: string) => {
            embed.addFields({ name: i, value: global.commandTypeDesc.get(i) || "" });
        });
        await interaction.reply({ embeds: [embed] });
    } else if (global.commandTypes.includes(category)) {
        const embed = new EmbedBuilder()
            .setTitle(`${category} Commands`)
            .setColor(global.commandTypeColor.get(category) || 0xFFFFFF)
            .setTimestamp();

        const p = path.resolve(__dirname, "..", category);
        try {
            const items = fs.readdirSync(p);
            let excess_commands = 0;
            for (const item of items) {
                if (item.endsWith('.js') || item.endsWith('.ts')) {
                    const script = path.resolve(p, item);
                    try {
                        delete require.cache[require.resolve(script)];
                        const temp = require(script);
                        if (temp.data) {
                            embed.addFields({ name: `/${temp.data.name}`, value: temp.data.description || "empty" });
                        }
                    } catch (err) {
                        excess_commands++;
                    }
                }
            }
            await interaction.reply({ embeds: [embed] });
            if (excess_commands > 0) {
                await interaction.followUp(`It looks like there were ${excess_commands} more commands we cant display here because we have too many fucking commands. Oops?`);
            }
        } catch (err) {
            console.error(err);
            await interaction.reply({ content: "Failed to load commands for that category.", ephemeral: true });
        }
    }
}
