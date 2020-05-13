const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "tigerfucking",
    aliases       : [],
    description   : "Post an image of anime tigerfucking.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("tigerfucking").startTimer();
        UTIL.postRandomImageByTag(message, "tigerfucking");
        end();
    }
};