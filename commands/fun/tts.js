const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))
const auth  = require(path.resolve('auth.json'));
const giphy = require('giphy-api')(auth.giphy);
const TTS   = require('google-tts-api');
const parser    = require('yargs-parser')

exports.run = (client, message, args) => {

    var opts = {
        alias: {
            text: ['t'],
            language: ['l'],
            rate: ['r']
        },
        configuration: {
            'short-option-groups': false
          }
    }

    let arg_string = message.content.slice(4); //Chop off $tts
    var argv = parser(arg_string.replace(/= +/g, "="), opts)

    let lang = 'en'
    let rate = 1
    let text = `${message.author.username} is an idiot`

    if(argv.l) {
        lang = argv.l
    }
    if(argv.r) {
        rate = argv.r
    }
    if(argv.t) {
        text = argv.t
    }

    if(!argv.t && !argv.l && !argv.r) {
        text = arg_string
    }
    TTS(text, lang, rate)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
        var server = global.servers[message.guild.id]

        let vc = message.member.voiceChannel
        if(vc === undefined){
            message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
            return;
        }

        vc.join()
        .then(connection => {
            UTIL.playUrl(client, connection, message, url, UTIL.playAudioBasicCallBack)
        })
        .catch(console.error);
    })
    .catch(function (err) {
        console.error(err.stack);
    });
}

exports.help = () =>{
    return "Text to Speech, but less annoying...";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
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