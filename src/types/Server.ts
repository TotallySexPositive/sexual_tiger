import { Song } from './Song'
import { VoiceConnection } from "discord.js"
export class Server {
    constructor() {
        this.repeat = false;
        this.current_song = null;
        this.maintain_presence = false;
        this.connectionPromise = null;
        this.default_volume = .125;
        this.volume = .125;
        this.max_volume = 1;
        this.clip_volume = .75;
        this.super_admins = ["231574835694796801", "183388696207294465", "231606224909500418"];
        this.song_queue = [];
        this.shuffle = false;
    }
    repeat: boolean;
    current_song: Song;
    maintain_presence: boolean;
    connectionPromise: Promise<VoiceConnection>;
    default_volume: number;
    volume: number;
    max_volume: number;
    clip_volume: number;
    super_admins: Array<string>;
    song_queue: Array<Song>;
    shuffle: boolean;

}