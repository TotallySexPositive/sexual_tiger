import { CustomNodeJsGlobal } from "../../types/CustomNodeJsGlobal"
import { Doc } from "../../types/Doc"
import { Example } from "src/types/Example";
declare const global: CustomNodeJsGlobal;
exports.run = (client, message, _args) => {
    const end = global.metrics.summaries.labels('home').startTimer()
    message.channel.send("Come visit me at, https://tiger.wentzel.dev")
    end()
}

exports.help = () => {
    return "Display link to my home";
};

exports.docs = () => {
    const doc = new Doc(
        1,
        "Misc",
        "general",
        "",
        "home",
        "home",
        "Displays the link to the Sexual Tiger website.",
        "home"
    );
    doc.addExample(
        new Example("Get Link", "home")
    )
    return doc;
};