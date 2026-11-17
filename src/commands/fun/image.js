import { SlashCommandBuilder } from 'discord.js';

import * as DAL from "../../dal";
import * as UTIL from "../../utils";
const path = require("path");
const fs = require("fs");

export const data = new SlashCommandBuilder()
    .setName('image')
    .setDescription("Manage images in the database.")
    .addSubcommand(sub => sub
        .setName('tag')
        .setDescription("Tag an image by message ID.")
        .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the image post').setRequired(true))
        .addStringOption(opt => opt.setName('tags').setDescription('Tags to add (comma separated)').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('untag')
        .setDescription("Remove a tag from an image by message ID.")
        .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the image post').setRequired(true)))
    .addSubcommand(sub => sub
        .setName('retag')
        .setDescription("Replace tags on an image by message ID.")
        .addStringOption(opt => opt.setName('message_id').setDescription('Message ID of the image post').setRequired(true))
        .addStringOption(opt => opt.setName('tags').setDescription('New tags (comma separated)').setRequired(true)));

export async function execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'tag') {
        let message_id = interaction.options.getString('message_id');
        let tag_names = interaction.options.getString('tags').split(',').map(t => t.trim());

        let { err: v_err, tags } = UTIL.verifyTags(tag_names);
        if (v_err && tags === undefined) {
            return interaction.reply({ content: "Crashed while verifying tags.", ephemeral: true });
        } else if (v_err && tags !== undefined) {
            return interaction.reply({ content: `The following tags do not exist. ${tags.join(', ')}`, ephemeral: true });
        }

        try {
            const channel = await interaction.client.channels.fetch(interaction.channelId);
            const target_message = await channel.messages.fetch(message_id);
            let attachment_arr = target_message.attachments.array();
            if (attachment_arr.length === 0) {
                return interaction.reply({ content: "That message didnt have any images attached." });
            } else {
                let file_hash = attachment_arr[0].name.replace(/\.[^/.]+$/, "");
                let { err, image } = DAL.findImageByHashId(file_hash);
                if (err) {
                    return interaction.reply({ content: "Crashed finding image." });
                } else if (image === undefined) {
                    return interaction.reply({ content: "Looks like that image has been deleted." });
                } else {
                    let tag_ids = tags.map(function (tag) { return tag['tag_id']; });
                    let { err: it_err, info } = DAL.insertIntoImageTag([image.image_id], tag_ids);
                    if (it_err) {
                        return interaction.reply({ content: "Crashed adding tags to image." });
                    } else {
                        return interaction.reply({ content: "Tags have been updated." });
                    }
                }
            }
        } catch (e) {
            console.error(e);
            return interaction.reply({ content: "Failed to fetch message.", ephemeral: true });
        }
    } else if (subcommand === 'untag') {
        let message_id = interaction.options.getString('message_id');

        try {
            const channel = await interaction.client.channels.fetch(interaction.channelId);
            const target_message = await channel.messages.fetch(message_id);
            let attachment_arr = target_message.attachments.array();
            if (attachment_arr.length === 0) {
                return interaction.reply({ content: "That message didnt have any images attached." });
            } else {
                let file_hash = attachment_arr[0].name.replace(/\.[^/.]+$/, "");
                let { err, image } = DAL.findImageByHashId(file_hash);
                if (err) {
                    return interaction.reply({ content: "Crashed finding image." });
                } else if (image === undefined) {
                    return interaction.reply({ content: "Looks like that image has been deleted." });
                } else {
                    let tag_id = global.img_resp_to_tag[message_id]?.tag_id;
                    if (!tag_id) {
                        return interaction.reply({ content: "Could not find original tag for this message.", ephemeral: true });
                    }
                    let { err: it_err, info } = DAL.deleteFromImageTag(image.image_id, tag_id);
                    if (it_err) {
                        return interaction.reply({ content: "Crashed removing tag from image." });
                    } else {
                        target_message.delete().catch(() => {});
                        let { err: s_err, image_tags } = DAL.searchImageTagByImageId(image.image_id);
                        if (s_err) {
                            console.log("Crashed while looking for image tags", s_err);
                        } else if (image_tags.length === 0) {
                            let { err: i_err, info: i_info } = DAL.deleteImageById(image.image_id);
                            if (i_err) {
                                console.log("Crashed while deleting image with no more tags", i_err);
                                return interaction.reply({ content: `Tags have been updated but most likely there is an orphaned image, ${image.hash_id}` });
                            } else if (i_info.changes === 1) {
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
    } else if (subcommand === 'retag') {
        let message_id = interaction.options.getString('message_id');
        let tag_names = interaction.options.getString('tags').split(',').map(t => t.trim());

        let { err: v_err, tags } = UTIL.verifyTags(tag_names);
        if (v_err && tags === undefined) {
            return interaction.reply({ content: "Crashed while verifying tags.", ephemeral: true });
        } else if (v_err && tags !== undefined) {
            return interaction.reply({ content: `The following tags do not exist. ${tags.join(', ')}`, ephemeral: true });
        }

        try {
            const channel = await interaction.client.channels.fetch(interaction.channelId);
            const target_message = await channel.messages.fetch(message_id);
            let attachment_arr = target_message.attachments.array();
            if (attachment_arr.length === 0) {
                return interaction.reply({ content: "That message didnt have any images attached." });
            } else {
                let file_hash = attachment_arr[0].name.replace(/\.[^/.]+$/, "");
                let { err, image } = DAL.findImageByHashId(file_hash);

                if (err) {
                    return interaction.reply({ content: "Crashed finding image." });
                } else if (image === undefined) {
                    return interaction.reply({ content: "Looks like that image has been deleted." });
                } else {
                    let tag = global.img_resp_to_tag[message_id];
                    if (!tag) {
                        return interaction.reply({ content: "Could not find original tag for this message.", ephemeral: true });
                    }
                    let { err: it_err, info } = DAL.deleteFromImageTag(image.image_id, tag.tag_id);

                    if (it_err) {
                        return interaction.reply({ content: "Crashed removing tag from image." });
                    } else if (info.changes === 0) {
                        return interaction.reply({ content: "You can only retag an image once per appearance. The original tag on that post has already been changed." });
                    } else {
                        let tag_ids = tags.map(function (tag) { return tag['tag_id']; });
                        let new_tag_names = tags.map(function (tag) { return tag['name']; });
                        let { err: it_err2, info: info2 } = DAL.insertIntoImageTag([image.image_id], tag_ids);

                        if (it_err2) {
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
}
