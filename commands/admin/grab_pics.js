const path  = require("path")
const fs    = require('fs');
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();
const download = require('image-downloader')
const parser    = require('yargs-parser')
var randomstring = require("randomstring");

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

    if(!argv.s || !argv.t) {
        return message.channel.send('You must provide a tag and a search term. EX: $grab_pics -t pout -s "anime pout"')
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
                dest: path.resolve("images", "tmp", randomstring.generate() + path.basename(thing.url))
            };
            
            download.image(options)
            .then(({ filename, image }) => {
                let size = UTIL.getFileSizeInMegaBytes(filename);
                if(size > 8) {
                    console.log(`Skipped file ${filename} because it was too big.`);
                    fs.unlink(filename, function(err3) {
                        if(err3) {
                            console.log("Failed to delete image that was too big")
                            console.log(err3);
                        }
                    })
                } else {
                    //Downloaded file to tmp.  Lets process it.
                    console.log(filename)
                    let i_err = UTIL.processImageFile(filename, argv.t, message);
                    if(i_err) {
                        console.log(i_err);
                    }
                }
                
            }).catch((err) => {
                throw err
            })
        })
    }).catch(function(err) {
        console.log('err', err);
    });
    
   
}

exports.help = () =>{
    return "Gently probes all audio files from behind to find out just how 'long' :wink: they are.";
};
