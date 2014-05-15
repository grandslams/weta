/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var db = require('./api/model/DB');
var agent = require('./api/agent');
var metrics = require('./api/metrics');
var summary = require('./api/summary');
var http = require('http');
var path = require('path');
var fs = require('fs');
var socketio = require('socket.io');
var async = require('async');
var cors = require('cors');

//var app = express();
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/agent/push', function (req, res) {
  var data = req.body;
  agent.saveAppName(req);
  async.each(data,
    function (payload, callback) {
      // io.sockets.emit('payload', payload);
      agent.push(req, payload);
      callback()
    }, function (err) {
    });
});

app.get('/agent/poll', agent.poll);
app.get('/api/agent/list', agent.list);
app.get('/api/agent/list/:session_id', agent.list);

app.get('/api/search/metrics', metrics.search);
app.get('/api/search/test', metrics.search_tmp);
app.get('/api/summary/metrics/:time', summary.calcdata);
app.get('/api/summary/test/:time', summary.find);
