// const path      = require("path");
// const fs        = require("fs");
// import * as UTIL from "../../../utils";
// const validator = require('validator');
// const readChunk = require('read-chunk');
// import * as imageType from 'image-type';
// const download  = require('image-downloader')
// var randomstring = require("randomstring");

// const sanitize  = require("sanitize-filename");

// exports.run = (client, message, args) => {
    
//    if(args.length <= 1) {
//        return message.channel.send("You must also tag the image.  EX: $image add http://coolimages.com/coolimage.jpg cry pout death");
//    } else {
//         const [url, ...tags] = args;

//         if(!validator.isURL(url)) {
//             return message.channel.send("Invalid url sent.")
//         } else {
//             const options = {
//                 url: url,
//                 dest: path.resolve("images", "tmp", randomstring.generate() + ".gif")
//             };

//             download.image(options)
//             .then(({ filename, image }) => {
//                 //Verify the thing we downloaded was even an image.
//                 const buffer    = readChunk.sync(filename, 0, 12);
//                 let image_type  = imageType(buffer);

//                 if(image_type === undefined || image_type === null || !image_type.mime.includes("image")) {
//                     return message.channel.send("That doesnt look like an image to me.")
//                 } else {//Ok it was an image, lets check its size
//                     let size = UTIL.getFileSizeInMegaBytes(filename);
//                     if(size > 8) { //Size exceeds discords upload limit, trash it.
//                         console.log(`Skipped file ${filename} because it was too big.`);
//                         fs.unlink(filename, function(err3) {
//                             if(err3) {
//                                 console.log("Failed to delete image that was too big")
//                                 console.log(err3);
//                             }
//                         })
//                         return message.channel.send("File is too large, max size is 8 MB.")
//                     } else { //Image was small enough to upload to discord
//                         //Correct extension on file because I arbitrarily assigned .gif to make sure the download always works
//                         let filename_no_ext     = filename.replace(/\.[^/.]+$/, "")
//                         let corrected_filename  = `${filename_no_ext}.${image_type.ext}`

//                         fs.rename(filename, corrected_filename, (err) => {
//                             if(err) {
//                                 console.log(`Failed to rename file, ${filename} to ${corrected_filename}`);
//                                 console.log(err);
//                                 message.channel.send(`Crashed while adjusting image extension. ${err.message}`)
//                             } else {                                 
//                                 let i_err = UTIL.processImageFile(corrected_filename, tags, message.author.id);
//                                 if(i_err) {
//                                     console.log(i_err);
//                                     message.channel.send(i_err.message)
//                                 } else {
//                                     message.channel.send("Image added and tagged.")
//                                 }
//                             }
//                         });
//                     }
//                 }
//             }).catch((err) => {
//                 console.log(err);
//                 message.channel.send(`Crashed while downloading image. ${err.message}`)
//             })
//         }
//     }

// }

// exports.help = () =>{
//     return "Adds an image to the DB. EX: $image add http://coolimages.com/coolimage.jpg cry pout death";
// };

// exports.docs = () => {
//     let docs = {
//         default_access: 1,
//         tab: "image",
//         link: "image",
//         parent: "image",
//         full_command: "image add",
//         command: "add",
//         description: "Add a new image to the database.",
//         syntax: 'image add [url] [...tag_name, tag_name, tag_name]',
//         examples: [
//             {
//                 description: "Add the image 'coolimage.jpg' to the bot and tag it as flex",
//                 code: `image add http://coolimages.com/coolimage.jpg flex`
//             },
//             {
//                 description: "Add the image 'coolimage.jpg' to the bot and tag it as clap, slap, flip",
//                 code: `image add http://coolimages.com/coolimage.jpg clap slap flip`
//             }
//         ]
//     }
//     return docs;
// };