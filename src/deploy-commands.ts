import { REST, Routes } from 'discord.js';
const path = require("path");
const fs = require("fs");
const auth = require(path.resolve('auth.json'));

function loadSlashCommands() {
    const commands = new Map();
    const commandDirs = ['admin', 'fun', 'misc', 'music'];

    for (const dir of commandDirs) {
        const dirPath = path.resolve(__dirname, "commands", dir);
        if (!fs.existsSync(dirPath)) continue;

        loadCommandsFromDir(dirPath, commands);
    }

    return commands;
}

function loadCommandsFromDir(dirPath: string, commands: Map<string, any>) {
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

async function main() {
    const guildId = process.argv[2];
    const commands = loadSlashCommands();
    const rest = new REST().setToken(auth.token);

    if (guildId) {
        await rest.put(
            Routes.applicationGuildCommands(auth.client_id, guildId),
            { body: Array.from(commands.values()).map(cmd => cmd.data.toJSON()) }
        );
        console.log(`Registered ${commands.size} commands in guild ${guildId}`);
    } else {
        await rest.put(
            Routes.applicationCommands(auth.client_id),
            { body: Array.from(commands.values()).map(cmd => cmd.data.toJSON()) }
        );
        console.log(`Globally registered ${commands.size} commands`);
    }
}

main().catch(console.error);
