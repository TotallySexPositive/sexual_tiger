import { Server } from "./types/Server";
import { execute as build_table } from "./commands/admin/build_table";
import { handleSearchButton, handleSearchModal } from "./commands/music/search";
import { handlePlaylistListButton, handlePlaylistListSelect, handlePlaylistListModal } from "./commands/music/playlist/list";
const path = require("path");
const fs = require("fs");
import { Client, GatewayIntentBits, Collection, ChannelType, REST, Routes } from 'discord.js';
const Sanitize = require('sanitize-filename');
const auth = require(path.resolve('auth.json'));
const config = require(path.resolve('configure.json'));
import * as UTIL from "./utils.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

import { CustomNodeJsGlobal } from "./types/CustomNodeJsGlobal";
import { Snowflake } from "discord.js";
import { Tag } from "./types/Tag";

declare const global: CustomNodeJsGlobal;
global.servers = new Map();
global.commandTypes = ["admin", "fun", "misc", "music"];
global.commandTypeDesc = new Map();
global.commandTypeDesc.set("admin", "Admin controls to assist in maintaining the bot.");
global.commandTypeDesc.set("fun", "Random shit that lets you express yourself.");
global.commandTypeDesc.set("misc", "Random shit that may or may not be worth using");
global.commandTypeDesc.set("music", "Lets you play music and interact with music things");

global.commandTypeColor = new Map();
global.commandTypeColor.set("admin", 13632027);
global.commandTypeColor.set("fun", 12390624);
global.commandTypeColor.set("misc", 1);
global.commandTypeColor.set("music", 5301186);

global.audio_dirs = new Map();
global.audio_dirs.set("tmp", path.resolve("audio", "tmp"));
global.audio_dirs.set("hashed", path.resolve("audio", "hashed"));
global.audio_dirs.set("stored", path.resolve("audio", "stored"));
global.audio_dirs.set("uploaded", path.resolve("audio", "uploaded"));

global.image_dirs = new Map();
global.image_dirs.set("tmp", path.resolve("images", "tmp"));
global.image_dirs.set("hashed", path.resolve("images", "hashed"));
global.image_dirs.set("trash", path.resolve("images", "trash"));

global.img_resp_to_tag = new Map<Snowflake, Tag>();
global.img_resp_to_tag_order = [];
global.img_resp_to_tag_max_len = 100;
global.clip_length = 30;

const required_folders = [
    path.resolve("audio"),
    path.resolve("audio", "tmp"),
    path.resolve("audio", "hashed"),
    path.resolve("audio", "stored"),
    path.resolve("audio", "uploaded"),
    path.resolve("images"),
    path.resolve("images", "tmp"),
    path.resolve("images", "hashed"),
    path.resolve("images", "trash"),
];

required_folders.forEach(function (dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Created missing directory: ${dir}`);
        fs.mkdirSync(dir);
    }
});

build_table();
UTIL.updateCommandList();

const commands = new Collection<string, any>();

function loadSlashCommands() {
    const commandDirs = ['admin', 'fun', 'misc', 'music'];

    for (const dir of commandDirs) {
        const dirPath = path.resolve(__dirname, "commands", dir);
        if (!fs.existsSync(dirPath)) continue;

        loadCommandsFromDir(dirPath, commands);
    }
}

function loadCommandsFromDir(dirPath: string, commands: Collection<string, any>) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            loadCommandsFromDir(fullPath, commands);
        } else if (entry.name.endsWith('.js') || entry.name.endsWith('.ts')) {
            try {
                delete require.cache[require.resolve(fullPath)];
                const commandModule = require(fullPath);

                if (commandModule.data && commandModule.execute) {
                    commands.set(commandModule.data.name, commandModule);
                }
            } catch (err) {
                console.error(`Failed to load command ${fullPath}:`, (err as Error).message);
            }
        }
    }
}

async function registerSlashCommands() {
    const rest = new REST().setToken(auth.token);
    await rest.put(Routes.applicationCommands(client.user!.id), { body: [] });

    for (const guild of client.guilds.cache.values()) {
        try {
            await rest.put(
                Routes.applicationGuildCommands(client.user!.id, guild.id),
                { body: commands.map(cmd => cmd.data.toJSON()) }
            );
            console.log(`Registered ${commands.size} commands in ${guild.name}`);
        } catch (error) {
            console.error(`Failed to register commands in ${guild.name}:`, error);
        }
    }
}

loadSlashCommands();

client.on('clientReady', async () => {
    console.log(`Logged in as ${client.user?.tag}`);
    client.user?.setPresence({ activities: [{ name: 'pick up sticks.' }] });

    await registerSlashCommands();

    for (const guild of client.guilds.cache.values()) {
        global.servers.set(guild.id, new Server());
        try {
            const members = await guild.members.fetch();
            UTIL.updateMembersList(members);
        } catch (e) { console.error(e); }
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {});
        }
    } else if (interaction.isButton() && interaction.customId.startsWith('search_')) {
        try {
            await handleSearchButton(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {});
        }
    } else if (interaction.isButton() && interaction.customId.startsWith('playlist_list_')) {
        try {
            await handlePlaylistListButton(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {});
        }
    } else if (interaction.isStringSelectMenu() && interaction.customId.startsWith('playlist_list_')) {
        try {
            await handlePlaylistListSelect(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {});
        }
    } else if (interaction.isModalSubmit() && interaction.customId.startsWith('search_')) {
        try {
            await handleSearchModal(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {});
        }
    } else if (interaction.isModalSubmit() && interaction.customId.startsWith('playlist_list_')) {
        try {
            await handlePlaylistListModal(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred.', ephemeral: true }).catch(() => {});
        }
    }
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(
        ch => ch.name === 'general' && ch.type === ChannelType.GuildText
    ) as any;
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);
});

client.login(auth.token);
