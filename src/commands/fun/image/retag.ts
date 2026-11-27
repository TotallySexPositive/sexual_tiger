import type { ChatInputCommandInteraction } from 'discord.js';
import * as DAL from "../../../dal";
import * as UTIL from "../../../utils";

export async function execute(interaction: ChatInputCommandInteraction) {
    let message_id = interaction.options.getString('message_id')!;
    let tag_names = interaction.options.getString('tags')!.split(',').map(t => t.trim());

    let v_result = UTIL.verifyTags(tag_names) as any;
    if (v_result.err && v_result.tags === undefined) {
        return interaction.reply({ content: "Crashed while verifying tags.", ephemeral: true });
    } else if (v_result.err && v_result.tags !== undefined) {
        return interaction.reply({ content: `The following tags do not exist. ${v_result.tags.join(', ')}`, ephemeral: true });
    }

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
                let tag = global.img_resp_to_tag[message_id];
                if (!tag) {
                    return interaction.reply({ content: "Could not find original tag for this message.", ephemeral: true });
                }
                let it_result = DAL.deleteFromImageTag(image.image_id, tag.tag_id) as any;

                if (it_result.err) {
                    return interaction.reply({ content: "Crashed removing tag from image." });
                } else if (it_result.info.changes === 0) {
                    return interaction.reply({ content: "You can only retag an image once per appearance. The original tag on that post has already been changed." });
                } else {
                    let tags = v_result.tags;
                    let tag_ids = tags.map(function (t: any) { return t['tag_id']; });
                    let new_tag_names = tags.map(function (t: any) { return t['name']; });
                    let it_result2 = DAL.insertIntoImageTag([image.image_id], tag_ids) as any;

                    if (it_result2.err) {
                        return interaction.reply({ content: "Crashed adding tags to image." });
                    } else {
                        return interaction.reply({ content: `${tag.name} removed, ${new_tag_names.join(', ')} added.` });
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
        return interaction.reply({ content: "Failed to fetch message.", ephemeral: true });
    }
}
