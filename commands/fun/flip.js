const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "flip",
    aliases       : [],
    description   : "Post an image of anime flip.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("flip").startTimer();
        UTIL.postRandomImageByTag(message, "flip");
        end();
    }
};