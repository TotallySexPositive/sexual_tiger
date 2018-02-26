const path  = require("path");
const fs    = require("fs");
const DAL   = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {

    if(args.length != 1) {
        message.channel.send("You must send only a single file hash. EX: $image delete 56a6aa2e7fb765c854215c89a7ff5ec1")
    } else {
        let hash = args[0]

        let {err, image} = DAL.findImageByHashId(hash);
        if(err) {
            console.log(err);
            message.channel.send("Crashed while finding image.")
        } else if (image === undefined) {
            message.channel.send("There was no image with that hash.")
        } else {

            let {err: d_err, info} = DAL.deleteImageById(image.image_id);
            if(d_err) {
                console.log(d_err);
                message.channel.send("Crashed while deleting image.")
            } else if (info.changes === 0) {
                message.channel.send("There was no image with that hash.")
            } else {
                let file_path = path.resolve(global.image_dirs.hashed, image.hash_id + image.extension)
                fs.unlink(file_path, function(err3) {
                    if(err3) {
                        console.log("Failed to delete image file.", file_path)
                        console.log(err3);
                    }
                });
                message.channel.send(`${image.hash_id}${image.extension} has been deleted.`)
            }
        }
    }
		
}

exports.help = () =>{
    return "Send an imagine into oblivion! $image delete [hash_id]";
};