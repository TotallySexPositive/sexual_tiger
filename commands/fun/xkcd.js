const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))
const auth  = require(path.resolve('auth.json'));
const parser    = require('yargs-parser')
const fetch = require('node-fetch');

exports.run = (client, message, args) => {

    let arg_string  = message.content.slice(5); //Chop off $xkcd
    let comic_id    = arg_string.trim()
    let xkcd_url = "https://xkcd.com/info.0.json"

    if(comic_id) {
        xkcd_url = `https://xkcd.com/${comic_id}/info.0.json`
    }

    fetch(xkcd_url)
    .then(res => {
        if(res.ok) {
            return res.json()
        }
        else
        {
            return {
                "month": "9", 
                "num": 2200, 
                "link": "", 
                "year": "2019", 
                "news": "", 
                "safe_title": "Unreachable State", 
                "transcript": "", 
                "alt": "ERROR: We've reached an unreachable state. Anything is possible. The limits were in our heads all along. Follow your dreams.", 
                "img": "https://imgs.xkcd.com/comics/unreachable_state.png", 
                "title": "Unreachable State", 
                "day": "9"
            }
        }
    }).then(json => {
        message.channel.send(`${json.title}\n${json.img}`);
        message.channel.send(`\`\`\`${json.alt}\`\`\``);
    });
}


exports.help = () =>{
    return "Text to Speech, but less annoying...";
};

exports.docs = () => {
    let docs = {
        tab: "Misc",
        link: "general",
        parent: "",
        full_command: "tts",
        command: "tts",
        description: "Converts Text to Speech using Google API.  See https://cloud.google.com/speech-to-text/docs/languages for list of available language codes.",
        syntax: 'tts [text to convert] | -t "text to convert" [-l LANG_CODE] [-r RATE] ',
        examples: [
            {
                description: "Say 'Hello fellow humans' in english at normal rate.",
                code: `tts Hello fellow humans`
            },
            {
                description: "Say 'Hello fellow humans' in english at half normal rate.",
                code: `tts -t "Hello fellow humans" -r .5`
            },
            {
                description: "Say 'Hello fellow humans' with a french accent at normal rate.",
                code: `tts -t "Hello fellow humans" -l fr`
            },
            {
                description: "Say 'erbrbrbrbrbrbrbrb' with/in japanese at a quarter normal rate.",
                code: `tts -t "erbrbrbrbrbrbrbrb" -l JA -r .25`
            }

        ]
    }
    return docs;
};