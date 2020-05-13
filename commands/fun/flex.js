const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "flex",
    aliases       : [],
    description   : "Post an image of anime flex.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("flex").startTimer();
        UTIL.postRandomImageByTag(message, "flex");
        end();
    }
};