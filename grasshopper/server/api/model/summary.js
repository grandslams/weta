var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.find = function (cond, callback) {
  var Summary = mongoose.model('Summary');
  var query = Summary.find(cond);

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
  var Summary = mongoose.model('Summary');
  var query = Summary.find(cond);

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

exports.save = function (data, callback) {
  var Summary = mongoose.model('Summary');
  var saveSummary = new Summary(data);

  saveSummary
    .save(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}