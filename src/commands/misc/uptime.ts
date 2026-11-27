import { SlashCommandBuilder } from 'discord.js';
import type { ChatInputCommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('uptime')
    .setDescription("Display how long the bot has been up.");

function timeConversion(millisec: number) {
    const secs: number = Math.floor(millisec / 1000);
    let days: string = (Math.floor(secs / 86400)).toFixed(0);
    let hours: string = (Math.floor(secs / 3600) % 24).toFixed(0);
    let minutes: string = (Math.floor(secs / 60) % 60).toFixed(0);
    let seconds: string = (secs % 60).toFixed(0);
    seconds = seconds.padStart(2, "0");
    minutes = minutes.padStart(2, "0");
    hours = hours.padStart(2, "0");
    days = days.padStart(2, "0");

    return `${days} days ${hours}:${minutes}:${seconds}`;
}

export async function execute(interaction: ChatInputCommandInteraction) {
    const time = timeConversion(interaction.client.uptime);
    await interaction.reply(`I've been up for ${time}!`);
}
