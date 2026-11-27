import type { ChatInputCommandInteraction } from 'discord.js';
import * as DAL from "../../../dal";
import path from "path";
import fs from "fs";

export async function execute(interaction: ChatInputCommandInteraction) {
    let message_id = interaction.options.getString('message_id')!;

    try {
        const channel = await interaction.client.channels.fetch(interaction.channelId);
        if (!channel || !('messages' in channel)) throw new Error("Invalid channel");
        const target_message = await (channel as any).messages.fetch(message_id);
        let attachment_arr = target_message.attachments.array();
        if (attachment_arr.length === 0) {
            return interaction.reply({ content: "That message didnt have any images attached." });
        } else {
            let file_hash = attachment_arr[0].name.replace(/\.[^/.]+$/, "");
            let result = DAL.findImageByHashId(file_hash) as any;
            if (result.err) {
                return interaction.reply({ content: "Crashed finding image." });
            } else if (result.image === undefined) {
                return interaction.reply({ content: "Looks like that image has been deleted." });
            } else {
                let image = result.image;
                let tag_id = global.img_resp_to_tag[message_id]?.tag_id;
                if (!tag_id) {
                    return interaction.reply({ content: "Could not find original tag for this message.", ephemeral: true });
                }
                let it_result = DAL.deleteFromImageTag(image.image_id, tag_id) as any;
                if (it_result.err) {
                    return interaction.reply({ content: "Crashed removing tag from image." });
                } else {
                    target_message.delete().catch(() => {});
                    let s_result = DAL.searchImageTagByImageId(image.image_id) as any;
                    if (s_result.err) {
                        console.log("Crashed while looking for image tags", s_result.err);
                    } else if (s_result.image_tags.length === 0) {
                        let i_result = DAL.deleteImageById(image.image_id) as any;
                        if (i_result.err) {
                            console.log("Crashed while deleting image with no more tags", i_result.err);
                            return interaction.reply({ content: `Tags have been updated but most likely there is an orphaned image, ${image.hash_id}` });
                        } else if (i_result.info.changes === 1) {
                            let file_path = path.resolve(global.image_dirs.get('hashed'), image.hash_id + image.extension);
                            let trash_path = path.resolve(global.image_dirs.get('trash'), image.hash_id + image.extension);
                            fs.rename(file_path, trash_path, (err) => {
                                if (err) {
                                    console.log(`Failed to move deleted image, ${file_path} to ${trash_path}`);
                                    console.log(err);
                                }
                            });
                            return interaction.reply({ content: "Tag removed, and orphaned image removed." });
                        }
                    } else {
                        return interaction.reply({ content: "Tags have been updated." });
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
        return interaction.reply({ content: "Failed to fetch message.", ephemeral: true });
    }
}
