const path          = require("path");
const UTIL          = require(path.resolve("utils.js"))
const auth          = require(path.resolve('auth.json'));
var giphy           = require('giphy-api')(auth.giphy);
var request         = require('request');

exports.run = (client, message, args) => {
    var rand1   = Math.floor((Math.random() * 494) + 1); //494
    var rand2   = Math.floor((Math.random() * 494) + 1); //494
    var rand3   = Math.floor((Math.random() * 494) + 1); //494
	
    var src  = 'http://pokefusion.japeal.com/PKMColourV5.php?ver=3.2&p1='+rand1+'&p2='+rand2+ '&c=' + rand3 + '&e=noone';


    const puppeteer = require('puppeteer');

    let scrape = async () => {
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();

        await page.goto(src);
        const result = await page.evaluate(() => {
            let data_url = document.querySelector('#image1').src;

            return {
                data_url
            }
        });

        browser.close();
        return result;
    };

    scrape().then((value) => {
        const ImageDataURI  = require('image-data-uri');
        
        //ImageDataURI.outputFile(value.data_url, filePath);
        var data = ImageDataURI.decode(value.data_url)
        message.channel.send("", {"files": [data.dataBuffer]})
        .then(post => {
            //console.log("Posted?")
        })
        .catch(console.error);
        //console.log(value); // Success!
    });


}

exports.help = () =>{
    return "Grab a Random Pokemon from Pokemon Fusion";
};

exports.docs = () => {
    let docs = {
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
                code: `gif pokemon`
            }
        ]
    }
    return docs;
};