const path = require("path");
const DAL   = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {

    let {err, image} = DAL.getRandomImageByTag("pout");
    if(err) {
        console.log(err);
        message.channel.send("Crashed finding image");
    } else if(image === undefined) {
        message.channel.send("Couldnt find any images for pout.")
    } else {
        console.log(image)
        let file = path.resolve(global.image_dirs.hashed, image.hash_id + image.extension);
        console.log(file)
	    message.channel.send("", {"files": [file]})
    }
		
}

exports.help = () =>{
    return "Pouty pouty pout";
};