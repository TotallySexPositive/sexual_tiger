const path = require("path");
const DAL   = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {

    let {err, image} = DAL.getRandomImageByTag("flex");
    if(err) {
        console.log(err);
        message.channel.send("Crashed finding image");
    } else if(image === undefined) {
        message.channel.send("Couldnt find any images for pout.")
    } else {
        let file = path.resolve(global.image_dirs.hashed, image.hash_id + image.extension);
	    message.channel.send("", {"files": [file]})
    }
		
}

exports.help = () =>{
    return "The Armstrong Line!";
};