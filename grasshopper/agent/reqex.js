var request = require('request');

var options = {
  method: "POST",
  url: 'http://localhost:3000/agent/push/?session_id=pro:baejangeeebaejangeeebaejangeeebaejangeee:bcb490273252e999ab55e963fa99ab04a109bd88&agent_id=ACTUSui-MacBook.local:3177',
  json: {blah:'blah'},
  timeout: 1000
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info.stargazers_count + " Stars");
    console.log(info.forks_count + " Forks");
  }
}

request( {
  method: "POST",
  url: 'http://localhost:3000/agent/push/?session_id=pro:baejangeeebaejangeeebaejangeeebaejangeee:bcb490273252e999ab55e963fa99ab04a109bd88&agent_id=ACTUSui-MacBook.local:3177',
  json: {blah:'blah'},
  timeout: 1000
}, callback);