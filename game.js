const songs = [
  {
    title: "Bohemian Rhapsody",
    artist: "Queen",
    language: "international",
    decade: "1970s",
    genres: ["rock"],
    playlists: ["rock-classics"],
    answers: ["Bohemian Rhapsody", "Don't Stop Me Now", "We Will Rock You", "Another One Bites the Dust"]
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    language: "international",
    decade: "2010s",
    genres: ["pop"],
    playlists: ["global-hits", "global-pop", "breaking-pop", "tiktok-hits", "todays-hits", "viral-hits", "pop-all-stars"],
    answers: ["Perfect", "Thinking Out Loud", "Shape of You", "Photograph"]
  },
  {
    title: "bad guy",
    artist: "Billie Eilish",
    language: "international",
    decade: "2010s",
    genres: ["pop"],
    playlists: ["global-hits", "global-pop", "breaking-pop", "tiktok-hits", "viral-pop", "viral-hits", "pop-all-stars"],
    answers: ["lovely", "bad guy", "Happier Than Ever", "Ocean Eyes"]
  },
  {
    title: "Rolling in the Deep",
    artist: "Adele",
    language: "international",
    decade: "2010s",
    genres: ["pop", "ballad"],
    playlists: ["global-hits", "global-pop", "viral-pop", "todays-hits", "pop-all-stars"],
    answers: ["Hello", "Someone Like You", "Easy on Me", "Rolling in the Deep"]
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    language: "international",
    decade: "2010s",
    genres: ["pop"],
    playlists: ["global-hits", "global-pop", "viral-pop", "todays-hits", "viral-hits", "pop-all-stars"],
    answers: ["Save Your Tears", "Starboy", "Blinding Lights", "The Hills"]
  },
  {
    title: "ถ้าเราเจอกันอีก (Until Then)",
    artist: "Tilly Birds",
    language: "thai",
    decade: "2020s",
    genres: ["pop", "rock"],
    playlists: ["thai-hits", "viral-pop", "viral-hits"],
    answers: ["ถ้าเราเจอกันอีก (Until Then)", "เพื่อนเล่น ไม่เล่นเพื่อน", "ลู่วิ่ง", "คิด(แต่ไม่)ถึง"]
  },
  {
    title: "โต๊ะริม",
    artist: "NONT TANONT",
    language: "thai",
    decade: "2020s",
    genres: ["pop", "ballad"],
    playlists: ["thai-hits", "todays-hits", "pop-all-stars"],
    answers: ["โต๊ะริม", "รักแรก", "ฝืนตัวเองไม่เป็น", "พิง"]
  },
  {
    title: "ซ่อนกลิ่น",
    artist: "Palmy",
    language: "thai",
    decade: "2010s",
    genres: ["pop", "ballad"],
    playlists: ["thai-hits", "todays-hits"],
    answers: ["คิดมาก", "ซ่อนกลิ่น", "อยากร้องดังดัง", "กาลครั้งหนึ่ง"]
  },
  {
    title: "คุกเข่า",
    artist: "Cocktail",
    language: "thai",
    decade: "2010s",
    genres: ["rock"],
    playlists: ["thai-hits", "rock-classics"],
    answers: ["เธอ", "คู่ชีวิต", "คุกเข่า", "โปรดเถิดรัก"]
  },
  {
    title: "ทรงอย่างแบด",
    artist: "Paper Planes",
    language: "thai",
    decade: "2020s",
    genres: ["rock"],
    playlists: ["thai-hits", "tiktok-hits", "viral-hits", "rock-classics"],
    answers: ["เสแสร้ง", "ทรงอย่างแบด", "ชัดเจน", "ชอบที่เธอเป็นเธอ"]
  }
];

const deezerGenreIds = {
  pop: 132,
  rap: 116,
  rock: 152,
  latin: 197,
  rnb: 165,
  electronic: 106,
  metal: 464,
  thai: null
};

const playlistSearchTerms = {
  "global-hits": ["Global Hits", "Top Worldwide"],
  "global-pop": ["Global Pop", "Pop Party"],
  "breaking-pop": ["Breaking Pop", "New Pop", "Pop Rising"],
  "tiktok-hits": ["TikTok Hits", "TikTok Hits World"],
  "viral-pop": ["Viral Pop", "Viral Hits"],
  "todays-hits": ["Today's Hits", "Top Hits"],
  "viral-hits": ["Viral Hits", "TikTok Hits World"],
  "pop-all-stars": ["Pop All Stars", "Pop Party"],
  "thai-rap": ["Thailand Rap Hip Hop"],
  "thai-rock": ["Thai Rock"],
  "rock-classics": ["Rock Classics", "Rock Super Hits", "Rock Essentials"],
  "kpop-hits": ["Top K-Pop", "K-Pop Essentials"],
  "rap-hits": ["Hot Urban"],
  "rap-2020s": ["2020s Rap"],
  "latin-hits": ["Fuego Latino"],
  "latin-new": ["New Latin"],
  "rnb-hits": ["R&B Hits"],
  "rnb-chill": ["Chill R&B"],
  "electronic-hits": ["Electronic Hits"],
  "electronic-new": ["New Dance"],
  "country-hits": ["Country Hits"],
  "country-essentials": ["Country Essentials"],
  "metal-essentials": ["Metal Essentials"],
  "power-ballads": ["Power Ballads"]
};
const deezerPlaylistIds = {
  "thai-rap": 14799200823,
  "rap-hits": 1677006641,
  "rap-2020s": 12547421383,
  "latin-hits": 178699142,
  "latin-new": 3279798822,
  "rnb-hits": 1999466402,
  "rnb-chill": 3196481502,
  "electronic-hits": 1902101402,
  "electronic-new": 2249258602,
  "country-hits": 1130102843,
  "country-essentials": 1294431447,
  "metal-essentials": 2655390504,
  "power-ballads": 1030833471
};

let questionTime = 10;
const $ = id => document.getElementById(id);

let playerName = "";
let gameSongs = [];
let catalogSongs = [];
let catalogSourceSongs = [];
let catalogLoading = false;
let catalogError = "";
let catalogWarning = "";
let catalogRequestId = 0;
let catalogRefreshTimer;
let catalogLoadInProgress = false;
let catalogRefreshPending = false;
let searchCatalogTimer;
let questionIndex = 0;
let score = 0;
let correctAnswers = 0;
let seconds = questionTime;
let timer;
let answered = false;
let selectedAnswer = null;
let selectedAnswerElapsed = null;
let timerStarted = false;
let questionStartedAt = 0;
let activeSong = null;
let fallbackAttempted = false;
let previewRequestId = 0;
let requestedRounds = 10;
let streak = 0;
let gameHistory = [];
let timerPausedAt = 0;
let timerPausedElapsed = 0;
let availableArtists = [...new Set(songs.map(song => song.artist))];
const availableArtistDetails = new Map();
const artistGenreCache = new Map();
let artistSearchRequestId = 0;
const deezerCache = new Map();
const deezerPlaylistInfo = new Map();
const appleArtistCatalogCache = new Map();

const genreOptions = [
  { id: "pop", label: "♫ ป๊อป" },
  { id: "rap", label: "♩ แรป" },
  { id: "rock", label: "♧ ร็อก" },
  { id: "latin", label: "♪ ละติน" },
  { id: "rnb", label: "♫ R&B" },
  { id: "electronic", label: "ϟ อิเล็กทรอนิก" },
  { id: "kpop", label: "☆ K-Pop" },
  { id: "thai", label: "🇹🇭 Thai" },
  { id: "country", label: "♧ คันทรี" },
  { id: "metal", label: "♜ เมทัล" },
  { id: "ballad", label: "♡ บัลลาด" }
];

const decadeOptions = ["2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s"];

const playlistOptions = [
  { id: "global-hits", title: "Global Hits", subtitle: "เพลงฮิตทั่วโลก", icon: "🌕", style: "global" },
  { id: "global-pop", title: "Global Pop", subtitle: "ป๊อปอินเตอร์", icon: "◉", style: "pink" },
  { id: "breaking-pop", title: "Breaking Pop", subtitle: "ป๊อปมาแรง", icon: "✦", style: "orange" },
  { id: "tiktok-hits", title: "TikTok Hits", subtitle: "ไวรัลหลายแนว", icon: "♪", style: "silver" },
  { id: "viral-pop", title: "Viral Pop", subtitle: "ป๊อปไวรัล", icon: "◌", style: "dots" },
  { id: "todays-hits", title: "Today's Hits", subtitle: "ฮิตวันนี้", icon: "♫", style: "gold" },
  { id: "viral-hits", title: "Viral Hits", subtitle: "เพลงไวรัลหลายแนว", icon: "✺", style: "rainbow" },
  { id: "pop-all-stars", title: "Pop All Stars", subtitle: "ป๊อปยอดนิยม", icon: "★", style: "stars" },
  { id: "thai-hits", title: "Thai Pop Hits", subtitle: "เพลงป๊อปไทย", icon: "🇹🇭", style: "thai" },
  { id: "thai-rap", title: "Thai Rap", subtitle: "แรปและฮิปฮอปไทย", icon: "🎤", style: "thai" },
  { id: "thai-rock", title: "Thai Rock", subtitle: "ร็อกไทย", icon: "⚡", style: "rock" },
  { id: "rock-classics", title: "Rock Classics", subtitle: "ร็อกคลาสสิก", icon: "⚡", style: "rock" },
  { id: "kpop-hits", title: "Top K-Pop", subtitle: "เคป๊อปยอดนิยม", icon: "☆", style: "pink" },
  { id: "rap-hits", title: "Hot Urban", subtitle: "ฮิปฮอปและแรป", icon: "🎤", style: "orange" },
  { id: "rap-2020s", title: "2020s Rap", subtitle: "แรปยุค 2020s", icon: "♩", style: "silver" },
  { id: "latin-hits", title: "Fuego Latino", subtitle: "ฮิตละติน", icon: "🔥", style: "orange" },
  { id: "latin-new", title: "New Latin", subtitle: "เพลงละตินใหม่", icon: "♪", style: "pink" },
  { id: "rnb-hits", title: "R&B Hits", subtitle: "อาร์แอนด์บีฮิต", icon: "◉", style: "gold" },
  { id: "rnb-chill", title: "Chill R&B", subtitle: "อาร์แอนด์บีฟังสบาย", icon: "◌", style: "dots" },
  { id: "electronic-hits", title: "Electronic Hits", subtitle: "อิเล็กทรอนิกฮิต", icon: "ϟ", style: "silver" },
  { id: "electronic-new", title: "New Dance", subtitle: "แดนซ์มาใหม่", icon: "✦", style: "rainbow" },
  { id: "country-hits", title: "Country Hits", subtitle: "คันทรีฮิต", icon: "♧", style: "gold" },
  { id: "country-essentials", title: "Country Essentials", subtitle: "คันทรีคลาสสิก", icon: "★", style: "orange" },
  { id: "metal-essentials", title: "Metal Essentials", subtitle: "เมทัลคลาสสิก", icon: "⚡", style: "rock" },
  { id: "power-ballads", title: "Power Ballads", subtitle: "บัลลาดทรงพลัง", icon: "♡", style: "stars" }
];
const playlistGenres = {
  "global-pop": ["pop", "ballad"],
  "breaking-pop": ["pop"],
  "tiktok-hits": ["pop", "rap", "kpop"],
  "viral-pop": ["pop", "kpop"],
  "todays-hits": ["pop", "rap", "rnb"],
  "viral-hits": ["pop", "rap", "kpop"],
  "pop-all-stars": ["pop"],
  "thai-hits": ["thai", "pop"],
  "thai-rap": ["thai", "rap"],
  "thai-rock": ["thai", "rock"],
  "rock-classics": ["rock", "metal"],
  "kpop-hits": ["kpop"],
  "rap-hits": ["rap"],
  "rap-2020s": ["rap"],
  "latin-hits": ["latin"],
  "latin-new": ["latin"],
  "rnb-hits": ["rnb"],
  "rnb-chill": ["rnb"],
  "electronic-hits": ["electronic"],
  "electronic-new": ["electronic"],
  "country-hits": ["country"],
  "country-essentials": ["country"],
  "metal-essentials": ["metal"],
  "power-ballads": ["ballad"]
};

const artistColors = ["lavender", "blue", "orange", "pink", "teal", "purple", "rose", "gold", "aqua", "green"];
const featuredThaiArtists = [
  ["4EVE", 147854632, "https://cdn-images.dzcdn.net/images/artist/14796625a6b64a06204bc20b6dbb9d85/250x250-000000-80-0-0.jpg"],
  ["Asanee & Wasan", 7163222, "https://cdn-images.dzcdn.net/images/artist/a820f36f9cbd6b0a30375e640e38d584/250x250-000000-80-0-0.jpg"],
  ["BamBam", 496497, "https://cdn-images.dzcdn.net/images/artist/bfe0212f3b42314286e40835cef7d63e/250x250-000000-80-0-0.jpg"],
  ["Big Ass", 254376, "https://cdn-images.dzcdn.net/images/artist/489bb19663754af7d0636d20b0fbf4c8/250x250-000000-80-0-0.jpg"],
  ["Billkin", 91638912, "https://cdn-images.dzcdn.net/images/artist/8957de3c15fbd7238168fccad6e3f9c0/250x250-000000-80-0-0.jpg"],
  ["Bodyslam", 254379, "https://cdn-images.dzcdn.net/images/artist/a70f32943e4fb92e3855cea5476b3edb/250x250-000000-80-0-0.jpg"],
  ["BOWKYLION", 12014886, "https://cdn-images.dzcdn.net/images/artist/9395b2aa0365d45b68ec9a9238dcccbe/250x250-000000-80-0-0.jpg"],
  ["BUS", 252580, "https://cdn-images.dzcdn.net/images/artist/b1c4fb552b8d4479c82d1beb42a64b32/250x250-000000-80-0-0.jpg"],
  ["Cocktail", 85076742, "https://cdn-images.dzcdn.net/images/artist/e458b9580092703a94b749d1e9bc1816/250x250-000000-80-0-0.jpg"],
  ["Da Endorphine", 254398, "https://cdn-images.dzcdn.net/images/artist/e670b8675cfb6967eeecd2b574ded98d/250x250-000000-80-0-0.jpg"],
  ["F.HERO", 48414692, "https://cdn-images.dzcdn.net/images/artist/296d449992dee41f80750580eac930db/250x250-000000-80-0-0.jpg"],
  ["Getsunova", 4295772, "https://cdn-images.dzcdn.net/images/artist/ddb1f18256ee99f59c18425d76e93233/250x250-000000-80-0-0.jpg"],
  ["INK WARUNTORN", 10618179, "https://cdn-images.dzcdn.net/images/artist/5cb4dbb427123a1f4a1df912eeea97dc/250x250-000000-80-0-0.jpg"],
  ["Jeff Satur", 102235992, "https://cdn-images.dzcdn.net/images/artist/ee476f4e46c8570b14af66fd8fb8593d/250x250-000000-80-0-0.jpg"],
  ["Joey Phuwasit", 177268177, "https://cdn-images.dzcdn.net/images/artist/47fc4bacb41456a402e0c59a5ce9480f/250x250-000000-80-0-0.jpg"],
  ["Klear", 378594871, "https://cdn-images.dzcdn.net/images/artist/a38f7654477ac3698d1c9454e202023a/250x250-000000-80-0-0.jpg"],
  ["Lipta", 1569537, "https://cdn-images.dzcdn.net/images/artist/60ff9d8ac4974e4fef6a812e2bb58a7b/250x250-000000-80-0-0.jpg"],
  ["Lula", 406580722, "https://cdn-images.dzcdn.net/images/artist/47ea88fdd703b1572c9ade39c3e55485/250x250-000000-80-0-0.jpg"],
  ["MeYou", 5898603, "https://cdn-images.dzcdn.net/images/artist/bc4faca31209b27adb7d3c27259195f5/250x250-000000-80-0-0.jpg"],
  ["MILLI", 283900611, "https://cdn-images.dzcdn.net/images/artist/c150a6f2aa43e807190ae9296a96c454/250x250-000000-80-0-0.jpg"],
  ["NONT TANONT", 10571343, "https://cdn-images.dzcdn.net/images/artist/b5d352c1dd32d42a73f0d2a5d2cb2997/250x250-000000-80-0-0.jpg"],
  ["Palmy", 95530412, "https://cdn-images.dzcdn.net/images/artist/08864e46bc84c89bd05a9a27ccf83742/250x250-000000-80-0-0.jpg"],
  ["Paper Planes", 353537, "https://cdn-images.dzcdn.net/images/artist/703e1790c4b40f2c5cd24343d5d5efcf/250x250-000000-80-0-0.jpg"],
  ["Polycat", 251578, "https://cdn-images.dzcdn.net/images/artist/21e325c662f858675fadd3d363a5e0e2/250x250-000000-80-0-0.jpg"],
  ["Potato", 114374582, "https://cdn-images.dzcdn.net/images/artist/c022ce112a6f393ae91bd5d4f45ed693/250x250-000000-80-0-0.jpg"],
  ["PP Krit", 130262792, "https://cdn-images.dzcdn.net/images/artist/03ef9c7634260640f8a3582f0c974a6e/250x250-000000-80-0-0.jpg"],
  ["PROXIE", 406577472, "https://cdn-images.dzcdn.net/images/artist/bb2ba0a7655d35cf7302e0ac2ca9096f/250x250-000000-80-0-0.jpg"],
  ["Silly Fools", 252251, "https://cdn-images.dzcdn.net/images/artist/602f5926b507d1784a9ef1875a6ea7ac/250x250-000000-80-0-0.jpg"],
  ["Slot Machine", 77497, "https://cdn-images.dzcdn.net/images/artist/2b5cc1b1b2f1c403a3b4127341ac822f/250x250-000000-80-0-0.jpg"],
  ["THE TOYS", 66407, "https://cdn-images.dzcdn.net/images/artist/83e64337ef6292963066e6602580b928/250x250-000000-80-0-0.jpg"],
  ["Three Man Down", 10375964, "https://cdn-images.dzcdn.net/images/artist/14155fab9d68ad7795910acbea84bb41/250x250-000000-80-0-0.jpg"],
  ["Tilly Birds", 6995343, "https://cdn-images.dzcdn.net/images/artist/2a2fdc164b3bc1698474d3c409e4ebd5/250x250-000000-80-0-0.jpg"],
  ["Tattoo Colour", 4068142, "https://cdn-images.dzcdn.net/images/artist/1e06da1785599b28f725cc46dd4c640d/250x250-000000-80-0-0.jpg"],
  ["UrboyTJ", 10061508, "https://cdn-images.dzcdn.net/images/artist/41756f1780753407ac4362aee66e5d3e/250x250-000000-80-0-0.jpg"],
  ["YOUNGOHM", 12435342, ""],
  ["Violette Wautier", 8595772, "https://cdn-images.dzcdn.net/images/artist/45c4f0e3439782a84bb56040f3370811/250x250-000000-80-0-0.jpg"]
];
const thaiRapArtists = new Set(["F.HERO", "MILLI", "UrboyTJ", "YOUNGOHM"]);
const thaiRockArtists = new Set([
  "Asanee & Wasan",
  "Big Ass",
  "Bodyslam",
  "Cocktail",
  "Klear",
  "Paper Planes",
  "Potato",
  "Silly Fools",
  "Slot Machine",
  "Three Man Down",
  "Tilly Birds",
  "Tattoo Colour"
]);
const featuredKpopArtists = [
  ["aespa", 113547672, "https://cdn-images.dzcdn.net/images/artist/c963d7469a999feb764ad6f16c31dd74/250x250-000000-80-0-0.jpg"],
  ["BIGBANG", 371377201, "https://cdn-images.dzcdn.net/images/artist/be63daf5caa22602c48b161c5e416954/250x250-000000-80-0-0.jpg"],
  ["BLACKPINK", 10803980, "https://cdn-images.dzcdn.net/images/artist/89675729453893a91be35bde691050ff/250x250-000000-80-0-0.jpg"],
  ["BTS", 67158112, "https://cdn-images.dzcdn.net/images/artist/bc3b771bc45855bb9a79d606aeba3a95/250x250-000000-80-0-0.jpg"],
  ["ENHYPEN", 267273642, "https://cdn-images.dzcdn.net/images/artist/5d10e7d0b265dcbb25e7f47bd09e533f/250x250-000000-80-0-0.jpg"],
  ["EXO", 70771002, "https://cdn-images.dzcdn.net/images/artist/28fee108b11dbdf79e4ab425f599736f/250x250-000000-80-0-0.jpg"],
  ["Girls' Generation", 1310497, "https://cdn-images.dzcdn.net/images/artist/8e2c5ba1fc6eba4a25d5d5e76b3b66e4/250x250-000000-80-0-0.jpg"],
  ["IVE", 153042452, "https://cdn-images.dzcdn.net/images/artist/8e7b4075c17bd7a611f8cae3bfbf3c40/250x250-000000-80-0-0.jpg"],
  ["IU", 2810121, "https://cdn-images.dzcdn.net/images/artist/77db068a01f0d214f33868d676d6ebc5/250x250-000000-80-0-0.jpg"],
  ["Jung Kook", 248616612, "https://cdn-images.dzcdn.net/images/artist/e6bdcb96941d28f6a1b0f3285fec8413/250x250-000000-80-0-0.jpg"],
  ["LE SSERAFIM", 168158797, "https://cdn-images.dzcdn.net/images/artist/e789ab2d16cad9a738cd83722940512b/250x250-000000-80-0-0.jpg"],
  ["LISA", 11446194, "https://cdn-images.dzcdn.net/images/artist/d3b778b122f0cd77d58b3806e2bc3ac7/250x250-000000-80-0-0.jpg"],
  ["JENNIE", 127409302, "https://cdn-images.dzcdn.net/images/artist/bdc3e7df8ddb351fe14c20811605ec82/250x250-000000-80-0-0.jpg"],
  ["JISOO", 303432241, "https://cdn-images.dzcdn.net/images/artist/370d99ec42b715cd9a4604d79cafb942/250x250-000000-80-0-0.jpg"],
  ["MAMAMOO", 7161880, "https://cdn-images.dzcdn.net/images/artist/c7a142a623105235451f419b18ca9ef6/250x250-000000-80-0-0.jpg"],
  ["NCT 127", 50306442, "https://cdn-images.dzcdn.net/images/artist/d8558a0582e6bb3b163435908f81b0ff/250x250-000000-80-0-0.jpg"],
  ["NCT DREAM", 11999322, "https://cdn-images.dzcdn.net/images/artist/31ff0d9dd789590b52035502b1dbb1b5/250x250-000000-80-0-0.jpg"],
  ["NewJeans", 178008437, "https://cdn-images.dzcdn.net/images/artist/0866c2c1d7d00879f5db46ddc1250db8/250x250-000000-80-0-0.jpg"],
  ["PSY", 398073, "https://cdn-images.dzcdn.net/images/artist/fff83cade2015634a283e3c955871162/250x250-000000-80-0-0.jpg"],
  ["Red Velvet", 252200682, "https://cdn-images.dzcdn.net/images/artist/a86cefb9fe034c1986875b3c93ac6455/250x250-000000-80-0-0.jpg"],
  ["ROSÉ", 13322973, "https://cdn-images.dzcdn.net/images/artist/ec45d8386d41c260a7a0e1f7aea2a57c/250x250-000000-80-0-0.jpg"],
  ["SEVENTEEN", 267273672, "https://cdn-images.dzcdn.net/images/artist/70c5d2feee81528b1d0ff97c4d32e5a5/250x250-000000-80-0-0.jpg"],
  ["Stray Kids", 13923487, "https://cdn-images.dzcdn.net/images/artist/5cba9e96cd7a44955d47ff3d7eb16ef3/250x250-000000-80-0-0.jpg"],
  ["TWICE", 1588014, "https://cdn-images.dzcdn.net/images/artist/0429b4a65b3fb99a31f379a6b6b0d55d/250x250-000000-80-0-0.jpg"],
  ["TOMORROW X TOGETHER", 60552072, "https://cdn-images.dzcdn.net/images/artist/4b04ae513b382d40803a8b3addbb0c49/250x250-000000-80-0-0.jpg"],
  ["BABYMONSTER", 244386532, "https://cdn-images.dzcdn.net/images/artist/9f7d0eb99e4e405533aa0e5e0a08042e/250x250-000000-80-0-0.jpg"]
];
const featuredGenreArtists = {
  rock: [
    ["Adele", 5673798, "https://cdn-images.dzcdn.net/images/artist/ed5666c7c1a7115190d5115d04084f80/250x250-000000-80-0-0.jpg"],
    ["Bon Jovi", 637, "https://cdn-images.dzcdn.net/images/artist/3ebdb0ff80286da236109a0fc79d0cb5/250x250-000000-80-0-0.jpg"],
    ["Coldplay", 892, "https://cdn-images.dzcdn.net/images/artist/3087954bca22f306324912e5ac8375c3/250x250-000000-80-0-0.jpg"],
    ["Fall Out Boy", 404, "https://cdn-images.dzcdn.net/images/artist/f53434390dd76ef724cdc26df7a0b64d/250x250-000000-80-0-0.jpg"],
    ["Green Day", 52, "https://cdn-images.dzcdn.net/images/artist/690381cc69a21802b5d95b0460afb6a3/250x250-000000-80-0-0.jpg"],
    ["Imagine Dragons", 416239, "https://cdn-images.dzcdn.net/images/artist/1ba025c23cae3dee14b51152990285fc/250x250-000000-80-0-0.jpg"],
    ["Linkin Park", 92, "https://cdn-images.dzcdn.net/images/artist/4886905210739af3438990897bad3a98/250x250-000000-80-0-0.jpg"],
    ["Maroon 5", 1188, "https://cdn-images.dzcdn.net/images/artist/bbb526b9666c7e31dee295bcabbbdd8e/250x250-000000-80-0-0.jpg"],
    ["Nirvana", 415, "https://cdn-images.dzcdn.net/images/artist/3ec5542ff520ee74e2befdaba32ef2ef/250x250-000000-80-0-0.jpg"],
    ["OneRepublic", 74398, "https://cdn-images.dzcdn.net/images/artist/36556d769dc4052d915eb78c8daf98fb/250x250-000000-80-0-0.jpg"]
  ]
};
availableArtists = [...new Set([
  ...availableArtists,
  ...featuredThaiArtists.map(([name]) => name),
  ...featuredKpopArtists.map(([name]) => name),
  ...Object.values(featuredGenreArtists).flatMap(artists => artists.map(([name]) => name))
])];

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }
  return shuffled;
}

/* ─── Web Audio feedback sounds ─── */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTone(freq, type, duration, gainVal = 0.18) {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    const volScale = typeof currentVolume === "number" ? Math.max(0.2, currentVolume) : 0.5;
    gain.gain.setValueAtTime(gainVal * volScale, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* ignore */ }
}
function playCorrectSound() {
  playTone(660, 'sine', 0.12, 0.14);
  setTimeout(() => playTone(880, 'sine', 0.18, 0.12), 80);
}
function playWrongSound() {
  playTone(200, 'sawtooth', 0.22, 0.1);
  setTimeout(() => playTone(160, 'sawtooth', 0.18, 0.08), 80);
}

/* ─── Confetti ─── */
function launchConfetti() {
  let canvas = document.getElementById('confettiCanvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confettiCanvas';
    document.body.appendChild(canvas);
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: 110 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.random() * 7 + 3,
    d: Math.random() * 80 + 30,
    color: ['#c5b8ff','#ffd166','#7dddb8','#ff9bae','#b9a7ff','#fff'][Math.floor(Math.random()*6)],
    tilt: Math.random() * 10 - 5,
    tiltAngleIncrement: (Math.random() * 0.07 + 0.05) * (Math.random() < 0.5 ? 1 : -1),
    tiltAngle: 0,
    speed: Math.random() * 2.5 + 1.2
  }));
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.tiltAngle += p.tiltAngleIncrement;
      p.y += p.speed;
      p.x += Math.sin(frame * 0.02 + p.d) * 0.8;
      p.tilt = Math.sin(p.tiltAngle) * 12;
      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height);
      ctx.ellipse(p.x, p.y, p.r, p.r * 0.45, p.tilt, 0, Math.PI * 2);
      ctx.fill();
    });
    frame++;
    if (frame < 200) requestAnimationFrame(draw);
    else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.remove();
    }
  }
  draw();
}

/* ─── Show share toast ─── */
function showToast(message) {
  document.querySelectorAll('.share-toast').forEach(el => el.remove());
  const toast = document.createElement('div');
  toast.className = 'share-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 350);
  }, 2200);
}

function getSelectedValues(containerId) {
  return [...document.querySelectorAll(`#${containerId} input:checked`)].map(input => input.value);
}

async function fetchDeezer(url) {
  const apiUrl = new URL(url);
  if (apiUrl.origin !== "https://api.deezer.com") {
    throw new Error("ได้รับ URL สำหรับ Deezer ที่ไม่ถูกต้อง");
  }

  const proxyUrl = `/api/deezer${apiUrl.pathname}${apiUrl.search}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Deezer ตอบกลับ ${response.status}`);
  }
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || "Deezer ไม่สามารถค้นหาเพลงได้");
  }
  return data;
}

async function fetchDeezerPages(firstUrl, maxItems = Number.POSITIVE_INFINITY) {
  const results = [];
  let url = firstUrl;
  while (url && results.length < maxItems) {
    const data = await fetchDeezer(url);
    if (Array.isArray(data.data)) results.push(...data.data);
    if (results.length > maxItems) results.length = maxItems;
    const nextUrl = data.next;
    url = nextUrl && new URL(nextUrl).origin === "https://api.deezer.com" ? nextUrl : "";
  }
  return results;
}

function mapDeezerTrack(track, extra = {}) {
  if (!track?.id || !track.title || !track.artist?.name || !track.preview) return null;
  const releaseDate = track.release_date || extra.releaseDate || "";
  const year = Number(releaseDate.slice(0, 4));
  return {
    id: String(track.id),
    title: track.title_short || track.title,
    artist: track.artist.name,
    album: track.album?.title || "",
    albumCover: track.album?.cover_medium || "",
    previewUrl: track.preview,
    trackUrl: track.link || `https://www.deezer.com/track/${track.id}`,
    releaseDate,
    decade: Number.isFinite(year) && year > 0 ? `${Math.floor(year / 10) * 10}s` : "",
    genres: extra.genres || [],
    playlists: extra.playlists || [],
    language: extra.language || "",
    answers: []
  };
}

function uniqueSongs(tracks) {
  const seen = new Set();
  return tracks.filter(track => {
    if (!track || seen.has(track.id)) return false;
    seen.add(track.id);
    return true;
  });
}

function normalizeArtistName(name) {
  return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function registerArtistDetails(artist) {
  if (!artist?.id || !artist.name) return;
  const key = normalizeArtistName(artist.name);
  const current = availableArtistDetails.get(key);
  availableArtistDetails.set(key, {
    id: artist.id,
    name: artist.name,
    picture: artist.picture_medium || artist.picture || current?.picture || ""
  });
}

featuredThaiArtists.forEach(([name, id, picture]) => {
  registerArtistDetails({ name, id, picture });
});
featuredKpopArtists.forEach(([name, id, picture]) => {
  registerArtistDetails({ name, id, picture });
});
Object.values(featuredGenreArtists).flat().forEach(([name, id, picture]) => {
  registerArtistDetails({ name, id, picture });
});

async function loadArtistTracks(artistName) {
  const cacheKey = `artist:${artistName.toLocaleLowerCase()}`;
  if (deezerCache.has(cacheKey)) return deezerCache.get(cacheKey);

  const request = (async () => {
    let artist = availableArtistDetails.get(normalizeArtistName(artistName));
    if (artist?.id) {
      artist = await fetchDeezer(`https://api.deezer.com/artist/${artist.id}`);
    } else {
      const searchUrl = `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=25`;
      const artists = (await fetchDeezer(searchUrl)).data || [];
      const normalizedName = normalizeArtistName(artistName);
      artist = artists
        .filter(result => normalizeArtistName(result.name || "") === normalizedName)
        .sort((left, right) => (right.nb_fan || 0) - (left.nb_fan || 0))[0];
    }
    if (!artist) throw new Error(`ไม่พบศิลปิน “${artistName}” ใน Deezer`);

    const matchesArtist = track => String(track.artist?.id) === String(artist.id) ||
      normalizeArtistName(track.artist?.name || "") === normalizeArtistName(artist.name);
    const mapArtistTracks = tracks => uniqueSongs(tracks
      .filter(matchesArtist)
      .map(track => mapDeezerTrack(track))
      .filter(Boolean));
    let artistTracks = [];
    let topTracksError = null;
    try {
      artistTracks = mapArtistTracks(await fetchDeezerPages(
        `https://api.deezer.com/artist/${artist.id}/top?limit=100`
      ));
    } catch (error) {
      topTracksError = error;
    }

    if (artistTracks.length < 20) {
      const queries = [
        `artist:"${artist.name}"`,
        artist.name
      ];
      const searchResults = await Promise.allSettled(queries.map(query =>
        fetchDeezerPages(`https://api.deezer.com/search/track?q=${encodeURIComponent(query)}&limit=100`)
      ));
      const successfulSearch = searchResults.some(result => result.status === "fulfilled");
      const searchedTracks = mapArtistTracks(searchResults
        .filter(result => result.status === "fulfilled")
        .flatMap(result => result.value));
      artistTracks = uniqueSongs([...artistTracks, ...searchedTracks]);
      if (!artistTracks.length && topTracksError && !successfulSearch) {
        throw topTracksError;
      }
    }

    if (!artistTracks.length) {
      throw new Error(`Deezer ไม่พบเพลงของ ${artistName}`);
    }
    return artistTracks;
  })();

  deezerCache.set(cacheKey, request);
  try {
    return await request;
  } catch (error) {
    deezerCache.delete(cacheKey);
    throw error;
  }
}

async function loadAppleArtistCatalog(artistName) {
  const cacheKey = artistName.trim().toLocaleLowerCase();
  if (appleArtistCatalogCache.has(cacheKey)) return appleArtistCatalogCache.get(cacheKey);

  const request = (async () => {
    const countryResults = await Promise.allSettled(["th", "us"].map(async country => {
      const term = encodeURIComponent(artistName);
      const response = await fetch(
        `https://itunes.apple.com/search?term=${term}&entity=song&attribute=artistTerm&limit=200&country=${country}`
      );
      if (!response.ok) {
        throw new Error(`Apple Music ตอบกลับ ${response.status}`);
      }
      const data = await response.json();
      return data.results || [];
    }));
    const successfulResults = countryResults.filter(result => result.status === "fulfilled");
    if (!successfulResults.length) {
      throw countryResults.find(result => result.status === "rejected").reason;
    }
    if (successfulResults.length < countryResults.length) {
      console.warn(`Apple Music artist verification partially failed for ${artistName}.`);
    }

    const normalizedArtist = normalizeArtistName(artistName);
    const matchingArtistResults = uniqueSongs(successfulResults.flatMap(result => result.value).filter(result =>
      normalizeArtistName(result.artistName || "").includes(normalizedArtist)
    ).map(result => ({ ...result, id: String(result.trackId) })));
    const exactCaseResults = matchingArtistResults.filter(result =>
      result.artistName?.includes(artistName)
    );
    const verifiedResults = exactCaseResults.length ? exactCaseResults : matchingArtistResults;

    return new Map(verifiedResults
      .filter(result => result.trackName && result.previewUrl)
      .map(result => [
        normalizeArtistName(result.trackName),
        { previewUrl: result.previewUrl, trackUrl: result.trackViewUrl || "" }
      ]));
  })();

  appleArtistCatalogCache.set(cacheKey, request);
  try {
    return await request;
  } catch (error) {
    appleArtistCatalogCache.delete(cacheKey);
    throw error;
  }
}

async function findDeezerPlaylist(playlistId) {
  const cacheKey = `playlist-info:${playlistId}`;
  if (deezerCache.has(cacheKey)) return deezerCache.get(cacheKey);

  const request = (async () => {
    const fixedId = deezerPlaylistIds[playlistId];
    if (fixedId) {
      return fetchDeezer(`https://api.deezer.com/playlist/${fixedId}`);
    }

    const terms = playlistSearchTerms[playlistId] || [];
    for (const term of terms) {
      const url = `https://api.deezer.com/search/playlist?q=${encodeURIComponent(term)}&limit=25`;
      const results = (await fetchDeezer(url)).data || [];
      const aliases = terms.map(value => value.trim().toLocaleLowerCase());
      const candidates = results.filter(item =>
        item.public &&
        aliases.some(alias => item.title?.trim().toLocaleLowerCase() === alias)
      );
      if (candidates.length) {
        candidates.sort((left, right) => {
          const leftEditor = /deezer|chart/i.test(left.user?.name || "") ? 1 : 0;
          const rightEditor = /deezer|chart/i.test(right.user?.name || "") ? 1 : 0;
          return rightEditor - leftEditor || (right.nb_tracks || 0) - (left.nb_tracks || 0);
        });
        return candidates[0];
      }
    }
    throw new Error(`ไม่พบเพลย์ลิสต์ที่ตรงกับ ${terms[0] || playlistId} ใน Deezer`);
  })();

  deezerCache.set(cacheKey, request);
  try {
    const playlist = await request;
    deezerPlaylistInfo.set(playlistId, playlist);
    return playlist;
  } catch (error) {
    deezerCache.delete(cacheKey);
    throw error;
  }
}

async function loadPlaylistTracks(playlistId) {
  const cacheKey = `playlist-tracks:${playlistId}`;
  if (deezerCache.has(cacheKey)) return deezerCache.get(cacheKey);
  const request = (async () => {
    if (playlistId.startsWith("thai-")) {
      const selectedArtist = getSelectedValues("artistOptions")[0];
      const artistsByPlaylist = {
        "thai-hits": [
          "4EVE",
          "NONT TANONT",
          "Tilly Birds",
          "Three Man Down",
          "INK WARUNTORN",
          "Getsunova"
        ],
        "thai-rap": [...thaiRapArtists],
        "thai-rock": [...thaiRockArtists]
      };
      const artists = selectedArtist
        ? [selectedArtist]
        : artistsByPlaylist[playlistId];
      const results = await Promise.allSettled(artists.map(loadArtistTracks));
      const tracks = uniqueSongs(results
        .filter(result => result.status === "fulfilled")
        .flatMap(result => result.value)
        .map(track => ({
          ...track,
          genres: [...new Set([...track.genres, ...playlistGenres[playlistId]])],
          playlists: [...new Set([...track.playlists, playlistId])],
          language: "thai"
        })));
      if (!tracks.length) {
        throw new Error(`ไม่พบเพลงในเพลย์ลิสต์ ${playlistOptions.find(item => item.id === playlistId)?.title || playlistId}`);
      }
      return tracks;
    }

    const playlist = await findDeezerPlaylist(playlistId);
    const tracks = await fetchDeezerPages(
      `https://api.deezer.com/playlist/${playlist.id}/tracks?limit=100`,
      200
    );
    const mappedTracks = uniqueSongs(tracks.map(track => mapDeezerTrack(track, {
      playlists: [playlistId],
      genres: playlistGenres[playlistId] || []
    })).filter(Boolean));
    const playableTracks = playlistId.startsWith("thai-")
      ? mappedTracks.filter(track =>
        featuredThaiArtists.some(([name]) => normalizeArtistName(name) === normalizeArtistName(track.artist)) ||
        songs.some(song => song.language === "thai" &&
          normalizeArtistName(song.artist) === normalizeArtistName(track.artist)) ||
        /\p{Script=Thai}/u.test(`${track.title} ${track.artist}`)
      ).map(track => ({ ...track, language: "thai" }))
      : mappedTracks;
    if (!playableTracks.length) {
      throw new Error(`เพลย์ลิสต์ ${playlist.title} ไม่มีเพลงที่เล่นได้`);
    }
    return playableTracks;
  })();
  deezerCache.set(cacheKey, request);
  try {
    return await request;
  } catch (error) {
    deezerCache.delete(cacheKey);
    throw error;
  }
}

async function loadGenreTracks(genreId) {
  const url = `https://api.deezer.com/chart/${genreId}/tracks?limit=100`;
  return uniqueSongs(((await fetchDeezer(url)).data || [])
    .map(track => mapDeezerTrack(track, {
      genres: Object.entries(deezerGenreIds)
        .filter(([, id]) => id === genreId)
        .map(([genre]) => genre)
    }))
    .filter(Boolean));
}

async function loadThaiTracks() {
  const tracks = await Promise.all(["thai-hits", "thai-rap"].map(loadPlaylistTracks));
  return uniqueSongs(tracks.flat()).map(track => ({
    ...track,
    genres: [...new Set([...track.genres, "thai"])]
  }));
}

async function loadSearchTracks(query) {
  const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=100`;
  return uniqueSongs(((await fetchDeezer(url)).data || []).map(track => mapDeezerTrack(track)).filter(Boolean));
}

async function loadDecadeTracks(decades, baseTracks) {
  let candidates = baseTracks;
  if (!candidates.length) {
    const searches = await Promise.all(decades.map(decade =>
      loadSearchTracks(`${decade.slice(0, 4)}s hits`)
    ));
    candidates = uniqueSongs(searches.flat());
  }

  const detailed = [];
  const requestedRounds = Number($("roundCountSelect").value);
  const detailLimit = Math.min(
    candidates.length,
    Math.max(requestedRounds, Math.min(32, requestedRounds * 2))
  );
  for (let index = 0; index < detailLimit; index += 2) {
    const batch = candidates.slice(index, Math.min(index + 2, detailLimit));
    const results = await Promise.allSettled(batch.map(async song => {
      const cacheKey = `track:${song.id}`;
      if (!deezerCache.has(cacheKey)) {
        deezerCache.set(cacheKey, fetchDeezer(`https://api.deezer.com/track/${song.id}`));
      }
      let track;
      try {
        track = await deezerCache.get(cacheKey);
      } catch (error) {
        deezerCache.delete(cacheKey);
        throw error;
      }
      const mapped = mapDeezerTrack(track, { genres: song.genres, playlists: song.playlists });
      return mapped;
    }));
    const batchErrors = results.filter(result => result.status === "rejected");
    const quotaError = batchErrors.find(result =>
      /quota|429|rate.?limit/i.test(result.reason?.message || "")
    );
    if (quotaError) throw quotaError.reason;
    detailed.push(...results
      .filter(result => result.status === "fulfilled")
      .map(result => result.value)
      .filter(Boolean));

    const matchingDecadeCount = detailed.filter(song => decades.includes(song.decade)).length;
    if (matchingDecadeCount >= requestedRounds) break;
    if (batchErrors.length && detailed.length === 0) throw batchErrors[0].reason;
  }
  return uniqueSongs(detailed.filter(Boolean));
}

function scheduleCatalogRefresh(delay = 250) {
  window.clearTimeout(catalogRefreshTimer);
  catalogRequestId++;
  catalogLoading = true;
  catalogError = "";
  catalogWarning = "";
  updateSettings();
  catalogRefreshTimer = window.setTimeout(refreshMusicCatalog, delay);
}

async function loadCurrentCatalog() {
  const artists = getSelectedValues("artistOptions");
  const playlists = getSelectedValues("playlistOptions");
  const genres = getSelectedValues("genreOptions");
  const decades = getSelectedValues("decadeOptions");
  const search = getSearchText();

  let tracks;
  if (playlists.length) {
    tracks = uniqueSongs((await Promise.all(playlists.map(loadPlaylistTracks))).flat());
  } else if (artists.length) {
    const artistResults = [];
    const artistErrors = [];
    for (let index = 0; index < artists.length; index += 5) {
      const batch = artists.slice(index, index + 5);
      const results = await Promise.allSettled(batch.map(loadArtistTracks));
      results.forEach((result, resultIndex) => {
        if (result.status === "fulfilled") {
          artistResults.push(...result.value);
          if (!result.value.length) artistErrors.push(batch[resultIndex]);
        } else {
          artistErrors.push(batch[resultIndex]);
        }
      });
    }
    tracks = uniqueSongs(artistResults);
    if (artistErrors.length) {
      catalogWarning = `โหลดเพลงของบางศิลปินไม่ได้: ${artistErrors.join(", ")}`;
      console.warn(catalogWarning);
    }
    if (!tracks.length && artistErrors.length) {
      throw new Error(`โหลดเพลงของศิลปินที่เลือกไม่สำเร็จ: ${artistErrors.join(", ")}`);
    }
  } else if (genres.length) {
    const genreRequests = genres.map(genre => {
      if (genre === "thai") return loadThaiTracks();
      if (genre === "kpop") return loadPlaylistTracks("kpop-hits");
      if (genre === "country") return loadPlaylistTracks("country-hits");
      if (genre === "ballad") return loadPlaylistTracks("power-ballads");
      return deezerGenreIds[genre] ? loadGenreTracks(deezerGenreIds[genre]) : Promise.resolve([]);
    });
    tracks = uniqueSongs((await Promise.all(genreRequests)).flat());
  } else if (search) {
    tracks = await loadSearchTracks(search);
  } else {
    tracks = await loadGenreTracks(0);
  }

  if (artists.length) {
    tracks = tracks.map(song => ({
      ...song,
      genres: [...new Set([...song.genres, ...getArtistGenres(song.artist), ...genres])],
      language: featuredThaiArtists.some(([name]) =>
        normalizeArtistName(name) === normalizeArtistName(song.artist)
      ) ? "thai" : song.language
    }));
    const selectedArtists = new Set(artists.map(normalizeArtistName));
    tracks = tracks.filter(song => selectedArtists.has(normalizeArtistName(song.artist)));
    if (genres.includes("thai")) {
      const thaiArtistNames = new Set([
        ...featuredThaiArtists.map(([name]) => normalizeArtistName(name)),
        ...songs.filter(song => song.language === "thai").map(song => normalizeArtistName(song.artist))
      ]);
      tracks = tracks
        .filter(song => thaiArtistNames.has(normalizeArtistName(song.artist)))
        .map(song => ({ ...song, genres: [...new Set([...song.genres, "thai"])] }));
    }
    const verifiedTracksByArtist = await Promise.all(artists.map(async artist => [
      normalizeArtistName(artist),
      await loadAppleArtistCatalog(artist)
    ]));
    const verifiedCatalogs = new Map(verifiedTracksByArtist);
    tracks = tracks.flatMap(song => {
      const verifiedTrack = verifiedCatalogs.get(normalizeArtistName(song.artist))
        ?.get(normalizeArtistName(song.title));
      if (!verifiedTrack) return [];
      return [{
        ...song,
        previewUrl: verifiedTrack.previewUrl,
        trackUrl: verifiedTrack.trackUrl || song.trackUrl,
        previewProvider: "Apple Music"
      }];
    });
  } else if (genres.length && !playlists.length) {
    tracks = tracks.filter(song => genres.some(genre => song.genres.includes(genre)));
  }

  if (search && (artists.length || playlists.length)) {
    const term = search.toLocaleLowerCase();
    tracks = tracks.filter(song =>
      `${song.title} ${song.artist} ${song.album}`.toLocaleLowerCase().includes(term)
    );
  }
  let sourceTracks = tracks;
  if (decades.length) {
    sourceTracks = await loadDecadeTracks(decades, tracks);
    tracks = sourceTracks.filter(song => decades.includes(song.decade));
  }
  return { tracks, sourceTracks };
}

async function refreshMusicCatalog() {
  if (catalogLoadInProgress) {
    catalogRefreshPending = true;
    return;
  }

  catalogLoadInProgress = true;
  try {
    do {
      catalogRefreshPending = false;
      const requestId = ++catalogRequestId;
      catalogLoading = true;
      catalogError = "";
      catalogWarning = "";
      catalogSongs = [];
      catalogSourceSongs = [];
      updateSettings();
      try {
        const { tracks, sourceTracks } = await loadCurrentCatalog();
        if (requestId !== catalogRequestId) continue;
        catalogSongs = tracks;
        catalogSourceSongs = sourceTracks;
      } catch (error) {
        if (requestId !== catalogRequestId) continue;
        console.error("Unable to load the Deezer music catalog:", error);
        catalogError = error.message || "โหลดคลังเพลง Deezer ไม่สำเร็จ";
        catalogSourceSongs = [];
      } finally {
        if (requestId === catalogRequestId) {
          catalogLoading = false;
          updateSettings();
        }
      }
    }
    while (catalogRefreshPending);
  } finally {
    catalogLoadInProgress = false;
  }
}

async function loadArtistChoices() {
  try {
    const cacheKey = "chart-artists";
    if (!deezerCache.has(cacheKey)) {
      deezerCache.set(cacheKey, fetchDeezer("https://api.deezer.com/chart/0/artists?limit=100"));
    }
    const artists = (await deezerCache.get(cacheKey)).data || [];
    artists.forEach(registerArtistDetails);
    const featuredArtistNames = [
      ...featuredThaiArtists.map(([name]) => name),
      ...featuredKpopArtists.map(([name]) => name),
      ...Object.values(featuredGenreArtists).flatMap(artists => artists.map(([name]) => name))
    ];
    availableArtists = [...new Set([
      ...songs.map(song => song.artist),
      ...artists.map(artist => artist.name).filter(Boolean),
      ...featuredArtistNames
    ])].sort((left, right) => left.localeCompare(right));
    const selected = getSelectedValues("artistOptions");
    renderArtistOptions(selected);
    if (catalogSongs.length || catalogLoading) updateSettings();
  } catch (error) {
    console.error("Unable to load Deezer artists:", error);
    availableArtists = [...new Set([
      ...songs.map(song => song.artist),
      ...featuredThaiArtists.map(([name]) => name),
      ...featuredKpopArtists.map(([name]) => name),
      ...Object.values(featuredGenreArtists).flatMap(artists => artists.map(([name]) => name))
    ])].sort((left, right) => left.localeCompare(right));
    renderArtistOptions(getSelectedValues("artistOptions"));
    $("artistCount").textContent = "โหลด Deezer ไม่สำเร็จ (แสดงศิลปินไทยและ K-Pop)";
  }
}

async function searchArtistChoices(query) {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 2) return;
  const requestId = ++artistSearchRequestId;
  const cacheKey = `artist-search:${normalizedQuery.toLocaleLowerCase()}`;
  try {
    if (!deezerCache.has(cacheKey)) {
      deezerCache.set(cacheKey, fetchDeezer(
        `https://api.deezer.com/search/artist?q=${encodeURIComponent(normalizedQuery)}&limit=25`
      ));
    }
    const results = (await deezerCache.get(cacheKey)).data || [];
    if (requestId !== artistSearchRequestId || getSearchText() !== normalizedQuery.toLocaleLowerCase()) return;
    results.forEach(registerArtistDetails);
    const selected = getSelectedValues("artistOptions");
    availableArtists = [...new Set([
      ...availableArtists,
      ...results.map(artist => artist.name).filter(Boolean)
    ])].sort((left, right) => left.localeCompare(right));
    renderArtistOptions(selected);
    updateSettings();
  } catch (error) {
    console.error("Unable to search Deezer artists:", error);
    $("artistCount").textContent = "ค้นหาศิลปินไม่สำเร็จ";
  }
}

function renderArtistOptions(selectedArtists) {
  const container = $("artistOptions");
  const artists = availableArtists;
  container.replaceChildren();
  artists.forEach((artist, index) => {
    const label = document.createElement("label");
    label.className = "artist-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "artist";
    input.value = artist;
    input.checked = selectedArtists.includes(artist);
    const avatar = document.createElement("span");
    avatar.className = `artist-avatar artist-${index % artistColors.length} ${artistColors[index % artistColors.length]}`;
    avatar.textContent = artist.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase();
    avatar.setAttribute("aria-hidden", "true");
    const artistDetails = availableArtistDetails.get(normalizeArtistName(artist));
    if (artistDetails?.picture) {
      const photo = document.createElement("img");
      photo.className = "artist-photo";
      photo.src = artistDetails.picture;
      photo.alt = "";
      photo.loading = "lazy";
      photo.decoding = "async";
      photo.addEventListener("error", () => photo.remove(), { once: true });
      avatar.appendChild(photo);
    }
    const name = document.createElement("span");
    name.className = "artist-name";
    name.textContent = artist;
    const check = document.createElement("span");
    check.className = "selection-check";
    check.textContent = "✓";
    label.append(input, avatar, name, check);
    label.classList.toggle("is-selected", input.checked);
    container.appendChild(label);
  });
  $("artistCount").textContent = `${artists.length} ศิลปิน รวมศิลปินไทย`;
}

function renderDecadeOptions(selectedDecades) {
  const container = $("decadeOptions");
  container.replaceChildren();
  const selectedGenres = getSelectedValues("genreOptions");
  const selectedArtists = getSelectedValues("artistOptions");
  const selectedPlaylists = getSelectedValues("playlistOptions");
  const contextLabel = getSelectionContextLabel(selectedGenres, selectedArtists, selectedPlaylists);
  const catalogDecades = [...new Set(catalogSourceSongs.map(song => song.decade).filter(Boolean))];
  const availableDecades = catalogDecades.length ? new Set(catalogDecades) : null;
  const visibleDecades = decadeOptions.filter(decade =>
    !availableDecades || availableDecades.has(decade) || selectedDecades.includes(decade)
  );
  visibleDecades.forEach(decade => {
    const label = document.createElement("label");
    label.className = "decade-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "decade";
    input.value = decade;
    input.checked = selectedDecades.includes(decade);
    label.classList.toggle("is-selected", input.checked);
    const cover = document.createElement("span");
    cover.className = `decade-cover decade-${decade.slice(0, 4)}`;
    if (decade === "2020s") {
      cover.innerHTML = "<span>♫</span><small>NOW<br>PLAYING</small>";
    } else {
      cover.innerHTML = `<span>HITS</span><strong>${decade.slice(0, 4)}<small>s</small></strong>`;
    }
    const title = document.createElement("span");
    title.className = "decade-name";
    title.textContent = `${contextLabel ? `${contextLabel} ` : ""}${decade}`;
    label.append(input, cover, title);
    container.appendChild(label);
  });
  $("decadeCount").textContent = availableDecades
    ? `${visibleDecades.length} ยุคจากเพลงที่เลือก`
    : catalogSourceSongs.length
      ? "โหลดปีเพลงจริงเมื่อเลือกยุค"
      : "ค้นหาจากคลัง Deezer";
}

function renderPlaylistOptions(selectedPlaylists) {
  const container = $("playlistOptions");
  container.replaceChildren();
  const contextGenres = getContextGenres();
  const visiblePlaylists = playlistOptions.filter(playlist =>
    (!contextGenres.length ||
      (playlistGenres[playlist.id] || []).some(genre => contextGenres.includes(genre))) &&
    isPlaylistCompatibleWithSelection(playlist)
  );
  visiblePlaylists.forEach(playlist => {
    const label = document.createElement("label");
    label.className = "playlist-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "playlist";
    input.value = playlist.id;
    input.checked = selectedPlaylists.includes(playlist.id);
    const cover = document.createElement("span");
    cover.className = `playlist-cover cover-${playlist.style}`;
    cover.innerHTML = `<span>${playlist.icon}</span><small>${playlist.subtitle}</small>`;
    const title = document.createElement("span");
    title.className = "playlist-name";
    title.textContent = playlist.title;
    const songCount = document.createElement("small");
    songCount.className = "playlist-song-count";
    const playlistInfo = deezerPlaylistInfo.get(playlist.id);
    songCount.textContent = playlist.id === "thai-hits"
      ? "ศิลปินไทย"
      : playlistInfo ? `${playlistInfo.nb_tracks} เพลง` : "Deezer";
    label.append(input, cover, title, songCount);
    label.classList.toggle("is-selected", input.checked);
    container.appendChild(label);
  });
  $("playlistCount").textContent = `${visiblePlaylists.length} เพลย์ลิสต์ที่เข้ากัน`;
}

function getSearchText() {
  return $("musicSearch").value.trim().toLocaleLowerCase();
}

function getArtistsForGenres(genres) {
  if (!genres.length) return null;
  const matchingArtists = new Set();
  [...songs, ...catalogSongs].forEach(song => {
    if (genres.some(genre => genre !== "thai" && song.genres.includes(genre))) {
      matchingArtists.add(normalizeArtistName(song.artist));
    }
  });
  if (genres.includes("kpop")) {
    featuredKpopArtists.forEach(([name]) => matchingArtists.add(normalizeArtistName(name)));
  }
  if (genres.includes("thai")) {
    featuredThaiArtists.forEach(([name]) => matchingArtists.add(normalizeArtistName(name)));
    songs.filter(song => song.language === "thai")
      .forEach(song => matchingArtists.add(normalizeArtistName(song.artist)));
  }
  genres.forEach(genre => {
    (featuredGenreArtists[genre] || []).forEach(([name]) =>
      matchingArtists.add(normalizeArtistName(name))
    );
  });
  return matchingArtists;
}

function getArtistGenres(artistName) {
  const normalizedArtist = normalizeArtistName(artistName);
  const genres = new Set(artistGenreCache.get(normalizedArtist) || []);
  [...songs, ...catalogSongs, ...catalogSourceSongs].forEach(song => {
    if (normalizeArtistName(song.artist) === normalizedArtist) {
      song.genres.forEach(genre => genres.add(genre));
    }
  });
  if (featuredKpopArtists.some(([name]) => normalizeArtistName(name) === normalizedArtist)) {
    genres.add("kpop");
  }
  if (featuredThaiArtists.some(([name]) => normalizeArtistName(name) === normalizedArtist)) {
    genres.add("thai");
    if ([...thaiRapArtists].some(name => normalizeArtistName(name) === normalizedArtist)) genres.add("rap");
    else if ([...thaiRockArtists].some(name => normalizeArtistName(name) === normalizedArtist)) genres.add("rock");
    else genres.add("pop");
  }
  Object.entries(featuredGenreArtists).forEach(([genre, artists]) => {
    if (artists.some(([name]) => normalizeArtistName(name) === normalizedArtist)) {
      genres.add(genre);
    }
  });
  const artistGenres = [...genres];
  if (artistGenres.length) artistGenreCache.set(normalizedArtist, artistGenres);
  return artistGenres;
}

function getContextGenres() {
  const selectedGenre = getSelectedValues("genreOptions")[0];
  const selectedArtist = getSelectedValues("artistOptions")[0];
  if (selectedArtist) {
    const artistGenres = getArtistGenres(selectedArtist);
    if (selectedGenre === "thai") return artistGenres.filter(genre => genre !== "thai");
    if (selectedGenre) return [selectedGenre];
    return artistGenres.filter(genre => genre !== "thai");
  }
  if (selectedGenre) return [selectedGenre];

  const genres = new Set();
  const selectedPlaylists = getSelectedValues("playlistOptions");
  selectedPlaylists.forEach(playlist => {
    (playlistGenres[playlist] || []).forEach(genre => genres.add(genre));
  });
  return [...genres];
}

function isPlaylistCompatibleWithSelection(playlist) {
  const selectedArtist = getSelectedValues("artistOptions")[0];
  if (!selectedArtist) return true;

  const selectedGenre = getSelectedValues("genreOptions")[0];
  const artistGenres = getArtistGenres(selectedArtist);
  const isThaiPlaylist = playlist.id.startsWith("thai-");
  if (artistGenres.includes("thai")) {
    if (!isThaiPlaylist) return false;
    const playlistGenreList = playlistGenres[playlist.id] || [];
    const styleGenres = playlistGenreList.filter(genre => genre !== "thai");
    return styleGenres.some(genre =>
      artistGenres.includes(genre) && (!selectedGenre || selectedGenre === "thai" || genre === selectedGenre)
    );
  }
  if (selectedGenre === "thai" || isThaiPlaylist) return false;

  const playlistGenreList = playlistGenres[playlist.id] || [];
  const relevantGenres = selectedGenre ? [selectedGenre] : artistGenres;
  return playlistGenreList.some(genre => relevantGenres.includes(genre));
}

function getSelectionContextLabel(genres, artists, playlists) {
  if (artists.length) return artists.join(", ");
  if (playlists.length) {
    return playlists.map(id => playlistOptions.find(playlist => playlist.id === id)?.title)
      .filter(Boolean).join(", ");
  }
  return genres.map(id => genreOptions.find(genre => genre.id === id)?.label
    .replace(/^[^\p{L}\p{N}]+/u, "") || id).join(" ");
}

function getFilteredSongs() {
  const genres = getSelectedValues("genreOptions");
  const artists = getSelectedValues("artistOptions");
  const decades = getSelectedValues("decadeOptions");
  const playlists = getSelectedValues("playlistOptions");
  const search = getSearchText();

  return catalogSongs.filter(song => {
    const searchableText = [
      song.title,
      song.artist,
      song.language,
      song.decade,
      ...song.genres.map(genre => genreOptions.find(option => option.id === genre)?.label || genre),
      ...song.playlists.flatMap(id => {
        const playlist = playlistOptions.find(option => option.id === id);
        return playlist ? [playlist.title, playlist.subtitle] : [];
      })
    ].join(" ").toLocaleLowerCase();
    return (
      (!genres.length || genres.every(genre => song.genres.includes(genre))) &&
      (!artists.length || artists.some(artist =>
        normalizeArtistName(artist) === normalizeArtistName(song.artist)
      )) &&
      (!decades.length || decades.includes(song.decade)) &&
      (!playlists.length || playlists.some(playlist => song.playlists.includes(playlist))) &&
      (!search || searchableText.includes(search))
    );
  });
}

function handleSourceFilterChange(event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) {
    updateSettings();
    return;
  }

  keepOnlySelectedOption(input);
  updateSettings();
  scheduleCatalogRefresh();
}

function handleCatalogFilterChange(event) {
  if (!(event.target instanceof HTMLInputElement)) return;
  const input = event.target;
  keepOnlySelectedOption(input);
  if (input.checked && input.name === "genre") {
    const selectedArtist = getSelectedValues("artistOptions")[0];
    const matchingArtists = getArtistsForGenres([input.value]);
    if (selectedArtist && !matchingArtists?.has(normalizeArtistName(selectedArtist))) {
      const artistInput = [...document.querySelectorAll("#artistOptions input")]
        .find(option => option.value === selectedArtist);
      if (artistInput) artistInput.checked = false;
    }
  }
  updateSettings();
  scheduleCatalogRefresh();
}

function keepOnlySelectedOption(input) {
  if (!input.checked || !["genre", "artist", "playlist"].includes(input.name)) return;
  const container = input.closest(".genre-options, .artist-options, .playlist-options");
  container?.querySelectorAll(`input[name="${input.name}"]`).forEach(option => {
    if (option !== input) option.checked = false;
  });
}

function updateSettings() {
  const selectedGenres = getSelectedValues("genreOptions");
  $("genreOptions").replaceChildren();
  genreOptions.forEach(genre => {
    const label = document.createElement("label");
    label.className = "genre-chip";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = "genre";
    input.value = genre.id;
    input.checked = selectedGenres.includes(genre.id);
    label.classList.toggle("is-selected", input.checked);
    const text = document.createElement("span");
    text.textContent = genre.label;
    label.append(input, text);
    $("genreOptions").appendChild(label);
  });
  const selectedArtists = getSelectedValues("artistOptions");
  const selectedDecades = getSelectedValues("decadeOptions");
  const selectedPlaylists = getSelectedValues("playlistOptions");
  renderArtistOptions(selectedArtists);
  renderDecadeOptions(selectedDecades);
  renderPlaylistOptions(selectedPlaylists);

  const search = getSearchText();
  const genreArtistSet = getArtistsForGenres(selectedGenres);
  let visibleArtistCount = 0;
  document.querySelectorAll(".artist-option").forEach(option => {
    const artist = option.querySelector("input").value;
    const matchesGenre = !genreArtistSet || genreArtistSet.has(normalizeArtistName(artist));
    const matchesSearch = !search || option.textContent.toLocaleLowerCase().includes(search) ||
      songs.some(song => normalizeArtistName(song.artist) === normalizeArtistName(artist) &&
        song.title.toLocaleLowerCase().includes(search));
    option.hidden = !matchesGenre || !matchesSearch;
    if (!option.hidden) visibleArtistCount++;
  });
  $("artistCount").textContent = selectedGenres.length
    ? `${visibleArtistCount} ศิลปินในแนว ${selectedGenres.map(id =>
      genreOptions.find(option => option.id === id)?.label.replace(/^[^\p{L}\p{N}]+/u, "") || id
    ).join(" + ")}`
    : `${visibleArtistCount} ศิลปิน รวมศิลปินไทยและ K-Pop`;
  $("eraPlaylistSummary").textContent = [
    selectedDecades.length ? `${selectedDecades.length} ยุค` : "",
    selectedPlaylists.length ? `${selectedPlaylists.length} เพลย์ลิสต์` : ""
  ].filter(Boolean).join(" · ") || "ตัวเลือกที่เข้ากับแนวเพลงหรือศิลปิน";
  document.querySelectorAll(".playlist-option").forEach(option => {
    const playlist = playlistOptions.find(item => item.id === option.querySelector("input").value);
    option.hidden = Boolean(search) && !`${playlist.title} ${playlist.subtitle}`.toLocaleLowerCase().includes(search) &&
      !songs.some(song => song.playlists.includes(playlist.id) && `${song.title} ${song.artist}`.toLocaleLowerCase().includes(search));
  });
  document.querySelectorAll(".genre-chip").forEach(option => {
    const genre = genreOptions.find(item => item.id === option.querySelector("input").value);
    option.hidden = Boolean(search) && !genre.label.toLocaleLowerCase().includes(search);
  });

  const filteredSongs = getFilteredSongs();
  const selectedRounds = Number($("roundCountSelect").value);
  const availableRounds = Math.min(selectedRounds, filteredSongs.length);
  const time = Number($("questionTimeSelect").value);

  $("poolNotice").textContent = catalogLoading
    ? "กำลังโหลดเพลงจริงจาก Deezer..."
    : catalogError
      ? catalogError
      : catalogWarning
        ? `${catalogWarning} · พบ ${filteredSongs.length} เพลง`
      : !catalogSongs.length
        ? "กำลังรอโหลดคลังเพลง Deezer..."
      : filteredSongs.length < selectedRounds
        ? filteredSongs.length
          ? `พบ ${filteredSongs.length} เพลงจาก Deezer เล่นได้ ${availableRounds} ข้อ`
          : "ไม่พบเพลงที่เล่นได้ ลองเปลี่ยนตัวเลือกดูนะ"
        : `พบ ${filteredSongs.length} เพลงจาก Deezer สุ่ม ${selectedRounds} ข้อ`;
  $("settingsSummary").innerHTML = `${availableRounds} เพลง <span>•</span> ${time} วินาที / ข้อ <span>•</span> สูงสุด ${availableRounds * 100} คะแนน`;
  $("startButton").disabled = catalogLoading || Boolean(catalogError) || filteredSongs.length === 0;
  $("searchResults").textContent = search
    ? catalogLoading ? "กำลังค้นหาใน Deezer..." : `พบ ${filteredSongs.length} เพลงใน Deezer`
    : "";
  $("retryCatalogButton").hidden = !catalogError;
}

function startGame() {
  if (catalogLoading || catalogError) return;
  clearInterval(timer);
  document.querySelector(".main-nav").hidden = true;
  $("returnPartyButton").hidden = true;
  const selectedSongs = getFilteredSongs();
  questionTime = Number($("questionTimeSelect").value);
  requestedRounds = Number($("roundCountSelect").value);
  const shuffledCatalog = shuffle(selectedSongs);
  const distractorCatalog = [
    ...shuffledCatalog,
    ...catalogSourceSongs,
    ...catalogSongs,
    ...songs
  ];
  const selectedArtists = new Set(
    getSelectedValues("artistOptions").map(normalizeArtistName)
  );
  gameSongs = shuffledCatalog.slice(0, requestedRounds).map(song => {
    const seenTitles = new Set([song.title]);
    const candidates = distractorCatalog.filter(candidate => {
      if (!candidate.title || seenTitles.has(candidate.title)) return false;
      if (selectedArtists.size && !selectedArtists.has(normalizeArtistName(candidate.artist || ""))) {
        return false;
      }
      seenTitles.add(candidate.title);
      return true;
    });
    const relatedCandidates = candidates.filter(candidate =>
      song.genres?.some(genre => candidate.genres?.includes(genre)) ||
      song.playlists?.some(playlist => candidate.playlists?.includes(playlist))
    );
    const relatedTitles = new Set(relatedCandidates.map(candidate => candidate.title));
    const distractors = shuffle([
      ...relatedCandidates,
      ...candidates.filter(candidate => !relatedTitles.has(candidate.title))
    ]).slice(0, 3).map(candidate => candidate.title);
    return {
      ...song,
      answers: shuffle([song.title, ...distractors])
    };
  });
  if (!gameSongs.length) {
    updateSettings();
    return;
  }
  questionIndex = 0;
  score = 0;
  correctAnswers = 0;
  streak = 0;
  gameHistory = [];
  seconds = questionTime;
  $("score").textContent = score;
  $("streakPill").hidden = true;
  $("streakCount").textContent = "0";
  $("lobby").hidden = true;
  $("results").hidden = true;
  $("game").hidden = false;
  $("playerGreeting").textContent = `เอาล่ะ ${playerName} ลุยกันเลย!`;
  $("timer").textContent = questionTime;
  showQuestion();
}

function setAnswerButtonsEnabled(enabled) {
  document.querySelectorAll(".answer-button").forEach(button => {
    button.disabled = !enabled;
  });
}

let currentVolume = 0.5;
const volumeStep = 0.1;
let audioGainNode = null;
let mediaSourceConnected = false;

function ensureAudioGainNode() {
  if (mediaSourceConnected) return;
  const audio = $("audio");
  if (!audio) return;
  try {
    const ctx = getAudioCtx();
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    audio.crossOrigin = "anonymous";
    const source = ctx.createMediaElementSource(audio);
    audioGainNode = ctx.createGain();
    audioGainNode.gain.value = currentVolume;
    source.connect(audioGainNode);
    audioGainNode.connect(ctx.destination);
    mediaSourceConnected = true;
  } catch (err) {
    // MediaElementAudioSource fallback to standard audio.volume
    console.warn("Audio GainNode fallback active:", err);
  }
}

function updateMediaSession(isPlaying = true) {
  if (!("mediaSession" in navigator)) return;
  try {
    if (isPlaying && activeSong) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: activeSong.title ? `${activeSong.title} — กำลังทายเพลง` : "กำลังทายเพลง",
        artist: activeSong.artist || "ทายเพลง (Tune Battle)",
        album: "Music Quiz Game",
        artwork: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" }
        ]
      });
      navigator.mediaSession.playbackState = "playing";
    } else {
      navigator.mediaSession.playbackState = "paused";
    }
  } catch (_) {}
}

function updateVolumeControls() {
  const volumePercent = Math.round(currentVolume * 100);
  $("volumeLevel").textContent = `${volumePercent}%`;
  $("volumeDownBtn").disabled = currentVolume <= 0;
  $("volumeUpBtn").disabled = currentVolume >= 1;
}

function changeVolume(amount) {
  ensureAudioGainNode();
  currentVolume = Math.min(1, Math.max(0, Math.round((currentVolume + amount) * 10) / 10));
  const audio = $("audio");
  try {
    audio.volume = currentVolume;
  } catch (_) {}
  if (audioGainNode) {
    try {
      audioGainNode.gain.value = currentVolume;
    } catch (_) {}
  }
  updateVolumeControls();
}

function showQuestion() {
  previewRequestId++;
  clearInterval(timer);
  $("audio").pause();
  $("audio").removeAttribute("src");
  $("audio").load();
  activeSong = null;
  fallbackAttempted = false;
  answered = false;
  selectedAnswer = null;
  selectedAnswerElapsed = null;
  timerStarted = false;
  questionStartedAt = 0;
  seconds = questionTime;

  const current = gameSongs[questionIndex];
  $("gameSettingsButton").hidden = Boolean(
    window.songTriviaParty?.active && !window.songTriviaParty.isHost
  );
  $("round").innerHTML = `ข้อที่ ${questionIndex + 1} <span>/ ${gameSongs.length}</span>`;
  $("questionText").textContent = "เพลงนี้ชื่ออะไร?";
  $("timer").textContent = seconds;
  $("timerFill").style.width = "100%";
  $("timerFill").classList.remove("low");
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  $("liveAnswersPanel").hidden = true;
  $("liveAnswersList").replaceChildren();
  $("partyScoreboard").hidden = true;
  $("partyScoreList").replaceChildren();
  $("trackLink").hidden = true;
  $("nextBtn").hidden = true;
  $("nextBtn").disabled = false;
  $("playBtn").disabled = true;
  $("playLabel").textContent = "กำลังเตรียมเพลง...";

  const progress = Math.round((questionIndex / gameSongs.length) * 100);
  $("progressFill").style.width = `${progress}%`;
  const progressTrack = document.querySelector(".progress-track");
  progressTrack.setAttribute("aria-valuemax", gameSongs.length);
  progressTrack.setAttribute("aria-valuenow", questionIndex);

  const answers = $("answers");
  answers.replaceChildren();
  shuffle(current.answers).forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.dataset.answer = answer;
    button.disabled = true;
    const letter = document.createElement("span");
    letter.className = "answer-letter";
    const keyLabel = String.fromCharCode(65 + index);
    letter.textContent = keyLabel;
    letter.dataset.key = keyLabel;
    const answerCopy = document.createElement("span");
    answerCopy.className = "answer-copy";
    const answerTitle = document.createElement("span");
    answerTitle.className = "answer-title";
    answerTitle.textContent = answer;
    answerCopy.appendChild(answerTitle);
    button.append(letter, answerCopy);
    button.addEventListener("click", () => chooseAnswer(answer));
    answers.appendChild(button);
  });

  if (window.songTriviaParty?.active) {
    $("questionLabel").textContent = "ฟังเพลงเดียวกัน แล้วตอบแข่งกับเพื่อน";
  } else {
    $("questionLabel").textContent = "ฟังเพลงที่เล่นอัตโนมัติ แล้วตอบให้ไวที่สุด";
  }
  if (current.previewUrl) {
    setPreview(current, {
      preview: current.previewUrl,
      link: current.trackUrl
    }, current.previewProvider || "Deezer");
  } else {
    loadPreview(current);
  }
}

async function findPreview(song, country) {
  const term = encodeURIComponent(`${song.title} ${song.artist}`);
  const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=25&country=${country}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Apple Music search returned ${response.status}`);
  }

  const data = await response.json();
  return data.results.find(result =>
    result.previewUrl &&
    result.trackName &&
    result.artistName &&
    result.trackName.toLowerCase() === song.title.toLowerCase() &&
    result.artistName.toLowerCase().includes(song.artist.toLowerCase())
  );
}

async function findDeezerPreview(song) {
  const term = encodeURIComponent(`"${song.title}" ${song.artist}`);
  const data = await fetchDeezer(`https://api.deezer.com/search?q=${term}`);
  return data.data.find(result =>
    result.preview &&
    result.title.toLowerCase() === song.title.toLowerCase() &&
    result.artist.name.toLowerCase().includes(song.artist.toLowerCase())
  );
}

function setPreview(song, result, provider) {
  const audio = $("audio");
  audio.pause();
  activeSong = null;
  audio.removeAttribute("src");
  audio.load();
  activeSong = {
    ...song,
    previewUrl: result.previewUrl || result.preview,
    trackUrl: result.trackViewUrl || result.link,
    provider
  };
  audio.src = activeSong.previewUrl;
  audio.load();
  $("playLabel").textContent = "กำลังเริ่มเพลง...";
  $("playBtn").disabled = false;
  $("feedback").textContent = window.songTriviaParty?.active
    ? "เพลงพร้อมแล้ว กำลังรอเพื่อนๆ..."
    : "เพลงพร้อมแล้ว กำลังเริ่มเล่นอัตโนมัติ...";
  $("feedback").className = "feedback";
  if (window.songTriviaParty?.active) {
    window.songTriviaParty.previewReady();
  } else {
    playPreview();
  }
}

async function loadPreview(song) {
  const requestId = ++previewRequestId;
  activeSong = null;
  fallbackAttempted = false;
  $("playBtn").disabled = true;
  $("playLabel").textContent = "กำลังเตรียมเพลง...";
  $("feedback").textContent = "กำลังหาเพลงจาก Apple Music...";
  $("feedback").className = "feedback";

  try {
    let result = await findPreview(song, "th");
    if (requestId !== previewRequestId) return;
    if (!result) {
      result = await findPreview(song, "us");
      if (requestId !== previewRequestId) return;
    }
    if (!result) {
      throw new Error(`No preview found for ${song.title}`);
    }

    setPreview(song, result, "Apple Music");
  } catch (error) {
    if (requestId !== previewRequestId) return;
    console.error("Unable to load the Apple Music preview:", error);
    await loadDeezerFallback(song, requestId);
  }
}

async function loadDeezerFallback(song, requestId = previewRequestId) {
  if (requestId !== previewRequestId) return;
  if (fallbackAttempted) return;
  fallbackAttempted = true;
  $("playBtn").disabled = true;
  $("playLabel").textContent = "กำลังโหลดเพลงสำรอง...";
  $("feedback").textContent = "เพลง Apple Music เล่นไม่ได้ กำลังค้นหาเพลงจาก Deezer...";
  $("feedback").className = "feedback";

  try {
    const result = await findDeezerPreview(song);
    if (requestId !== previewRequestId) return;
    if (!result) {
      throw new Error(`No Deezer preview found for ${song.title}`);
    }
    setPreview(song, result, "Deezer");
  } catch (error) {
    if (requestId !== previewRequestId) return;
    console.error("Unable to load the Deezer fallback preview:", error);
    activeSong = null;
    clearInterval(timer);
    timerStarted = false;
    seconds = questionTime;
    questionStartedAt = 0;
    $("timer").textContent = seconds;
    $("timerFill").style.width = "100%";
    setAnswerButtonsEnabled(false);
    $("playLabel").textContent = "ลองโหลดเพลงอีกครั้ง";
    $("playBtn").disabled = false;
    $("feedback").textContent = "โหลดเพลงไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วกดลองใหม่อีกครั้ง";
    $("feedback").className = "feedback error";
  }
}

function beginTimer() {
  if (timerStarted || answered) return;
  timerStarted = true;
  questionStartedAt = performance.now();
  timerPausedElapsed = 0;
  setAnswerButtonsEnabled(true);
  $("playLabel").textContent = "ฟังซ้ำ";
  $("feedback").textContent = "เลือกชื่อเพลงให้ถูกก่อนหมดเวลา!";
  /* waveform */
  $("playBtn").classList.add("playing");

  timer = setInterval(() => {
    const elapsed = timerPausedElapsed + (performance.now() - questionStartedAt);
    const remaining = Math.max(0, questionTime * 1000 - elapsed);
    seconds = Math.ceil(remaining / 1000);
    $("timer").textContent = seconds;
    $("timerFill").style.width = `${(remaining / (questionTime * 1000)) * 100}%`;

    if (seconds <= 5) {
      $("timerFill").classList.add("low");
    }
    if (remaining <= 0) {
      clearInterval(timer);
      $("audio").pause();
      finishQuestion(null);
    }
  }, 100);
}

async function playPreview() {
  if (!activeSong) {
    await loadPreview(gameSongs[questionIndex]);
    return;
  }
  if (answered) return;

  const audio = $("audio");
  audio.pause();
  if (timerStarted || audio.currentTime >= questionTime || audio.ended) {
    audio.currentTime = 0;
  }

  try {
    ensureAudioGainNode();
    updateMediaSession(true);
    await audio.play();
    beginTimer();
  } catch (error) {
    if (error.name === "AbortError" && !activeSong) return;
    if (error.name === "NotAllowedError") {
      $("playLabel").textContent = "แตะเพื่อเริ่มฟัง";
      $("feedback").textContent = "เบราว์เซอร์บล็อกการเล่นอัตโนมัติ แตะปุ่มเพื่อเริ่มเพลงและจับเวลา";
      $("feedback").className = "feedback";
      return;
    }
    console.error("Unable to play the song preview:", error);
    $("feedback").textContent = "เล่นเพลงไม่ได้ ลองแตะปุ่มเพื่อเริ่มฟังอีกครั้ง";
    $("feedback").className = "feedback error";
  }
}

function chooseAnswer(answer) {
  if (answered || !timerStarted) return;
  window.songTriviaPartyGame.setSelectedAnswer(answer);
  finishQuestion(answer);
}

function finishQuestion(answer) {
  if (answered && answer !== null) return;
  if (window.songTriviaParty?.active && window.songTriviaParty.handleAnswer(answer)) {
    if (answer === null) clearInterval(timer);
    return;
  }
  if (answer !== null) {
    answered = true;
    selectedAnswer = answer;
    selectedAnswerElapsed = Math.min(
      questionTime * 1000,
      performance.now() - questionStartedAt
    );
    document.querySelectorAll(".answer-button").forEach(button => {
      button.disabled = true;
    });
    $("playBtn").disabled = true;
    $("feedback").textContent = "ส่งคำตอบแล้ว รอเฉลยสักครู่";
    $("feedback").className = "feedback";
    return;
  }
  answered = true;

  const current = gameSongs[questionIndex];
  const finalAnswer = selectedAnswer;
  const isCorrect = finalAnswer === current.title;
  const elapsed = selectedAnswerElapsed ?? questionTime * 1000;
  const points = Math.max(0, Math.ceil((1 - elapsed / (questionTime * 1000)) * 100));

  /* record history */
  gameHistory.push({ song: current, isCorrect, points: isCorrect ? points : 0 });

  if (isCorrect) {
    correctAnswers++;
    score += points;
    streak++;
    $("score").textContent = score;
    /* score pop */
    const pill = document.querySelector(".score-pill");
    pill.classList.remove("pop");
    void pill.offsetWidth; /* reflow to restart */
    pill.classList.add("pop");
    pill.addEventListener("animationend", () => pill.classList.remove("pop"), { once: true });
    /* streak */
    const streakPill = $("streakPill");
    $("streakCount").textContent = streak;
    streakPill.hidden = streak < 2;
    if (streak >= 2) {
      streakPill.classList.toggle("hot", streak >= 4);
      streakPill.classList.remove("pop");
      void streakPill.offsetWidth;
      streakPill.classList.add("pop");
      streakPill.addEventListener("animationend", () => streakPill.classList.remove("pop"), { once: true });
    }
    playCorrectSound();
    $("feedback").textContent = streak >= 3
      ? `🔥 STREAK x${streak}! ถูกต้อง +${points} คะแนน — "${current.title}" — ${current.artist}`
      : `ถูกต้อง! +${points} คะแนน — เฉลย: "${current.title}" — ${current.artist}`;
    $("feedback").classList.add("success");
  } else if (finalAnswer === null) {
    streak = 0;
    $("streakPill").hidden = true;
    playWrongSound();
    $("feedback").textContent = `หมดเวลา! ตอบไม่ทัน — เฉลย: "${current.title}" — ${activeSong.artist}`;
    $("feedback").classList.add("error");
  } else {
    streak = 0;
    $("streakPill").hidden = true;
    playWrongSound();
    $("feedback").textContent = `ยังไม่ถูกนะ! — เฉลย: "${current.title}" — ${activeSong.artist}`;
    $("feedback").classList.add("error");
  }

  /* waveform off */
  $("playBtn").classList.remove("playing");

  if (activeSong.trackUrl) {
    $("trackLink").href = activeSong.trackUrl;
    $("trackLink").textContent = `เปิดเพลงใน ${activeSong.provider} ↗`;
    $("trackLink").hidden = false;
  }

  document.querySelectorAll(".answer-button").forEach(button => {
    const buttonAnswer = button.dataset.answer;
    button.disabled = true;
    if (buttonAnswer === current.title) {
      button.classList.add("correct");
    } else if (buttonAnswer === finalAnswer) {
      button.classList.add("incorrect");
    }
  });

  $("playBtn").disabled = true;
  $("nextBtn").textContent = questionIndex === gameSongs.length - 1 ? "ดูผลคะแนน" : "ข้อต่อไป";
  $("nextBtn").hidden = false;
}

function showResults() {
  clearInterval(timer);
  $("audio").pause();
  $("playBtn").classList.remove("playing");
  $("game").hidden = true;
  $("results").hidden = false;
  $("finalStandings").hidden = true;
  $("finalStandingsList").replaceChildren();
  $("results").classList.remove("has-standings");
  $("finalScore").textContent = score;
  const scoreRatio = score / (gameSongs.length * 100);
  $("resultTitle").textContent = scoreRatio >= .7 ? "คุณคือเซียนเพลงตัวจริง! 🎉" : scoreRatio >= .4 ? "เก่งมากเลย! 🎧" : "สนุกมาก ไว้มาเล่นใหม่นะ! 🎵";
  $("resultCopy").textContent = `ทำได้ยอดเยี่ยมมาก ${playerName}!`;
  $("resultDetail").textContent = `ตอบถูก ${correctAnswers} จากทั้งหมด ${gameSongs.length} ข้อ`;

  /* confetti for good score */
  if (scoreRatio >= 0.6) launchConfetti();

  /* song history */
  const historySection = $("songHistory");
  const historyList = $("songHistoryList");
  historyList.replaceChildren();
  if (gameHistory.length > 0) {
    gameHistory.forEach((entry, i) => {
      const li = document.createElement("li");
      const indexEl = document.createElement("span");
      indexEl.className = "history-index";
      indexEl.textContent = i + 1;
      const resultEl = document.createElement("span");
      resultEl.className = `history-result ${entry.isCorrect ? "correct" : "wrong"}`;
      resultEl.textContent = entry.isCorrect ? "✓" : "✗";
      const titleEl = document.createElement("span");
      titleEl.className = "history-title";
      titleEl.textContent = entry.song.title;
      const artistEl = document.createElement("span");
      artistEl.className = "history-artist";
      artistEl.textContent = entry.song.artist;
      const pointsEl = document.createElement("span");
      pointsEl.className = "history-points";
      pointsEl.textContent = entry.isCorrect ? `+${entry.points}` : "0";
      li.append(indexEl, resultEl, titleEl, artistEl, pointsEl);
      if (entry.song.trackUrl) {
        const link = document.createElement("a");
        link.href = entry.song.trackUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "↗";
        li.appendChild(link);
      }
      historyList.appendChild(li);
    });
    historySection.hidden = false;
  } else {
    historySection.hidden = true;
  }
}

function stopGameForSettings() {
  previewRequestId++;
  clearInterval(timer);
  timer = null;
  $("audio").pause();
  $("audio").removeAttribute("src");
  $("audio").load();
  activeSong = null;
  fallbackAttempted = false;
}

window.songTriviaPartyGame = {
  getQuestionIndex: () => questionIndex,
  getQuestionTime: () => questionTime,
  getSongs: () => gameSongs,
  stopForSettings: stopGameForSettings,
  playPreview,
  applyScore: (nextScore, nextCorrect) => {
    score = nextScore;
    correctAnswers = nextCorrect;
    $("score").textContent = score;
  },
  start: ({ songs: nextSongs, time, name, index = 0 }) => {
    gameSongs = nextSongs;
    questionTime = time;
    requestedRounds = nextSongs.length;
    playerName = name;
    questionIndex = index;
    score = 0;
    correctAnswers = 0;
    $("score").textContent = "0";
    document.querySelector(".main-nav").hidden = true;
    $("returnPartyButton").hidden = true;
    $("partyRoom").hidden = true;
    $("lobby").hidden = true;
    $("results").hidden = true;
    $("game").hidden = false;
    $("playerGreeting").textContent = `เอาล่ะ ${playerName} ลุยกันเลย!`;
    showQuestion();
  },
  showPartyResult: ({ title, artist, players, answers, scores, correctCounts, winCondition }) => {
    answered = true;
    $("feedback").textContent = `เฉลย: “${title}” — ${artist} · รอบถัดไปใน 7 วินาที`;
    $("feedback").className = "feedback success";
    document.querySelectorAll(".answer-button").forEach(button => {
      const buttonAnswer = button.dataset.answer;
      button.disabled = true;
      if (buttonAnswer === title) button.classList.add("correct");
      else if (Object.values(answers).some(result => result.answer === buttonAnswer && !result.correct)) {
        button.classList.add("incorrect");
      }
    });
    $("playBtn").disabled = true;
    $("nextBtn").hidden = true;
    $("partyScoreboard").hidden = false;
    const scoreList = $("partyScoreList");
    [...players]
      .sort((left, right) => {
        const scoreDifference = (scores[right.id] || 0) - (scores[left.id] || 0);
        const correctDifference = (correctCounts[right.id] || 0) - (correctCounts[left.id] || 0);
        return winCondition === "correct"
          ? correctDifference || scoreDifference
          : scoreDifference || correctDifference;
      })
      .forEach(player => {
        const answerResult = answers[player.id];
        const item = document.createElement("li");
        const identity = document.createElement("span");
        identity.className = "party-score-player";
        const avatar = document.createElement("span");
        avatar.textContent = player.avatar || "🎧";
        avatar.setAttribute("aria-hidden", "true");
        const name = document.createElement("strong");
        name.textContent = player.name || "ผู้เล่น";
        identity.append(avatar, name);
        const roundScore = document.createElement("span");
        roundScore.className = `party-round-points ${answerResult?.correct ? "success" : ""}`;
        roundScore.textContent = answerResult?.correct ? `+${answerResult.points}` : "0";
        const total = document.createElement("strong");
        total.className = "party-total-score";
        total.textContent = `${scores[player.id] || 0} คะแนน`;
        const status = document.createElement("small");
        status.textContent = !answerResult || answerResult.answer === null
          ? "หมดเวลา"
          : answerResult.correct ? "ตอบถูก" : "ตอบผิด";
        status.className = answerResult?.correct ? "success" : "error";
        const result = document.createElement("span");
        result.className = "party-score-result";
        result.append(roundScore, total, status);
        item.append(identity, result);
        scoreList.appendChild(item);
      });
  },
  setFinalStandings: players => {
    const list = $("finalStandingsList");
    list.replaceChildren();
    players.forEach(player => {
      const row = document.createElement("tr");
      if (player.isCurrentPlayer) row.className = "current-player";
      const rank = document.createElement("td");
      rank.textContent = String(player.rank);
      const nameCell = document.createElement("td");
      const identity = document.createElement("span");
      identity.className = "standings-player";
      const avatar = document.createElement("span");
      avatar.textContent = player.avatar || "🎧";
      avatar.setAttribute("aria-hidden", "true");
      const name = document.createElement("span");
      name.textContent = player.name || "ผู้เล่น";
      identity.append(avatar, name);
      nameCell.appendChild(identity);
      const points = document.createElement("td");
      points.textContent = `${player.score || 0}`;
      const correct = document.createElement("td");
      correct.textContent = `${player.correct || 0}`;
      row.append(rank, nameCell, points, correct);
      list.appendChild(row);
    });
    $("finalStandings").hidden = players.length === 0;
    $("results").classList.toggle("has-standings", players.length > 0);
  },
  setSelectedAnswer: answer => {
    document.querySelectorAll(".answer-button").forEach(button => {
      button.classList.toggle("selected-by-player", button.dataset.answer === answer);
    });
  },
  setLiveAnswers: entries => {
    const list = $("liveAnswersList");
    list.replaceChildren();
    const namesByAnswer = new Map();
    entries.forEach(({ name, answer }) => {
      if (!namesByAnswer.has(answer)) namesByAnswer.set(answer, []);
      namesByAnswer.get(answer).push(name);
      const item = document.createElement("li");
      const player = document.createElement("strong");
      player.textContent = name;
      const choice = document.createElement("span");
      choice.textContent = answer;
      item.append(player, choice);
      list.appendChild(item);
    });
    document.querySelectorAll(".answer-button").forEach(button => {
      button.classList.remove("selected-by-player");
      button.querySelector(".answer-player-names")?.remove();
      const names = namesByAnswer.get(button.dataset.answer) || [];
      if (!names.length) return;
      button.classList.add("selected-by-player");
      const players = document.createElement("span");
      players.className = "answer-player-names";
      players.textContent = names.join(", ");
      button.querySelector(".answer-copy").appendChild(players);
    });
    $("liveAnswersPanel").hidden = entries.length === 0;
  },
  loadRound: index => {
    questionIndex = index;
    showQuestion();
  },
  showResults
};

$("startForm").addEventListener("submit", event => {
  event.preventDefault();
  playerName = $("playerName").value.trim();
  if (!playerName) {
    $("playerName").focus();
    return;
  }
  if (catalogLoading || catalogError || !getFilteredSongs().length) {
    updateSettings();
    return;
  }
  startGame();
  if (window.songTriviaParty?.isHost) {
    window.songTriviaParty.startHostGame(gameSongs, questionTime);
  }
});

$("musicSearch").addEventListener("input", () => {
  updateSettings();
  clearTimeout(searchCatalogTimer);
  searchCatalogTimer = window.setTimeout(() => {
    scheduleCatalogRefresh(0);
    searchArtistChoices($("musicSearch").value);
  }, 350);
});
$("questionTimeSelect").addEventListener("change", updateSettings);
$("roundCountSelect").addEventListener("change", updateSettings);
$("genreOptions").addEventListener("change", handleCatalogFilterChange);
$("artistOptions").addEventListener("change", handleSourceFilterChange);
$("decadeOptions").addEventListener("change", handleCatalogFilterChange);
$("playlistOptions").addEventListener("change", handleSourceFilterChange);
$("retryCatalogButton").addEventListener("click", refreshMusicCatalog);
$("playBtn").addEventListener("click", playPreview);
try { $("audio").volume = currentVolume; } catch (_) {}
updateVolumeControls();
$("volumeDownBtn").addEventListener("click", () => changeVolume(-volumeStep));
$("volumeUpBtn").addEventListener("click", () => changeVolume(volumeStep));
$("audio").addEventListener("timeupdate", () => {
  if (!$("audio").paused && $("audio").currentTime >= questionTime) {
    $("audio").pause();
  }
});
$("audio").addEventListener("pause", () => {
  if (!answered && timerStarted && activeSong) {
    $("playLabel").textContent = "ฟังซ้ำ";
  }
});
$("audio").addEventListener("error", () => {
  const audio = $("audio");
  if (activeSong && audio.currentSrc === activeSong.previewUrl && !answered) {
    console.error("The song preview audio could not be loaded.");
    if (activeSong.provider === "Apple Music" && !fallbackAttempted) {
      loadDeezerFallback(gameSongs[questionIndex]);
    } else {
      activeSong = null;
      clearInterval(timer);
      timerStarted = false;
      seconds = questionTime;
      $("timer").textContent = seconds;
      $("timerFill").style.width = "100%";
      setAnswerButtonsEnabled(false);
      $("feedback").textContent = "เล่นเพลงไม่ได้ ลองกดปุ่มเพื่อโหลดเพลงอีกครั้ง";
      $("feedback").className = "feedback error";
      $("playLabel").textContent = "ลองโหลดเพลงอีกครั้ง";
      $("playBtn").disabled = false;
    }
  }
});
$("nextBtn").addEventListener("click", () => {
  if (window.songTriviaParty?.active && window.songTriviaParty.handleNext()) return;
  $("nextBtn").disabled = false;
  questionIndex++;
  if (questionIndex >= gameSongs.length) {
    showResults();
    const standings = window.songTriviaParty?.getFinalStandings();
    if (standings) window.songTriviaPartyGame.setFinalStandings(standings);
    const finalRank = window.songTriviaParty?.getFinalRank();
    if (finalRank) {
      $("resultDetail").textContent = `${correctAnswers} คำตอบถูก • อันดับ ${finalRank}`;
    }
  } else {
    showQuestion();
  }
});
$("restartBtn").addEventListener("click", () => {
  if (window.songTriviaParty?.active) {
    window.songTriviaParty.requestReturnToRoom().catch(error => {
      console.error("Unable to return the party to its room:", error);
      $("resultDetail").textContent = `กลับเข้าห้องไม่สำเร็จ: ${error.message}`;
    });
    return;
  }
  $("results").hidden = true;
  $("lobby").hidden = false;
  $("home").hidden = true;
  document.querySelector(".main-nav").hidden = false;
  $("playerName").focus();
});
$("gameSettingsButton").addEventListener("click", () => {
  if (window.songTriviaParty?.active) {
    if (!window.songTriviaParty.isHost) return;
    window.songTriviaParty.requestReturnToRoom().catch(error => {
      console.error("Unable to return the party to its settings:", error);
      $("feedback").textContent = `กลับไปตั้งค่าไม่สำเร็จ: ${error.message}`;
      $("feedback").className = "feedback error";
    });
    return;
  }
  stopGameForSettings();
  $("game").hidden = true;
  $("results").hidden = true;
  $("lobby").hidden = false;
  $("home").hidden = true;
  document.querySelector(".main-nav").hidden = false;
  $("playerName").focus();
});

window.songTriviaCatalog = {
  refresh: refreshMusicCatalog,
  loadArtists: loadArtistChoices
};

/* ─── Keyboard shortcuts A/B/C/D ─── */
document.addEventListener("keydown", (event) => {
  if ($("game").hidden) return;
  if (answered || !timerStarted) return;
  const key = event.key.toUpperCase();
  if (!["A","B","C","D"].includes(key)) return;
  const buttons = [...document.querySelectorAll(".answer-button:not(:disabled)")];
  const index = key.charCodeAt(0) - 65;
  if (buttons[index]) buttons[index].click();
});

/* ─── Page Visibility API – pause timer when tab hidden ─── */
document.addEventListener("visibilitychange", () => {
  if (!timerStarted || answered) return;
  if (document.hidden) {
    /* tab hidden – pause */
    clearInterval(timer);
    timerPausedElapsed += performance.now() - questionStartedAt;
    timerPausedAt = performance.now();
  } else {
    /* tab visible – resume */
    questionStartedAt = performance.now();
    timer = setInterval(() => {
      const elapsed = timerPausedElapsed + (performance.now() - questionStartedAt);
      const remaining = Math.max(0, questionTime * 1000 - elapsed);
      seconds = Math.ceil(remaining / 1000);
      $("timer").textContent = seconds;
      $("timerFill").style.width = `${(remaining / (questionTime * 1000)) * 100}%`;
      if (seconds <= 5) $("timerFill").classList.add("low");
      if (remaining <= 0) {
        clearInterval(timer);
        $("audio").pause();
        finishQuestion(null);
      }
    }, 100);
  }
});

/* ─── Share score button ─── */
$("shareScoreBtn").addEventListener("click", () => {
  const total = gameSongs.length * 100;
  const text = `ฉันได้ ${score}/${total} คะแนน (ตอบถูก ${correctAnswers}/${gameSongs.length} ข้อ) ในเกมทายเพลง! มาลองเล่นกันดูที่ https://tune-battle-pages.pages.dev/`;
  if (navigator.share) {
    navigator.share({ title: "ทายเพลง", text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(
      () => showToast("✓ คัดลอกแล้ว! ส่งต่อให้เพื่อนได้เลย"),
      () => showToast("คัดลอกไม่สำเร็จ")
    );
  }
});

/* ─── Waveform & MediaSession: toggle on audio events ─── */
$("audio").addEventListener("play",  () => {
  if (timerStarted) $("playBtn").classList.add("playing");
  updateMediaSession(true);
});
$("audio").addEventListener("pause", () => {
  $("playBtn").classList.remove("playing");
  updateMediaSession(false);
});
$("audio").addEventListener("ended", () => {
  $("playBtn").classList.remove("playing");
  updateMediaSession(false);
});

updateSettings();
