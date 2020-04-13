const jwt = require('jsonwebtoken');
const config = require('./config');
const rp = require('request-promise');
const commandLineArgs = require('command-line-args')
const optionDefinitions = [
  {
    name: 'start',
    type: String,
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
console.log(options);

const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, config.APISecret);

var createMeetingOptions = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + config.user + "/meetings",
    body: body = {
        "topic": options.topic,
        "type": "2", // Scheduled meeting
        "start_time": "2020-04-13T19:00:00",
        "timezone": "Asia/Tokyo",
        "duration": options.minutes,
        "password": Math.floor(Math.random() * 999999-100000) + 100000
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
    console.log(response);
}).catch(function(err) {
    console.error(err);
});
