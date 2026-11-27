import { SlashCommandBuilder } from 'discord.js';

const path = require("path");
const auth = require(path.resolve('auth.json'));
var giphy = require('giphy-api')(auth.giphy);
var request = require("request");

export const data = new SlashCommandBuilder()
    .setName('gif')
    .setDescription("Grab a random image from Giphy with the specified tags, or completely random if no tags")
    .addStringOption(opt => opt
        .setName('tags')
        .setDescription('Search tags for the gif')
        .setRequired(false));

export async function execute(interaction) {
    const tags = interaction.options.getString('tags');
    await interaction.deferReply();

    giphy.random(tags || "", function (err, res) {
        if (err) {
            console.log(err);
            return interaction.editReply("Error while searching for gif.");
        } else {
            if (res.data && res.data.images && res.data.image_original_url) {
                request.head({
                    url: res.data.image_original_url,
                    method: "HEAD"
                }, function (err, response, body) {
                    let bytes = response.headers["content-length"];
                    if (bytes <= 8388119) {
                        return interaction.editReply({ files: [res.data.image_original_url] });
                    } else {
                        return interaction.editReply(res.data.image_original_url);
                    }
                });
            } else {
                return interaction.editReply("Couldnt find anything with those tags.");
            }
        }
    });
}
