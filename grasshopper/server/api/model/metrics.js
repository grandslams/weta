var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.find = function (cond, callback) {
  var Metrics = mongoose.model('Metrics');
  var query = Metrics.find(cond);

  query
    .sort({'_ts': -1})
    .exec(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}

exports.findlimit = function (cond, limitNum, callback) {
  var Metrics = mongoose.model('Metrics');
  var query = Metrics.find(cond);

  query
    .sort({'_ts': -1})
    .limit(limitNum)
    .exec(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}

//hourSummary
exports.hourSummary = function (cond, limitNum, callback) {
  var Metrics = mongoose.model('Metrics');

  var now = new Date;
  var tsprev = now.setHours(now.getHours() - 1);
  var ts1 = Date.now() - 360000;
  var ts2 = ts1;
  var tsArr = [];
  for (var i = 0; i < 12; i++) {
    ts1 = ts2;
    ts2 += 30000;//30sec
    tsArr.push({seq: i, ts1: ts1, ts2: ts2});
  }

  cond["metrics.data.ts"] = {$gte: tsprev, $lt: tsnow};

  var query = Metrics.find(cond);
  query
    .exec(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}

exports.remove = function (cond, callback) {
  var Metrics = mongoose.model('Metrics');
  var query = Metrics.remove(cond);

  query
    .exec(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}