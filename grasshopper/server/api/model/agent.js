var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.find = function (cond, callback) {
  var Agent = mongoose.model('Agent');
  var query = Agent.find(cond);

  query
    .exec(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}

exports.findOne = function (cond, callback) {
  var Agent = mongoose.model('Agent');
  var query = Agent.findOne(cond);

  query
    .exec(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}

exports.findselect = function (cond, select, callback) {
  var Agent = mongoose.model('Agent');
  var query = Agent.find(cond);

  query
    .select(select)
    .exec(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}

exports.findDiskIndex = function (cond, searchCond, callback) {
  var Agent = mongoose.model('Agent');
  //var query = Agent.find({Name: session}, {MetricsNames: {$elemMatch: {Scope: new RegExp(search, 'i')} }, _id:0});

  console.log(cond, searchCond)
  Agent.aggregate([
      {$match: cond},
      {$unwind: "$MetricsNames"},
//        ,{$project:{"Fund.Money":1,"Fund.DepositDate":1,"Fund._id":1}}
      {$match: searchCond},
      {$sort: {"MetricsNames.Scope": 1}},
      {$group: {
        _id: "$_id",
        data: {
          $push: {
            Scope: '$MetricsNames.Scope',
            Name: '$MetricsNames.Name'
          }
        }
      }}
    ],
    function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}

exports.findMetricsName = function (session, scope, name, callback) {
  var Agent = mongoose.model('Agent');
  var query = Agent.findOne({Name: session}, {MetricsNames: {$elemMatch: {Scope: scope, Name: name} }, _id:0});
//  var query = Agent.find({Name:session});

  query
//    .where('Name', session)
//    .select({'MetricsNames': {$elemMatch: {Scope:scope, Name:name}}})
    .exec(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}


exports.save = function (agent, callback) {
  var Agent = mongoose.model('Agent');
  var saveAgent = new Agent(agent);

  saveAgent
    .save(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        callback("", result);
      }
    });
}