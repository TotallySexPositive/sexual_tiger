import { GuildManager } from "discord.js";
const promclient = require("prom-client")
const default_metrics = require("prom-client").collectDefaultMetrics

const Summary = require("prom-client").Summary
const Gauge = require("prom-client").Gauge
export class Metrics {
    constructor() {
        this.registry = default_metrics({
            prefix: "sexual_",
            timeout: 10000
        });
        this.summaries = new Summary({
            name: "sexual_command_usage",
            help: "Summary of the usage of the commands in the bot",
            labelNames: ["command"]
        });
        this.uptime = new Gauge({
            name: "sexual_uptime",
            help: "The uptime of the bot"
        })
    }
    registry: any;
    summaries: any;
    uptime: any;

}