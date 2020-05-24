import { Server } from "./Server";
import { Metrics } from "./Metrics";
import { Snowflake } from "discord.js";
import { Tag } from "./Tag";

export interface CustomNodeJsGlobal extends NodeJS.Global {
    servers: Map<string, Server>;
    commandTypes: Array<string>;
    commandTypeDesc: Map<string, string>;
    commandTypeColor: Map<string, number>;
    audio_dirs: Map<string, string>;
    image_dirs: Map<string, string>;
    metrics: Metrics;
    img_resp_to_tag: Map<Snowflake, Tag>;
    img_resp_to_tag_order: Array<Snowflake>;
    img_resp_to_tag_max_len: number;
    clip_length: number;
}