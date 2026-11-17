import { SlashCommandBuilder } from 'discord.js';


export const data = new SlashCommandBuilder()
    .setName('pokemon')
    .setDescription("Create a Pocket Monster");

export async function execute(interaction) {
    await interaction.deferReply();

    try {
        var rand1 = Math.floor((Math.random() * 867) + 1);
        var rand2 = Math.floor((Math.random() * 867) + 1);
        var src = "https://japeal.com/pkm/";
        const puppeteer = require('puppeteer');

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const navigationPromise = page.waitForNavigation();

        await page.goto(src);
        await page.click("#fbutton");
        await navigationPromise;

        let imageDL = await page.evaluate(() => {
            var multiplier = 1;
            var combined = document.getElementById("canvas_download");
            var ctx = combined.getContext("2d");
            var combinedX2 = document.getElementById('canvasShake');
            combined.width = combinedX2.width;
            combined.height = combinedX2.height;

            var combinedGC = document.getElementById("canvas_GlowCurrent");
            var tempvar80 = combinedGC.width - combined.width;
            tempvar80 = tempvar80 / 2;

            combined.width = combinedX2.width * multiplier;
            combined.height = combinedX2.height * multiplier;

            combined.imageSmoothingEnabled = false;
            combined.mozImageSmoothingEnabled = false;
            combined.globalCompositeOperation = "source-over";

            ctx.drawImage(combinedX2, 0, 0, combinedX2.width * multiplier, combinedX2.height * multiplier);

            var combinedL1 = document.getElementById("canvas_SSJ2Lightning");
            ctx.drawImage(combinedL1, 0, 0, combinedL1.width * multiplier, combinedL1.height * multiplier);

            return document.getElementById("canvas_download").toDataURL("image/png").replace("image/png", "image/octet-stream");
        });

        await browser.close();

        const fs = require('fs');
        const path = require('path');
        let tmpPath = path.resolve(global.image_dirs.get('tmp'), `pokemon_${Date.now()}.png`);
        let base64Data = imageDL.replace(/^data:image\/\w+;base64,/, "");
        fs.writeFileSync(tmpPath, Buffer.from(base64Data, 'base64'));

        await interaction.editReply({ files: [tmpPath] });
    } catch (err) {
        console.error(err);
        await interaction.editReply("Failed to create Pokemon fusion.");
    }
}
