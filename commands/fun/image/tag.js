const path      = require("path");
const fs        = require("fs");
const DAL       = require(path.resolve("dal.js"))
const UTIL      = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    if(args.length <= 1) {
        message.channel.send("Must send message id and tag names. EX: $image tag [MESSAGE_ID] cry\nTo get message_id, Go to Discord Settings -> Appearance -> Toggle Developer Mode on.\nThen right click image/post and click 'Copy Id'");
    } else {
        const [message_id, ...tag_names] = args;

        //Check if the tags passed in exist.
        let {err:t_err, tags} = DAL.findTagsByNames(tag_names)
        if(t_err) {
            console.log(t_err)
            return message.channel.send("Crashed while verifying tags.");
        } else if(tag_names.length !== tags.length) {
            //At least one of the tags didnt exist.
            var found_tags = tags.map(function(tag) {
                return tag['name'];
                });

            let invalid_tags = tag_names.filter(tag => !found_tags.includes(tag));
            console.log("invalid_tags", invalid_tags)
            return message.channel.send(`The following tags do not exist. ${invalid_tags.join(', ')}`);
        } //All tags are valid, lets just move on.


        message.channel.fetchMessage(message_id)
        .then(target_message => {
            let attachment_arr = target_message.attachments.array();
            if(attachment_arr.length === 0) {
                return message.channel.send("That message didnt any any images attached.")
            } else {
                let file_hash = attachment_arr[0].filename.replace(/\.[^/.]+$/, "");
                let {err, image} = DAL.findImageByHashId(file_hash);
                if(err) {
                    message.channel.send("Crashed finding image.")
                } else if (image === undefined) { //No error, but no image, most likely it got deleted but is still in chat.
                    message.channel.send("Looks like that image has been deleted.")
                } else {
                    let tag_ids = tags.map(function(tag) {return tag['tag_id'];})
                    let {err: it_err, info} = DAL.insertIntoImageTag([image.image_id], tag_ids)
                    if(it_err) {
                        return message.channel.send("Crashed adding tags to image.")
                    } else {
                        return message.channel.send("Tags have been updated.")
                    }
                }
            }
        })
        .catch(console.error);
    }
}

exports.help = () =>{
    return "Adds a tag to an image. EX: $image tag [MESSAGE_ID] cry";
};