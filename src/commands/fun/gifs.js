import { SlashCommandBuilder } from 'discord.js';

const path = require("path");
const auth = require(path.resolve('auth.json'));
var giphy = require('giphy-api')(auth.giphy);
var request = require("request");

export const data = new SlashCommandBuilder()
    .setName('gifs')
    .setDescription("Grab a random image from Giphy with the requested search terms")
    .addStringOption(opt => opt
        .setName('search')
        .setDescription('Words to search for')
        .setRequired(true));

export async function execute(interaction) {
    const search = interaction.options.getString('search');
    await interaction.deferReply();

    giphy.search({
        q: search,
        limit: 1,
        offset: Math.floor(Math.random() * 200) + 1
    }, function (err, res) {
        if (err) {
            console.log(err);
            return interaction.editReply("Error while searching for gif.");
        } else {
            if (res.data && res.data.length) {
                request.head({
                    url: res.data[0].images.original.url,
                    method: "HEAD"
                }, function (err, response, body) {
                    let bytes = response.headers["content-length"];
                    if (bytes <= 8388119) {
                        return interaction.editReply({ files: [res.data[0].images.original.url] });
                    } else {
                        return interaction.editReply(res.data[0].images.original.url);
                    }
                });
            } else {
                return interaction.editReply("Couldnt find anything with those terms.");
            }
        }
    });
}
