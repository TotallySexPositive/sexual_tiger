import { SlashCommandBuilder } from 'discord.js';

const path = require("path");
const dir = require("node-dir");

export const data = new SlashCommandBuilder()
    .setName('reload')
    .setDescription("Refreshes a command so you can test changes.");

export async function execute(interaction) {
    dir.files(path.resolve("commands"), (err, files) => {
        if (err) console.error(err);
        files.forEach((filename) => {
            if (!filename.endsWith(".js")) return;
            delete require.cache[filename];
        });
    });
    interaction.reply({ content: `Reloaded all commands.` });
}
