const jwt = require('jsonwebtoken');
const config = require('./config');
const rp = require('request-promise');
const commandLineArgs = require('command-line-args');
const d = require('date-util');
var formatDate = function(arg) {
    // 2020/1/1 ではなく 1/1 で渡すとなぜか
    var ts = new Date().strtotime(arg) * 1000;
    var tsDate = new Date(ts);
    return tsDate.format("yyyy/mm/dd") + 'T' + tsDate.format("HH:MM:ss");
};
var generatePassword = function() {
    const length = 8;
    var result     = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
var output = function(resp) {
    console.log("--------------------");
    console.log("url: " + resp.join_url);
    console.log("password: " + resp.password);
    // ここはまだフォーマットの必要がある
    console.log("start: " + resp.start_time);
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
    name: 'minitues',
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

var createMeetingOptions = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + config.user + "/meetings",
    body: body = {
        "type": "2", // Scheduled meeting
        "topic": options.topic,
        "start_time": formatDate(options.start),
        "timezone": "Asia/Tokyo",
        "duration": options.minitues,
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

rp(createMeetingOptions).then(function(response) {
    output(response);
}).catch(function(err) {
    console.error(err);
});
