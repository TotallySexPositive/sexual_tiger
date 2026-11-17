import { SlashCommandBuilder } from 'discord.js';

const { Octokit } = require("@octokit/rest");
const path = require("path");
const auth = require(path.resolve('auth.json'));

export const data = new SlashCommandBuilder()
    .setName('issue')
    .setDescription("Creates a new issue on the Github tracker.")
    .addStringOption(option => option.setName('description').setDescription("Issue title/description").setRequired(true));

export async function execute(interaction) {
    let valid_users = {
        "231574835694796801": auth.github_token,
        "231606224909500418": auth.github_token,
        "183388696207294465": auth.github_steve
    };
    let token = valid_users[interaction.user.id];
    if (!valid_users[interaction.user.id]) {
        return interaction.reply({ content: "I dont know who you are.  You are the issue!" });
    }

    let description = interaction.options.getString('description');

    const octokit = new Octokit({ auth: token });

    let payload = {};
    payload.owner = "narayanjr";
    payload.repo = "sexual_tiger";
    payload.title = description;

    octokit.issues.create(payload, (error, result) => {
        if (error) {
            console.log(error);
            interaction.reply({ content: "Errored out while POSTing issue." });
        } else {
            interaction.reply({ content: `Issue #${result.data.number} Title: ${result.data.title}  has been created` });
        }
    });
}
