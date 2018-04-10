const path          = require("path")
const fs            = require('fs');
const DAL           = require(path.resolve("dal.js"))
const UTIL          = require(path.resolve("utils.js"))
var Scraper         = require ('images-scraper')
  , google          = new Scraper.Google();
const download      = require('image-downloader')
const parser        = require('yargs-parser')
var randomstring    = require("randomstring");
const readChunk     = require('read-chunk');
const imageType     = require('image-type');

var opts = {
    alias: {
        tag: ['t'],
        search: ['s'],
    },
    configuration: {
        'short-option-groups': false
    }
}

exports.run = (client, message, args) => {
    let arg_string = message.content.slice(10); //Chop off $grab_pics
    var argv = parser(arg_string.replace(/= +/g, "="), opts)

    if(!argv.s || !argv.t || argv.t.indexOf(" ") > -1) {
        return message.channel.send('You must provide a tag and a search term. Tag must be one word only. EX: $grab_pics -t pout -s "anime pout"')
    }

    google.list({
        keyword: argv.s,
        num: 100,
        detail: true,
        nightmare: {
            show: true
        },
        advanced: {
            imgType: ":animated"
        }
    })
    .then(function (res) {
        res.forEach((thing) => {
            const options = {
                url: thing.url,
                dest: path.resolve("images", "tmp", randomstring.generate() + ".gif")
            };

            download.image(options)
            .then(({ filename, image }) => {
                //Verify the thing we downloaded was even an image.
                const buffer    = readChunk.sync(filename, 0, 12);
                let image_type  = imageType(buffer);

                if(image_type === undefined || image_type === null || !image_type.mime.includes("image")) {
                    console.log(`Skipped file ${filename} because it wasnt an image.`);
                } else {//Ok it was an image, lets check its size
                    let size = UTIL.getFileSizeInMegaBytes(filename);
                    if(size > 8) { //Size exceeds discords upload limit, trash it.
                        console.log(`Skipped file ${filename} because it was too big.`);
                        fs.unlink(filename, function(err3) {
                            if(err3) {
                                console.log("Failed to delete image that was too big")
                                console.log(err3);
                            }
                        })
                    } else { //Image was small enough to upload to discord
                        //Correct extension on file because I arbitrarily assigned .gif to make sure the download always works
                        let filename_no_ext     = filename.replace(/\.[^/.]+$/, "")
                        let corrected_filename  = `${filename_no_ext}.${image_type.ext}`

                        fs.rename(filename, corrected_filename, (err) => {
                            if(err) {
                                console.log(`Failed to rename file, ${filename} to ${corrected_filename}`);
                                console.log(err);
                            } else {                                 
                                let i_err = UTIL.processImageFile(corrected_filename, [argv.t], message.author.id);
                                if(i_err) {
                                    console.log(i_err);
                                } 
                            }
                        });
                    }
                }
            }).catch((err) => {
                console.log(err);
            })
        })
    }).catch(function(err) {
        console.log('err', err);
    });
}

exports.help = () =>{
    return "Gently probes all audio files from behind to find out just how 'long' :wink: they are.";
};

exports.docs = () => {
    let docs = {
        tab: "admin",
        link: "general",
        parent: "",
        full_command: "grab_pics",
        command: "grab_pics",
        description: "Grabs 100 animated images from google and stores them in the DB.  A new tag must be made using the tag create command.  Make sure your search terms are quoted.  NOTE: This does NOT create the command to display the images.",
        syntax: 'grab_pics -s "[search_terms]" -t [tag_name]',
        examples: [
            {
                description: "Grab Anime clapping images.",
                code: `grag_pics -s "anime clapping" -t clap`
            }
        ]
    }
    return docs;
};