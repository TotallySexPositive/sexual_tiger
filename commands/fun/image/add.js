const path      = require("path");
const fs        = require("fs");
const DAL       = require(path.resolve("dal.js"))
const UTIL      = require(path.resolve("utils.js"))
const validator = require('validator');
const readChunk = require('read-chunk');
const imageType = require('image-type');
const download  = require('image-downloader')
var randomstring = require("randomstring");


exports.run = (client, message, args) => {
   if(args.length <= 1) {
       return message.channel.send("You must also tag the image.  EX: $image add http://coolimages.com/coolimage.jpg cry pout death");
   } else {
        const [url, ...tags] = args;
        console.log(url);
        console.log(tags);


        if(!validator.isURL(url)) {
            return message.channel.send("Invalid url sent.")
        } else {

            const options = {
                url: url,
                dest: path.resolve("images", "tmp", randomstring.generate() + path.basename(url))
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
                    return message.channel.send("File is too large, max size is 8 MB.")
                } else {
                    const buffer = readChunk.sync(filename, 0, 12);

                    let image = imageType(buffer);

                    if(image === undefined || image === null || !mime.includes("image")) {
                        return message.channel.send("That doesnt look like an image to me.")
                    } else {
                        //Downloaded file to tmp.  Lets process it.
                        let i_err = UTIL.processImageFile2(filename, tags, message.author.id);
                        if(i_err) {
                            console.log(i_err);
                            message.channel.send(i_err.message)
                        } else {
                            message.channel.send("Image added and tagged.")
                        }
                    }
                }
                
            }).catch((err) => {
                throw err
            })


            
            }
    }
}

exports.help = () =>{
    return "";
};