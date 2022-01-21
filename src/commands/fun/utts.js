import { getAudioUrl } from "uberduck-api";
import * as UTIL from "../../utils";
const parser = require("yargs-parser");

exports.run = (client, message, args) => {
	let arg_string = message.content.slice(5); //Chop off $utts
	let text = `${message.author.username} is an idiot`;

	if (arg_string.trim() !== "") {
		text = arg_string;
	}

	const characters = [
		"top-cat",
		"michael-buffer-nr",
		"homestar-runner-2001",
		"ballas-1",
		"strong-bad-2001",
		"cranky-kong-uncle-al",
		"2pac-arpa",
		"rey-mysterio",
		"fitz",
		"gordon-ramsay",
		"jon-arbuckle-th",
		"reggie-fils-aime",
		"luis-lopez",
		"rico",
		"dream-clay",
		"gem-archer",
		"michael-buffer",
		"anarchist-csgo",
		"john-madden",
		"kim-mi2",
		"peperami-animal",
		"gospel-bill",
		"big-l-arpa",
		"lil-deville",
		"randy-orton",
		"nagase",
		"lien-neville",
		"mi-announcer",
		"raven",
		"smashultimate",
		"ky-kiske",
		"rene-dupree",
		"eddie-guerrero",
		"shawn-michaels",
		"postal-dood",
		"zac",
		"booker-t",
		"triple-h",
		"stryder7x",
		"eric-bischoff",
		"the-undertaker",
		"kurt-angle",
		"vince-mcmahon",
		"hello-kitty",
		"boo-boo-bear",
		"bugs-bunny",
		"jaiden",
		"mulan",
		"patrckstatic",
		"bentley",
		"king-fundonkiddy-rool",
		"grandmother-fa",
		"frank-welker",
		"maryosheenpilcheesi",
		"shvernaleboog",
		"wendy-testaburger-mkb",
		"wendy-testaburger-as",
		"putt-putt",
		"cheffield-ruffhutz",
		"jim-dale",
		"shaggy-casey-kasem",
		"sarah",
		"marty-the-zebra",
		"vincent-price",
		"ms-keane",
		"comm-wells",
		"rc-wells",
		"dylanius",
		"kimi-finster",
		"zoey",
		"alex-the-lion",
		"adam-amundson",
		"clank",
		"mario-bsi",
		"may-ggst",
		"snagglepuss",
		"shaw",
		"anji-mito-str",
		"segapleasedontturnmeintoanuberduckvoice",
		"jack-kelso",
		"boog",
		"doc-hudson",
		"jesus-christ",
		"eldwin-blair",
		"vanessa-sb",
		"ashe",
		"baptiste",
		"ana",
		"zeta",
		"leah",
		"shine",
		"shimmer",
		"joel",
		"rex-earl-boen",
		"forza-alex",
		"bambi",
		"roxanne-wolf",
		"sam-lake",
		"big-smoke",
		"john-cena",
		"donkey",
		"danooct",
		"map",
		"elastigirl",
		"nego-bam",
		"coconuts",
		"santa-sp",
		"peter-knetter",
		"o-leary",
		"peppa-pig",
		"acemillion",
		"fludd",
		"vox-jn",
		"eminem-arpa2",
		"eli-king",
		"daniel-gajardo",
		"diego",
		"deebeekaw",
		"patty-wagon",
		"oliver-latias",
		"gypsy-crusader",
		"hulk-hogan",
		"ninon-beart",
		"kitty-ko",
		"indian-shopkeeper",
		"gta-packie",
		"tommy-pickles",
		"oblina",
		"peter-griffin-es",
		"nfs-announcer",
		"mr-hippo",
		"joey-styles",
		"bailey",
		"outsiders-female",
		"rudolph",
		"skullgirls-announcer",
		"jolyne-cujoh",
		"sou-foda",
		"male",
		"enrico-pucci",
		"crusade-announcer",
		"chucky-nft",
		"forza-rebecca",
		"flightreacts",
		"elsa-lichtmann",
		"marvin-gaye",
		"forza-gps",
		"charles-nelson-riley",
		"forza-cortana",
		"dingodile-fredtatasciore",
		"mayor",
		"prism-ai",
		"liam-gallagher",
		"mister-chief-ai",
		"dj-professor-k",
		"stacy-hirano",
		"cheggers",
		"logic",
		"superint-ai",
		"him-announcer",
		"mcsquizzy",
		"timon",
		"elliot",
		"libby",
		"forza-4-satnav",
		"george-volcano",
		"tyrannosaurus-alan",
		"grounder",
		"dr-ivo-robotnik",
		"sonic-jaleel",
		"uter-zorker",
		"cvs2-ann",
		"mort-deebradleybaker",
		"ariel",
		"dr-n-tropy",
		"todd-project-farm",
		"belle",
		"vanna-white",
		"jebus",
		"xqc",
		"arthur-morgan",
		"ninja",
		"lamar-davis-calm",
		"sherlock-holmes",
		"isabella",
		"midtown-madness-1-accouncer",
		"jotaro-kujo",
		"muriel",
		"garfield-lm",
		"deimos",
		"tweety-joe-alaskey",
		"elmer-fudd-billywest",
		"cole-phelps",
		"technus",
		"handunit-hw",
		"devlemons",
		"tails-heroes",
		"simon-80s",
		"journalist",
		"c-3po",
		"special-johnny",
		"chester-stone",
		"troy-mcclure",
		"rocket-raccon",
		"lionel-starkweather",
		"bert",
		"ernie",
		"cookie-monster",
		"count-von-count",
		"pibby",
		"joker-1",
		"handlab-announcer",
		"carl-johnson",
		"hank-hill",
		"ps2f",
		"kermit-the-frog-sw",
		"yennefer",
		"alvin-1980s",
		"liluzivert_normal",
		"mike-wazowski-ca",
		"handunit-sl",
		"sonny-cocoa-puffs",
		"sully-bc",
		"rafiki",
		"maleficent",
		"google-assistant",
		"frosty",
		"celia-mae",
		"pumbaa",
		"mkagp2-announcer",
		"arnold-shortman",
		"clyde-donovan",
		"frogger-beyond",
		"reverend-hedges",
		"karen-frosty",
		"orson-pmw3",
		"cs188",
		"fnf-gf",
		"ron",
		"dr-scratchansniff",
		"dr-neo-cortex-cb",
		"disneychannel_bounce",
		"howie-mandel",
		"wishbone",
		"nipsey-hussle",
		"panty-anarchy",
		"scar",
		"zoog-disney",
		"king-neptune",
		"bubsy-3d",
		"token-black",
		"buttercup-2016",
		"batman-injustice2",
		"dolph-starbeam",
		"clem",
		"pip",
		"sgt-roebuck",
		"uka-uka",
		"jimmy-vulmer",
		"shaggy-rogers-lillard",
		"aku-aku",
		"chum-world-clown",
		"big-the-cat-jsj",
		"fat-albert",
		"rouge-the-bat-sa2",
		"omochao",
		"tails-sa",
		"skeet",
		"bangkok-bts",
		"ben-ravencroft",
		"thanos",
		"batman",
		"king-of-town",
		"squidward",
		"marzipan",
		"king-liang",
		"cannonbolt",
		"yosemite-sam-ml",
		"diamondhead",
		"shgurr",
		"shock-rock",
		"wildcard-mcvee",
		"dr-bunsen-honeydew",
		"rowlf",
		"kermit-the-frog",
		"pepe-king-prawn",
		"fegelein",
		"rizzo-the-rat",
		"spider-man",
		"fozzie-bear",
		"miss-piggy",
		"mohammad",
		"bartender-twnn",
		"mr-potato-head",
		"wii-fit",
		"marsupilami",
		"luan-loud",
		"bubsy-1",
		"stephenasmith",
		"kirk-van-houten",
		"old-jewish-man",
		"ir-baboon",
		"slj",
		"starfire",
		"nick-hooper",
		"priest-twnn",
		"hitler-rant",
		"im-weasel",
		"morgan-freeman",
		"yoda",
		"fuzzy-lumpkins",
		"hitler-calm",
		"him",
		"dexters-dad",
		"chris-redfield",
		"darrell",
		"iori-mi2",
		"max-payne",
		"alan-wake-calm",
		"dexters-mom",
		"raymondbm",
		"peach",
		"emmet",
		"bruno-bucciarati",
		"kratos",
		"daisy",
		"stop-sending-me-traps",
		"rosalina",
		"stephanie-miller",
		"scratchy",
		"itchy",
		"sirmixalot",
		"thelma-harper",
		"layton",
		"duhhh-cringe-guy",
		"rick-sanchez",
		"chance-the-rapper",
		"sarah-breaker",
		"wario",
		"gonzo",
		"alan-wake",
		"sir-topham-hatt",
		"alice-wake",
		"beautiful-gorgeous",
		"yunggibberish",
		"alexa",
		"betty-deville",
		"joeytt",
		"cosmo",
		"sheila-qc",
		"guru-ant",
		"jack-in-the-box",
		"leni-loud",
		"wanda",
		"boxy-boy",
		"cletus-spuckler",
		"prof-calamitous",
		"elirin-jp",
		"ibere",
		"vicky",
		"damon-albarn",
		"ms-fowl",
		"moose-a-moose",
		"michael-cole",
		"naruto-uzumaki",
		"oogtar",
		"prince-fleaswallow",
		"cheap-cheap",
		"stimpy",
		"nick-asb-announcer",
		"diana-burnwood",
		"ms-cortana",
		"barney-calhoun",
		"dr-rosenberg",
		"daffy-duck-mel",
		"joseph-seed",
		"johnny-the-room",
		"jake-the-dog",
		"lucy-loud",
		"mandark",
		"chef",
		"ash-ketchum",
		"chapolin-br",
		"bill-wurtz-talking",
		"playboi-carti-bv",
		"bubbles",
		"transit-system-no-fx",
		"eddy",
		"eric-cartman",
		"chas-finster",
		"chuckie-finster",
		"angelica-pickles",
		"muddy-mudskipper",
		"leo-kasper",
		"krumm",
		"stu-pickles",
		"sonya-blade",
		"scorpion",
		"abby-mallard",
		"ickis",
		"ppg-narrator",
		"kevin",
		"mario-smw",
		"ed",
		"kyle-broflovski-90s",
		"kung-lao",
		"king-koopa",
		"kim-kitsuragi",
		"lara-croft",
		"elmer-fudd",
		"dipper-pines",
		"craig-ferguson",
		"jonny-2x4",
		"sheen-estevez",
		"carl-wheezer",
		"xanyleaves_british",
		"gromble",
		"rainbow-mika",
		"granny-br",
		"kktvn-br",
		"too-tall",
		"hairdresser-octopus",
		"jankman",
		"cannonball-jenkins",
		"stan-marsh-90s",
		"drew-pickles",
		"grandpa-lou",
		"geralt",
		"drake",
		"didi-pickles",
		"polo-g",
		"officer-lou",
		"magic-mirror",
		"cortana",
		"ashley",
		"mike-ice-scream",
		"t-800",
		"rev-lovejoy",
		"monika",
		"gex",
		"dan-sfv",
		"bugs-bunny-greg-burson",
		"h-jon-benjamin",
		"shadow-david-humphrey",
		"crunch-bandicoot-woc",
		"john-marston",
		"peggy-hill",
		"ren-hoek-billy-west",
		"jimmy-carter",
		"richard-nixon",
		"dr-eggman",
		"male-citizen",
		"miss-earth",
		"nezuko-kamado",
		"jthesaltyy",
		"trippie-redd",
		"real-surprises",
		"pokemon-narrator",
		"potatos",
		"baxter-gb2",
		"ralph-bakshi",
		"johnk",
		"warp-darkmatter",
		"21-savage",
		"dr-eggman-mp",
		"jane-ninjala",
		"van-ninjala",
		"sniper-female",
		"tots-tv-tom",
		"thomas-john-bellis",
		"soulcalibur-announcer",
		"snow-white",
		"prince-of-persia",
		"fefe",
		"zoey-hp",
		"bill-nye",
		"larry-king",
		"gottfried",
		"jerry-seinfeld",
		"dr-phil",
		"knuckles",
		"jiminy-cricket",
		"brooke",
		"carl-sagan",
		"liane-cartman",
		"flamingo-yt",
		"anakin-skywalker",
		"50-cent",
		"wolfy",
		"pleakley",
		"goro-majima",
		"victor-quartermaine-ralph-fiennes",
		"edd",
		"bill-grey",
		"james-hetfield",
		"dog-catdog",
		"chicken-strips",
		"tom-hiddleston",
		"johnny-cash",
		"john-hurt",
		"al-michaels",
		"daily-dose-of-internet",
		"sherri-terri",
		"blue-haired-lawyer",
		"big-gay-al",
		"dr-nick",
		"dr-nefarious",
		"mr-herriman",
		"woodman",
		"silver",
		"little-green-alien",
		"frogger-great-quest",
		"shadow-jg",
		"whitey",
		"ssblxp-announcer",
		"spike-flushed-away",
		"lil-tracy",
		"laverne",
		"hoagie",
		"david-spade",
		"zorak",
		"cr1tikal",
		"hamm",
		"kara-danvers",
		"cookie-monster-dr",
		"space-ghost",
		"robot-jones-season-1",
		"sonic-movie",
		"carmelita",
		"fisherman-hl2",
		"boyd-cooper",
		"ford-cruller",
		"alfred-hitchcock",
		"microsoft-sam",
		"adora",
		"greg-universe",
		"craig-tucker",
		"sly-cooper",
		"sandy-cheeks",
		"mermalair-computer",
		"andy-bernard",
		"vector-the-crocodile-jcc",
		"slappy-squirrel",
		"mayor-mcdaniels",
		"rogue-kashya",
		"skipper",
		"kowalski-jeff-benett",
		"cbt",
		"bob-2000",
		"how-its-made-narrator",
		"angela-martin",
		"jim-halpert",
		"charles-calvin",
		"little-king-john",
		"dwight-schrute",
		"pam-beesly",
		"michael-scott",
		"gary-smith",
		"benett-foddy",
		"pete-kowalski",
		"crabblesnitch",
		"paul-anka",
		"ayn-rand",
		"ampichino",
		"betty-white",
		"alan-rickman",
		"ronald-reagan",
		"james-earl-jones",
		"lil-tjay",
		"chills",
		"big-tobacco",
		"richard-ayoade",
		"gordon-the-big",
		"verne-oth",
		"george-liquor",
		"mr-nezzer",
		"yoshi-smw",
		"patton-oswalt",
		"luigi-smw",
		"holographic-assistant",
		"victor-quartermine",
		"bubble-bass",
		"rj",
		"caboose",
		"church",
		"right-hand-man-reborn",
		"sonic-rcs",
		"jim-cummings",
		"thomas-mattel",
		"misty",
		"stone-cold",
		"nick-offerman",
		"private-james-patrick-stuart",
		"face-nickjr",
		"jk-simmons",
		"vortigaunt-ep2",
		"judi-dench",
		"army-armstrong",
		"blockhead",
		"shake",
		"doctor-breen",
		"george-takei",
		"bloo",
		"danny-devito",
		"bryan-cranston",
		"bigby-wolf",
		"shohreh-aghdashloo",
		"infomaniac",
		"bill-gates",
		"cait",
		"bob-barker",
		"jimbo-kern",
		"jeff-gb",
		"mr-garrison",
		"blake-belladonna",
		"amy-rose-jd",
		"cake-core",
		"big-l",
		"glados-p2",
		"dr-neo-cortex-lex",
		"wilbert-awdry",
		"gradeaundera",
		"numbuh-4",
		"ace-bunny",
		"q-tip",
		"fact-core",
		"starlight-glimmer",
		"rob-64",
		"chuck-e-cheese-1977",
		"lionel-hutz",
		"wheatley",
		"big-the-cat-ow",
		"mrs-pomp",
		"mr-krabs-bobjoles",
		"mr-krabs-joewhyte",
		"camila-noceda",
		"buck-rockgut",
		"guru",
		"dr-mephesto",
		"faustao",
		"saddam-hussen",
		"paula-deen",
		"gus-porter",
		"shane-tru",
		"pops",
		"alyx-vance",
		"kendrick-lamar",
		"sakura-avalon",
		"elec-man",
		"arbys",
		"rein-br",
		"not-shane-kid",
		"edi",
		"mr-monopoly",
		"watchmojo",
		"ren-hoek",
		"greg-hamilton",
		"carmen-avila",
		"shego",
		"mr-narrator-donkeyollie",
		"buzz-lightyear",
		"larry-wgwis",
		"marvin-the-martian",
		"sven-hoek",
		"avgn",
		"casey-kasem",
		"jonathan-kepler",
		"old-joseph-joestar",
		"michael-rosen-meme",
		"anthony-sullivan",
		"yuri-ddlc",
		"randy-jenkins",
		"noriaki-kakyoin",
		"jean-pierre-polnareff",
		"odb",
		"eazy-e",
		"paladin-danse",
		"psych2go",
		"albert-wesker",
		"kinect-sports-announcer",
		"mgsr-announcer",
		"nas",
		"monopoly-announcer",
		"samanya-rfg",
		"clubhouse-announcer",
		"the-weeknd",
		"dale-gribble",
		"lady-tottington",
		"combine-unit",
		"master-chief",
		"father-grigori",
		"sunsetshimmer",
		"cranky-kong",
		"chef-fritz",
		"ndn",
		"switchonline",
		"vanilla-ice",
		"lanius",
		"neku-sakuraba",
		"eli-vance",
		"fitnessgram",
		"easter-bunny",
		"captain-sweet-tooth-tom",
		"garycpi",
		"mj",
		"mayonnaise",
		"peach64",
		"werehog",
		"brock-samson",
		"rabbit",
		"arne-magnusson",
		"samus",
		"jerry-lawler",
		"brock",
		"amitie",
		"mufasa",
		"roz",
		"mr-waternoose",
		"donkey-kong",
		"luigi",
		"cosmo-the-seedrian",
		"fred-flintstone-jeff-bergman",
		"lil-tecca",
		"weevil-underwood",
		"eeyore",
		"g-mat",
		"biggie-smalls",
		"nonsensehumor",
		"bombi",
		"frank-winters",
		"sundae",
		"jojo-wwe",
		"cdi-impa",
		"alec-mason",
		"rulue",
		"bomberman-jetters",
		"ren-rwby",
		"deadpool",
		"darius-mason",
		"ice-man",
		"dan",
		"kikimora",
		"s-a-m",
		"brian-griffin",
		"lois-griffin",
		"crate-molov",
		"arle-nadja",
		"peter-gabriel",
		"david-byrne",
		"donald-fagen",
		"billy-joel",
		"joe-buck",
		"kevin-harlan",
		"pusha-t",
		"xpro-gamin",
		"mandril-shrike",
		"preston-garvey",
		"dima",
		"faraday",
		"charmy-bee-heroes",
		"colonel-masako",
		"alex-wally-wingert",
		"richard-gryphon",
		"lola-huniepop",
		"haiji",
		"yanderechan",
		"shantae",
		"shadow-kirk-thornton",
		"dutch",
		"jessie-huniepop",
		"beli-huniepop",
		"bobby-hill",
		"skippy-squirrel",
		"sonic-ryan-drummond",
		"bugs-bunny-billy-west",
		"woody-woodpecker",
		"diddy-kong",
		"computress",
		"mahatma-gandhi",
		"solidsnake",
		"eriol-br",
		"general-pepper",
		"doctorcapek",
		"ultorpa",
		"orion",
		"alborghetti",
		"raine-whispers",
		"e123omega",
		"tabi",
		"muscle-man",
		"donkey-mark-moseley",
		"buzz-lightyear-pat-fraley",
		"ed-sullivan",
		"agent-47",
		"gene-wilder",
		"larry-the-cucumber-2000s",
		"johnny-baldi",
		"joey-wheeler",
		"pa-grape",
		"yami-yugi",
		"1988-barney",
		"pac-man-world-3",
		"pacifica",
		"b-la-b-controllable",
		"studio",
		"bugs-bunny-jeff-bergman",
		"pearl",
		"stephanie-lazytown",
		"amethyst",
		"lapis-lazuli",
		"ess",
		"evaneratv",
		"steve-element-animation",
		"jericho-fallout",
		"minerva-mink",
		"luz-noceda",
		"giorno-giovanna",
		"principal-bump",
		"protogent",
		"jshaferori",
		"shinatama",
		"lucas-simms",
		"hhpay-ami",
		"heavy",
		"lindsey-thorndyke",
		"lilith-clawthorne",
		"randy-marsh",
		"remy-the-rat",
		"planetina",
		"talking-tom",
		"sky",
		"dylan-dalmatian",
		"dr-dre",
		"sully",
		"pig-barnyard",
		"pokemon-stadium-announcer",
		"johnny-gilbert-present",
		"sheldon-cooper",
		"johnny-gilbert",
		"bria-owl-house",
		"billy",
		"edd-gould",
		"jack",
		"lucas-from-lucas-video-company",
		"evil-julie",
		"nice-julie",
		"patchy-the-pirate",
		"junior-asparagus",
		"miss-pauling",
		"murray-franklin",
		"huckleberry-hound",
		"pete",
		"the-toy-maker",
		"pork-bun-guy",
		"g-men",
		"joker-joaquin-phoenix",
		"classic-four",
		"mr-krabs",
		"maggie-pesky",
		"classic-x",
		"sprig-plantar",
		"polly-plantar",
		"amity-blight",
		"femmedic",
		"judgment-boy",
		"medic",
		"sniper",
		"soldier",
		"scout",
		"slinky-dog",
		"wii-fit-trainer-female",
		"dharr-mann",
		"l-death-note",
		"judgment-boy-1",
		"mandalorian",
		"sway3po",
		"sssniperwolf",
		"dashiegames",
		"season-two-donkey-kong",
		"dantdm",
		"administrator",
		"sam-hit-the-road",
		"binjpipe",
		"sister-bear",
		"dan-povenmire",
		"brother-bear",
		"max-hit-the-road",
		"papa-bear",
		"mama-bear",
		"4th-doctor",
		"spider-man-mvc",
		"hammy",
		"liberty-pp",
		"curly-howard",
		"ash-williams",
		"12th-doctor",
		"ken-barrie",
		"schmitty",
		"suketoudara",
		"fhfif-cheese",
		"goku",
		"regis-philbin",
		"chuck-e-cheese-1983",
		"china-uncensored",
		"wei-shen",
		"fox-anidom",
		"sheila-broflovski",
		"gman",
		"fred-flintstone-henry-corden",
		"luigi-hotel-mario",
		"yogi-bear",
		"jim-thornton",
		"khonjin",
		"anne-robinson",
		"the-joker",
		"marty-pl",
		"tommy-vercetti",
		"demoman",
		"portal-announcer",
		"bender-rodriguez",
		"colonel-noodle",
		"squidward-uncle-al",
		"snake-jailbird",
		"diesel10",
		"juice-wrld-singing",
		"charlie-o'donnell",
		"archibald-asparagus",
		"rita-malone",
		"king-owl-house",
		"patrick-star",
		"splaat",
		"rich-fields",
		"harley-quinn",
		"poisonivy",
		"frenchy",
		"amanda-stepto",
		"george-costanza",
		"jasper",
		"chris-evans",
		"lightning-mcqueen",
		"mg-jeff-garlin",
		"elon-musk",
		"raj",
		"vortigaunt",
		"principal-lewis",
		"the-boogeyman",
		"shane",
		"michael-felger",
		"island-owl",
		"garfidea",
		"witch",
		"scout-mvm",
		"burton-ninjala",
		"defectiveturret",
		"killjoy",
		"butters-stotch",
		"lj",
		"woody",
		"collin",
		"flushed-away-sid",
		"huggy",
		"purple-face",
		"tails-aosth",
		"king-julien-sbc",
		"zephyr",
		"nimbus",
		"wind-warrior",
		"pete-townshend",
		"klug",
		"huggbees",
		"roger-daltrey",
		"scrubs",
		"jorgen-von-strangle",
		"mercy-br",
		"grant-berrios",
		"four",
		"five",
		"bfdi-six",
		"seven",
		"bfdi-x",
		"mephone4",
		"bloppy-pants",
		"hungry-pumkin",
		"fccd-spongebob",
		"manny",
		"jc-denton",
		"chandler-bing",
		"buggy",
		"mark-erickson",
		"queen-delightful",
		"grumpy-7d",
		"zone-tan",
		"earl-www",
		"taran",
		"biggayrapper",
		"spike-nelson",
		"jimmy-durante",
		"stone-stomper",
		"mike-wazowski",
		"bandit-heeler",
		"noel-gallagher",
		"anne-boonchuy",
		"cookie-masterson",
		"piglet-john-fiedler",
		"woody-jim-hanks",
		"telly-monster-1983",
		"roxie-marie",
		"water-whirl",
		"vlad_plasmius",
		"scootaloo",
		"phantom-virus",
		"stan-marsh",
		"fm-befaithful",
		"scott-woz-2021",
		"mrwhosetheboss",
		"skyrim-guard",
		"eddsworld-edd",
		"eddsworld-matt",
		"eddsworld-tom",
		"shrek-michael-gough",
		"chris-hansen",
		"toucan-sam",
		"tony-the-tiger",
		"emirichu",
		"gokudbf",
		"meta-knight",
		"hans-volter",
		"dracula-ht",
		"ellis",
		"kyle-broflovski",
		"homsar",
		"tutter",
		"sweeto",
		"daizy",
		"smitty-werben-jaegermanjensen",
		"chloe-grace-moretz",
		"walter-white",
		"left4dead-louis",
		"frieza",
		"eddsworld-tord",
		"ross-geller",
		"tony-hawk",
		"otis",
		"zoidberg",
		"rossmann",
		"jeffy-sml",
		"hawkodile",
		"roddy-st-james",
		"baby-bop",
		"casey-moten",
		"lady-dimitrescu",
		"liu-kang",
		"squilliam-fancyson",
		"princess-mindy",
		"glimmer",
		"forky",
		"eddie-the-mean-old-yeti",
		"the-toad",
		"soldier-mvm",
		"brak",
		"moo-moo-the-magician",
		"eight",
		"gwonam",
		"daisy-duck",
		"stan-smith",
		"gemcutters",
		"juice-wrld-rapping",
		"lil-peep",
		"rosita",
		"teamspeak-female",
		"dee-dee",
		"bop-it-announcer",
		"cammy",
		"arthas-menethil",
		"hhpay-yumi",
		"howard-finkel",
		"lisa-loud",
		"bubsy-pilot",
		"juri-han",
		"maria-robotnik",
		"buttercup",
		"karin",
		"grim",
		"sasha-nein",
		"talkingpierre",
		"marcy_w",
		"chief-keef",
		"sakura",
		"talkinghank",
		"yellow-face",
		"walden",
		"widget",
		"palutena",
		"ludwig-von-drake",
		"kaptain-skurvy",
		"cleveland-brown",
		"runt-of-the-litter",
		"chicken-little",
		"tracer",
		"christopher-lee",
		"grunkle-stan",
		"leonard-nimoy",
		"mr-lunt",
		"emperor-zurg",
		"talking-ben",
		"lisa-simpson",
		"elmo",
		"knuckles-sa1",
		"marinette",
		"winnie-the-pooh-narrator",
		"wildtangent-fate-narrator",
		"jack-skellington",
		"mangg-exploring-series",
		"bluey",
		"charlie-ice-scream",
		"fio",
		"maddie-flour",
		"lilian-garcia",
		"xxxtentacion-calm",
		"xxxtentacion",
		"neil-degrasse-tyson",
		"dio-jp",
		"micii2",
		"adrien-agreste",
		"mignon",
		"9-volt",
		"rod-icescream",
		"bernard-bernoulli",
		"morty",
		"mark-elliott",
		"feli",
		"nine",
		"two",
		"danny-phantom",
		"sasha-waybright",
		"loba",
		"big-band",
		"buck-cluck",
		"peppy-hare",
		"slippy-toad",
		"roll-mega-man",
		"ten",
		"falco-lombardi",
		"zecora-zebra",
		"fox-mccloud",
		"ryder-wilson",
		"scrappy-doo",
		"sentry-turret",
		"trevor-philips",
		"yzma",
		"mandy",
		"mumford",
		"tony-chimel",
		"its-a-bully",
		"jay-hunter",
		"hilda",
		"iron-man",
		"jeff-manning",
		"scary",
		"obi-wan-kenobi",
		"wubbzy",
		"sonic-jason-griffith",
		"housebroken-chief",
		"movie-trailer-voice-uno",
		"ellen",
		"justin-bieber",
		"forgetful-jones",
		"chop-chop-master-onion",
		"agnes-skinner",
		"joe-swanson",
		"donald-duck",
		"marvin-gaye-singing",
		"catra-applesauce",
		"jack-black",
		"steve-jobs",
		"patty-and-selma-bouvier",
		"mcbain",
		"milla-vodello",
		"judge-judy",
		"cat-catdog",
		"pan-dragon-ball",
		"classic-firey",
		"dark-danny",
		"dr-hibbert",
		"jimbo-jones",
		"maguire",
		"robbie-rotten",
		"seahawk",
		"carl-athf",
		"young-cricket",
		"nb-9",
		"tohru-adachi",
		"mr-sketch-marker",
		"john-oliver",
		"kyo-mi2",
		"imogen-heap",
		"james-hetfield-ajfa",
		"luther",
		"aigis",
		"dj-jackitt",
		"ice-cube",
		"manchester-metrolink",
		"kevin-cucumber",
		"scratch",
		"karen-20",
		"ronald-mcdonald",
		"dj-loggins",
		"electrolls",
		"escargoon",
		"old-man-jenkins",
		"scott-oelkers",
		"hoops",
		"dababy",
		"bullwinkle",
		"moneybags",
		"elijah-wood",
		"dib-membrane",
		"garnet",
		"peridot",
		"le-frog",
		"candy-kong",
		"comet-astroblast",
		"hev-suit",
		"kevin-futarine",
		"coach-buzzcut",
		"fate-ur-ts-tck-narrator",
		"richard-unikitty",
		"bluster-kong",
		"morrigan",
		"snoop-dogg",
		"barney-br",
		"quagmire",
		"bmo",
		"mario-golf-announcer",
		"jimmy-de-santa",
		"matt-berry",
		"zim",
		"cadence",
		"parappa",
		"ratchet",
		"dr-light",
		"sora",
		"guenther-steiner",
		"kent-brockman",
		"tyler-the-creator",
		"sagat",
		"mittens",
		"bubble-classic",
		"citv-announcer",
		"sayu",
		"phil-matibag",
		"steve-burns",
		"perceptor",
		"joe-quimby",
		"eve-nsr",
		"dj_subatomic_supernova",
		"kazuya",
		"legoshi",
		"otto-mann",
		"daphne-blake",
		"dendy",
		"pearl-krabs",
		"mona-warioware",
		"bubble-buddy",
		"the-flying-dutchman",
		"scott-the-woz",
		"wheezy",
		"john-hancock",
		"dorothy-gale",
		"alfur-aldric",
		"celestia",
		"kanji-tatsumi",
		"blupi",
		"sid-the-sloth",
		"lemon-demon",
		"fernando-costilla",
		"hans-moleman",
		"rita",
		"runt",
		"mario-sports-mix",
		"blutarch",
		"lynn-sr",
		"doc-louis",
		"rita-loud",
		"uni",
		"stella-zhau",
		"clyde-mcbride",
		"mium-ethan",
		"mc-ride",
		"marcus-reed",
		"catwoman",
		"phil-deville",
		"jschlatt",
		"chicken",
		"unikitty",
		"ruff-ruffman",
		"tabbes",
		"conscience",
		"lil-jon",
		"donkey-kong-singing",
		"george-beard-movie",
		"gigguk",
		"the-rock",
		"cinemasins",
		"mermaidman",
		"coach",
		"brian-may",
		"akemi-homura",
		"narrator-the-stanley-parable",
		"nick-l4d",
		"cow",
		"instructor-mooselini",
		"smk",
		"ghost-host",
		"rorry-poptv",
		"stephen-fry",
		"chao",
		"pepper-roni",
		"fandroid",
		"larry-the-lobster",
		"fred-durst",
		"knockout",
		"agent-ulgrin",
		"smash-mouth",
		"komaru-naegi",
		"resort-owner",
		"norm-macdonald",
		"groundskeeper-willie",
		"sideshow-mel",
		"chadtronic",
		"bfb-clock",
		"royce-da-5-9",
		"teleshop-90s-br",
		"mark-zuckerberg",
		"drive-thru-whale",
		"redmond",
		"knux-sonicsong182",
		"travis-scott-rapping",
		"blaze-the-cat",
		"tikal",
		"red-guy",
		"chris-mclean",
		"fccd-squidward",
		"cindy-vortex",
		"jim-ross",
		"rigby",
		"albert-einstein",
		"crash-bandicoot-csb-promo",
		"kang",
		"kodos",
		"captain-salt",
		"the-french-narrator-rotfd",
		"squeaky-voice-teen",
		"nicole-watterson",
		"looney-tunes-granny",
		"momoe-nagisa",
		"krusty",
		"martin-prince",
		"unikitty-show",
		"mega-man",
		"warioware",
		"marvin-the-martian-alaskey",
		"strong-sad",
		"p5-joker",
		"herbert-the-pervert",
		"kirby-tiff",
		"ferb",
		"strong-mad",
		"licorice-cookie",
		"camille_lol",
		"professor-oak",
		"chris-griffin",
		"toad",
		"kurzgesagt",
		"piglet-steve-schatzberg",
		"male-senior-asian",
		"lilac-cookie",
		"tigger",
		"francis-l4d",
		"gumball",
		"hugh-neutron",
		"oblivion-guard",
		"fred-br",
		"project-m-announcer",
		"red-queen",
		"sergeant-hartman",
		"8-ball",
		"susie-carmichael",
		"shao-kahn",
		"xj-9",
		"sylvester-joe-alaskey",
		"professor-farnsworth",
		"tp_announcer",
		"shroomy",
		"spongebob",
		"willie-rushton",
		"franklin-clinton",
		"draco",
		"stewie-griffin",
		"mr-barnacle",
		"eugene-from-mao-mao",
		"trixie",
		"luna",
		"ringo",
		"limestone",
		"discord",
		"max-caulfield",
		"scp-049",
		"cousin-fred",
		"farmer-ben",
		"cozy-glow",
		"elmo-1984",
		"ironhide",
		"big-mac",
		"linus-van-pelt",
		"applebloom",
		"hhpay-kaz",
		"gonta-l2m",
		"mei",
		"richard-hammond",
		"jacksucksatlife",
		"tim",
		"katamari-king",
		"krazy-kat",
		"heffer-wolfe",
		"filburt",
		"e40",
		"rocky-cocoa",
		"abe-simpson",
		"velma",
		"disney_channel",
		"michael-de-santa",
		"waluigi",
		"king-snugglemagne",
		"shout",
		"king-julien-dj",
		"oscar-the-grouch",
		"mordecai",
		"2pac-speaking",
		"ludacris",
		"wii-sports-club",
		"tomás-rebero-pellejero",
		"chris-thorndyke",
		"robertstack",
		"george-carlin",
		"jerma985",
		"clancy-wiggum",
		"waylon-smithers",
		"element-animation-villager",
		"pyrocynical",
		"carl-carlson",
		"pat-sajak",
		"lucy-van-pelt",
		"optimus-prime",
		"rise-kujikawa",
		"jimmy-hopkins",
		"ana-br",
		"mccree-br",
		"brigitte-br",
		"jotaro-jp",
		"lenny-leonard",
		"tech-n9ne",
		"verbal-ase",
		"mario-fuwa",
		"minnie-mouse",
		"nick-wilde",
		"sonics-schoolhouse",
		"wakko-warner",
		"el-chavo",
		"jboogie",
		"will-tts",
		"emerald-herald",
		"popcorn",
		"mao-mao",
		"freddie-benson",
		"astro-boy",
		"eminem-freestyle",
		"luna-loud",
		"zuzu",
		"professor-frink",
		"dave-gahan",
		"megatron",
		"omni-man",
		"funky-kong",
		"adorabat",
		"bev-bighead",
		"birthday-boy-blam",
		"badgerclops",
		"freddie-mercury-speaking",
		"monokuma",
		"red-warioware",
		"otgw-greg",
		"wirt",
		"fire-keeper",
		"beatrice",
		"elsa",
		"chuck-e-cheese",
		"billymays",
		"applejack",
		"fluttershy",
		"pinkie-pie",
		"rarity",
		"rainbow-dash",
		"heston",
		"connie-maheswaran",
		"twilight-sparkle",
		"razputin-aquato",
		"abby-archer",
		"mrbeast",
		"tails-colleen",
		"the-ancestor",
		"odyssey",
		"boopkins",
		"cave-johnson",
		"big-bird",
		"rec-room-coach",
		"rick-ross",
		"grover",
		"kowalski",
		"rad",
		"balto",
		"ed-bighead",
		"dr-judith-mossman",
		"pinky-dinky-doo",
		"wii-sports-announcer",
		"matpat",
		"dr-doofenshmirtz",
		"stingy",
		"orc-a",
		"john-parker-hammond",
		"gru",
		"foghorn-leghorn",
		"monster",
		"empirrre",
		"ss-home-video-announcer",
		"benson",
		"big",
		"annoyingorange",
		"patolino",
		"paco-bravo",
		"espio-the-chameleon",
		"doug-funnie",
		"charmy-bee-ab",
		"lightning-mcqueen-cool-videos",
		"mike-matei-as-inspector-gadget",
		"11-45-g",
		"dumb-liono",
		"mr-x",
		"winnie-the-pooh",
		"lavenza",
		"orthopox",
		"cryptosporidium-137",
		"chihaya",
		"eijiro-kirishima",
		"k-vrc",
		"naoto",
		"xbot-4000",
		"technoblade",
		"kaede-akamatsu",
		"telly-monster",
		"mr-peabody",
		"oswald",
		"caroline",
		"daffy-duck-alasky",
		"musse-egret",
		"mario-sunshine",
		"sugar-belle",
		"classic-tord",
		"goofy",
		"101-dalmatians-lucky",
		"randall-boggs",
		"milhouse",
		"6ix9ine",
		"mr-burns",
		"mojo-jojo",
		"nelson-muntz",
		"mr-crocker",
		"professor-utonium",
		"barney-1990",
		"bart-simpson",
		"tyler-perry",
		"pa-grape-2000",
		"dk-rap",
		"dq-lips",
		"spongebob-uncle-al",
		"johnny-silverhand",
		"jhgv",
		"gir",
		"pulisic",
		"timmy-turner",
		"pit",
		"niko-bellic",
		"isaac-kleiner",
		"merasmus",
		"james-may",
		"candace-flynn",
		"marge-simpson",
		"blaze-movie-fan",
		"awesome-possum",
		"wally-walrus-br",
		"reeceduh",
		"jimmy-neutron",
		"cotton-hill",
		"moe-szyzlak",
		"garrus-vakarian",
		"fernanfloo",
		"man-ray",
		"ned-flanders",
		"coach-z",
		"homestar-runner",
		"teddy-roosevelt",
		"bubs",
		"goro-akechi",
		"shawn_boy_meets_world",
		"scp035",
		"mrs-krabappel",
		"burt-curtis",
		"lili-zanotto",
		"dr-loboto",
		"tanya-keys",
		"frazie",
		"risky-boots",
		"apu",
		"sam-i-am",
		"callmecarson",
		"pepper-ann",
		"dennis-prager",
		"homer-simpson",
		"mrping",
		"phineas",
		"ultron",
		"lexi-bunny",
		"david-bazookie",
		"private",
		"rick-sanchez-es",
		"mf-doom",
		"ko",
		"shoto-todoroki",
		"steven",
		"valt-aoi-es",
		"popeye",
		"coach-oleander",
		"todd-hayseed",
		"danger-duck",
		"izuku-midoriya",
		"rex",
		"blitz",
		"bottle_bfdi",
		"compton-boole",
		"lightning_bfb",
		"housebroken-elsa",
		"bj",
		"karen-the-computer",
		"seymour-skinner",
		"pie-bfdi",
		"ttc-subway",
		"cake_bfb",
		"twou-snow",
		"bumblebee",
		"sam-boole",
		"dogen-boole",
		"atstbis-guy",
		"popular-mmos",
		"madame-blueberry",
		"chalmers",
		"tree_bfdi",
		"madame-blueberry-90s",
		"meg-griffin",
		"weird-al",
		"nick-valentine",
		"guy-am-i",
		"mrs-puff",
		"bart-simpson-la",
		"comic-book-guy",
		"yahtzee-croshaw",
		"ralph-wiggum",
		"pen-bfdi",
		"enid",
		"crossbreed-priscilla",
		"spike",
		"pin_bfb",
		"scooby-doo",
		"dr-richard-keller",
		"yuuki-mishima",
		"susanwabbajack",
		"jaden-yuki",
		"vana-glama",
		"king-harkinian",
		"homer-tus-s1",
		"bill-gates-1995",
		"charlie-brown",
		"ringo-starr",
		"chip",
		"chiaki-nanami",
		"kokichi-ouma",
		"lumpy",
		"cream-the-rabbit",
		"ice-bear",
		"shrek",
		"knuckles-tw",
		"alexis-rhodes",
		"the-gamer-from-mars",
		"fred-jones",
		"elora",
		"sheriff",
		"toxin_tractor",
		"lincoln-loud",
		"nagito-komaeda",
		"plankton",
		"peaches",
		"peppa-narrator",
		"skipper-ds",
		"katara-siari",
		"kyu-sugardust",
		"hotel-mario",
		"jimmy-gourd",
		"emily-kaldwin",
		"amy-rose",
		"megaman-x-x7",
		"axl_x7",
		"small",
		"peter-griffin",
		"dora",
		"rouge-the-bat-ks",
		"smm-edit",
		"zero_x7",
		"petunia-rhubarb",
		"yosuke",
		"speedy-gonzales",
		"littlefoot",
		"chie-satonaka",
		"yukiko",
		"jfk-clone-high",
		"ryu",
		"ken-masters",
		"cdi-zelda",
		"zro",
		"dot-warner",
		"george-harrison",
		"the-brain",
		"barnacle-boy",
		"pinky",
		"chun-li",
		"ike",
		"hajime-hinata",
		"cadpig",
		"kyoko-kirigiri",
		"bob-esponja-sp",
		"meatwad",
		"teddie",
		"yakko-warner",
		"barney-gumble",
		"tails",
		"rouge-the-bat-kd",
		"11th-doctor",
		"captain-lou-albano",
		"rolf",
		"garfield-jb",
		"spyro",
		"max-goof",
		"hal-9000",
		"xp-narrator",
		"barry-b-benson",
		"e40-speaking",
		"ellie-iceage",
		"facade-trip",
		"facade-grace",
		"strong-bad",
		"theneedledrop",
		"alan-watts",
		"valt-aoi-es",
		"fish-head",
		"toretto-la",
		"paul-mccartney",
		"bbbh-bear",
		"smash64",
		"zillakami",
		"larry-bundy-jr",
		"amy-rose-cr",
		"smashmelee",
		"reggie-rocket-100",
		"yoshikage-kira",
		"king-k-rool",
		"floppy",
		"dotcsv",
		"dagames-sing",
		"modern-vintage-gamer",
		"tobias-wilson",
		"barney",
		"odalia-blight",
		"eazyspeezyyt",
		"swankybox",
		"chris-tarrant",
		"shaggy",
		"fnf-skid",
		"meowth",
		"pyra",
		"tawna",
		"spyro-hunter",
		"pump",
		"brian-cummings",
		"wallace",
		"thomas-narrator",
		"rocko-wallaby",
		"mr-bump",
		"baldi",
		"general-skarr",
		"gonta",
		"hades",
		"mythra-xenoblade",
		"angel-dust",
		"tankman",
		"makoto-naegi",
		"flash",
		"riddick",
		"reggie-rocket-movin-62",
		"kani-maki",
		"lanternaverde",
		"rockfferburt",
		"principal-of-the-thing",
		"chihiro-fujisaki",
		"hamtaro-howdy",
		"duke-nukem",
		"donaldducc",
		"sarah_martin",
		"tails-kate-higgins",
		"daria",
		"caitlin-cooke",
		"capter-saltacle",
		"lumpy-space-princess",
		"boomerang-announcer",
		"gregory-fnaf",
		"larry-veggietales",
		"chiro-jetix",
		"craig-williams-cotc",
		"spy",
		"drake-la",
		"max",
		"felix-biederman",
		"sam",
		"jacksfilms",
		"spongy-the-pirate",
		"widowmaker",
		"mr-rogers",
		"farmer-alfred",
		"phil-swift",
		"half-life-transit-system",
		"byakuya-togami",
		"alyx-vance-hla",
		"bugs-bunny-joe-alaskey",
		"mickey-mouse",
		"powdered-toast-man",
		"adam-driver",
		"erza-scarlet",
		"john-lennon",
		"video-games-and-more",
		"butthead",
		"rick-ross-pronu-dictionary",
		"will-smith-talking",
		"zwf",
		"studio",
		"sam-lachow",
		"studio",
		"big-gay",
		"studio",
		"b-la-b",
		"studio",
		"jsxi",
		"studio",
		"relikk",
		"studio",
		"tag",
		"studio",
		"beavis",
		"rocko-wallaby-aott",
		"theodd1sout",
		"riley-daring",
		"skid3422",
		"security-guard",
		"half-life-scientist",
		"mater",
		"oliepolie",
		"ssbb-announcer",
		"larry-late90s",
		"proto",
		"jeremy-clarkson",
		"papierwaite",
		"soldier76",
		"markiplier",
		"mabel-pines",
		"norbert-beaver",
		"bob-late90s",
		"blocky",
		"sir-david-attenborough",
		"ahit-conductor",
		"ahit-seal",
		"marioismissing",
		"norbert-beaver",
		"dimitri",
		"reapergabereyes",
		"bob-veggietales",
		"mutahar",
		"e102-gamma",
		"lollipop",
		"karen_savage",
		"circus-baby",
		"thomas-the-tank",
		"bob-ross",
		"engineer",
		"2pac-chill",
		"trent-reznor",
		"steveharvey",
		"michaelstevens",
		"norma",
		"michaelrosen",
		"psychicpebbles",
		"bruno-powroznik",
		"cypher-valorant",
		"trebek",
		"patrickstewart",
		"gisu",
		"jfk",
		"maligula",
		"poof",
		"mario-fundamentals",
		"phoenix-csgo",
		"tyler-dinky-doo",
		"papa-smurf",
		"sybil-pandemik",
		"linustt",
		"arte",
		"soldier76",
		"im-meen",
		"glados",
		"freddie-mercury",
		"superball",
		"lola-mbola",
		"fdr",
		"3kliksphilip",
		"eminem-young",
		"olive",
		"eminem",
		"dion-aquato",
		"todd-daring",
		"elton-john",
		"coco",
		"bill-cipher",
		"taco",
		"elizabeth",
		"daxter",
		"benshapiro",
		"2pac",
		"ray_rbt",
		"phoenix",
		"kanye-west-rap",
		"jayz",
		"phoenix-wright",
		"cdi-link",
		"sweetie-belle",
		"king-dedede",
		"slinkman",
		"blossom",
		"kirby-tuff",
		"easy-pete",
		"yes-man",
		"spongebob-squarepants",
		"david-seville",
		"eda-clawthorne",
		"miu-iruma",
		"hooty",
		"hugodavies",
		"gaben",
		"eos",
		"hendrix",
		"playboicarti",
		"vector-the-crocodile",
		"shuichisaihara",
		"mailman",
		"liluzivert",
		"mephilesthedark",
		"toychica",
		"lumpus",
		"bill-l4d",
		"emperor-belos",
		"aggressive-sniper",
		"mr-mackey",
		"officerbarbrady",
		"hunter-owl-house",
		"shulk",
		"pj-berri",
		"capncrunch",
		"nedgerblanski",
		"joe-chin",
		"grandma-squarepants",
		"captain-fussenpepper",
		"dexter",
		"giulia-marcovaldo",
		"peacock",
		"strong",
		"dio",
		"greg-page",
		"marty-mcfly",
	];
	var character = characters[Math.floor(Math.random() * characters.length)];

	let server = global.servers[message.guild.id];

	let vc = message.member.voice.channel;
	if (vc === undefined) {
		message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
		return;
	}
	getAudioUrl("pub_suwbkktlrzjhkfmhtv", "***REMOVED***", character, text).then((url) => {
        message.channel.send(`${character} says, "${text}"`)
		UTIL.playUrl(url, vc);
	});
};

exports.help = () => {
	return "Text to Speech, but less annoying...";
};

exports.docs = () => {
	let docs = {
		default_access: 1,
		tab: "Misc",
		link: "general",
		parent: "",
		full_command: "utts",
		command: "utts",
		description: "Converts Text to Speech using UberDuck.ai API.",
		syntax: "utts [text to convert]",
		examples: [
			{
				description: "Say 'Hello fellow humans'",
				code: `utts Hello fellow humans`,
			},
		],
	};
	return docs;
};
