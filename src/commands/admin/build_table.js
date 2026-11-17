import { SlashCommandBuilder } from 'discord.js';

const fs = require("fs");
let Database = require('better-sqlite3');
let DB = new Database('playlists.sql');

export const data = new SlashCommandBuilder()
    .setName('build_table')
    .setDescription("Builds the sql table structure for first time setup.");

export async function execute(interaction) {
    const build_it = fs.readFileSync('build.sql', 'utf8');
    DB.exec(build_it);
    DB.close();
}
