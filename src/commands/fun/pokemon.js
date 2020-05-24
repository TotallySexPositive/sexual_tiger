const path          = require("path");
const auth          = require(path.resolve('auth.json'));
var giphy           = require('giphy-api')(auth.giphy);
var request         = require('request');

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('pokemon').startTimer()
    var rand1   = Math.floor((Math.random() * 867) + 1); //494
    var rand2   = Math.floor((Math.random() * 867) + 1); //494
	
    //var src     = `https://japeal.com/wordpress/wp-content/themes/total/PKM/EHF.php?type=all&p1=${rand1}&p2=${rand2}`
    var src     = "https://japeal.com/pkm/"
    const puppeteer = require('puppeteer');

    (async () => {
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        const navigationPromise = page.waitForNavigation();

        await page.goto(src),
        await page.click("#fbutton"),
        await navigationPromise,
        x = await page.evaluate( () => {
            console.log("In the function")
            var multiplier = 1;
            var combined = document.getElementById("canvas_download");
            var ctx = combined.getContext("2d");
            var combinedX2 = document.getElementById('canvasShake');
            combined.width = combinedX2.width;
            combined.height = combinedX2.height;

            var combinedGC = document.getElementById("canvas_GlowCurrent");
            var tempvar80 = combinedGC.width - combined.width;
            tempvar80 = tempvar80 / 2;
            console.log("In the function")

            combined.width = combinedX2.width * multiplier;
            combined.height = combinedX2.height * multiplier;

            combined.imageSmoothingEnabled = false;
            combined.mozImageSmoothingEnabled = false;
            combined.globalCompositeOperation = "source-over";

            ctx.drawImage(combinedX2, 0, 0, combinedX2.width * multiplier, combinedX2.height * multiplier);

            var combinedL1 = document.getElementById("canvas_SSJ2Lightning");
            ctx.drawImage(combinedL1, 0, 0, combinedL1.width * multiplier, combinedL1.height * multiplier);
            console.log("In the function")

            var imageDL = document.getElementById("canvas_download").toDataURL("image/png").replace("image/png", "image/octet-stream");
            console.log(imageDL)
            return Promise.resolve(imageDL);
          });
        
        //await browser.close();
        console.log(x)
    })();
    end()
}

exports.help = () =>{
    return "Grab a Random Pokemon from Pokemon Fusion";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "pokemon",
        command: "pokemon",
        description: "Create a Pocket Monster",
        syntax: 'pokemon',
        examples: [
            {
                description: "Conjure a Pocket Monster",
                code: `pokemon`
            }
        ]
    }
    return docs;
};