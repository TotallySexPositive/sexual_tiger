const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "clap",
    aliases       : [],
    description   : "Post an image of anime clap.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("clap").startTimer();
        UTIL.postRandomImageByTag(message, "clap");
        end();
    }
};