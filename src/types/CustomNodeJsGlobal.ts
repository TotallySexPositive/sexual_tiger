import { Snowflake } from "discord.js";
import { Server } from "./Server";
import { Tag } from "./Tag";

export interface CustomNodeJsGlobal extends NodeJS.Global {
	servers: Map<string, Server>;
	commandTypes: Array<string>;
	commandTypeDesc: Map<string, string>;
	commandTypeColor: Map<string, number>;
	audio_dirs: AudioDirectories;
	image_dirs: ImageDirectories;
	img_resp_to_tag: Map<Snowflake, Tag>;
	img_resp_to_tag_order: Array<Snowflake>;
	img_resp_to_tag_max_len: number;
	clip_length: number;
	sentry: any;
}

export interface AudioDirectories {
	tmp: string;
	hashed: string;
	stored: string;
	uploaded: string;
}

export interface ImageDirectories {
	tmp: string;
	hashed: string;
	trash: string;
}
