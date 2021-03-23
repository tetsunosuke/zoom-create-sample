require('datejs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const rp = require('request-promise');
const commandLineArgs = require('command-line-args');

const formatDate = function(arg) {
    const r = Date.parse(arg);
    if (r === null) {
        throw new Error("日付のフォーマットが異常です:" + arg);
    }
    return r.toString('yyyy-MM-ddTHH:mm:ss');
};

const generatePassword = function() {
    const length = 8;
    let result     = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
const output = function(resp) {
    console.info("--------------------");
    console.info("url: " + resp.join_url);
    console.info("password: " + resp.password);
    console.info("start: " + Date.parse(resp.start_time).toString("yyyy/MM/dd HH:mm"));
    console.info("--------------------");
};

// コマンドラインオプションの定義
const optionDefinitions = [
  {
    name: 'start',
    type: String,
    defaultOption: true,
    defaultValue: 'now',

  },
  {
    name: 'topic',
    type: String,
    defaultValue: "no title"
  },
  {
    name: 'minutes',
    type: Number,
    defaultValue: 60
  }
];
const options = commandLineArgs(optionDefinitions);

const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);
console.log(token);

// ミーティング作成オプションパラメータの構築
const createMeetingOptions = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + config.user + "/meetings",
    body: body = {
        "type": "2", // Scheduled meeting
        "topic": options.topic,
        "start_time": formatDate(options.start),
        "timezone": "Asia/Tokyo",
        "duration": options.minutes,
        "password": generatePassword(),
        "settings": {
            "host_video": "true",
            "participant_video" : "true",
            "waiting_room" : "true",
        },
    },
    auth: {
        'bearer': token
    },
    headers: {
        'User-Agent': 'Zoom-api-Jwt-Request',
        'Content-type': 'application/json'
    },
    json: true //Parse the JSON string in the response
};

// API呼び出し
rp(createMeetingOptions).then(function(response) {
    output(response);
}).catch(function(err) {
    console.error(err);
});
