const path      = require("path");
const fs        = require("fs");
const DAL       = require(path.resolve("dal.js"))
const UTIL      = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('image_untag').startTimer()
    if(args.length !== 1) {
        message.channel.send("Must send message id. EX: $image untag [MESSAGE_ID]\nTo get message_id, Go to Discord Settings -> Appearance -> Toggle Developer Mode on.\nThen right click image/post and click 'Copy Id'");
    } else {
        const message_id = args[0];

        message.channel.fetchMessage(message_id)
        .then(target_message => {
            let attachment_arr = target_message.attachments.array();
            if(attachment_arr.length === 0) {
                return message.channel.send("That message didnt have any images attached.")
            } else {
                let file_hash = attachment_arr[0].filename.replace(/\.[^/.]+$/, "");
                let {err, image} = DAL.findImageByHashId(file_hash);
                if(err) {
                    message.channel.send("Crashed finding image.")
                } else if (image === undefined) { //No error, but no image, most likely it got deleted but is still in chat.
                    message.channel.send("Looks like that image has been deleted.")
                } else {
                    let tag_id = global.img_resp_to_tag[message_id].tag_id
                    let {err: it_err, info} = DAL.deleteFromImageTag(image.image_id, tag_id)
                    if(it_err) {
                        return message.channel.send("Crashed removing tag from image.")
                    } else {
                        target_message.delete();
                        //Check if image has other tags
                        let {err: s_err, image_tags} = DAL.searchImageTagByImageId(image.image_id)
                        if(s_err) {
                            console.log("Crashed while looking for image tags", s_err)
                        } else if(image_tags.length === 0) { //That image is no longer tagged, lets delete it.
                            let {err: i_err, info: i_info} = DAL.deleteImageById(image.image_id);
                            if(i_err) {
                                console.log("Crashed while deleting image with no more tags", i_err)
                                return message.channel.send(`Tags have been updated but most likely there is no an orphaned image, ${image.hash_id}`)
                            } else if (i_info.changes === 1) {
                                let file_path = path.resolve(global.image_dirs.hashed, image.hash_id + image.extension)
                                let trash_path = path.resolve(global.image_dirs.trash, image.hash_id + image.extension)
                                fs.rename(file_path, trash_path, (err) => {
                                    if(err) {
                                        console.log(`Failed to move deleted image, ${file_path} to ${trash_path}`);
                                        console.log(err);
                                    }
                                })
                                return message.channel.send("Tag removed, and orphaned image removed.")
                            }
                        } else {
                            return message.channel.send("Tags have been updated.")
                        }
                    }
                }
            }
        })
        .catch(console.error);
    }
    end()
}

exports.help = () =>{
    return "Removes a tag from an image. EX: $image detag [MESSAGE_ID]";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "image",
        parent: "image",
        full_command: "image untag",
        command: "untag",
        description: "Untag an image in the database.  This will remove the tag that trigger the image to be posted.  If the image has no more tags, the image will be deleted.  To get message_id, Go to Discord Settings -> Appearance -> Toggle Developer Mode on.  Then right click image/post and click 'Copy Id'",
        syntax: 'image untag [message_id]',
        examples: [
            {
                description: "Untag an image of a banana.",
                code: `image untag 433008356190322688`
            }
        ]
    }
    return docs;
};