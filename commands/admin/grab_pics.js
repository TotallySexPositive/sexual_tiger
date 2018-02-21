const path  = require("path")
const fs    = require('fs');
const DAL   = require(path.resolve("dal.js"))
const UTIL  = require(path.resolve("utils.js"))
var Scraper = require ('images-scraper')
  , google = new Scraper.Google();
const download = require('image-downloader')

exports.run = (client, message, args) => {
    google.list({
        keyword: 'anime pout',
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
                dest: path.resolve("images", "tmp")
            };
            
            download.image(options)
            .then(({ filename, image }) => {
                //Downloaded file to tmp.  Lets process it.
                let i_err = UTIL.processImageFile(filename, message);
                if(i_err) {
                    console.log(i_err);
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
