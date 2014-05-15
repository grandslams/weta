var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var summaryData = require('./model/summary');
var moment = require('moment');

exports.calcdata = function (req, res) {
  var time = Number(req.params.time);
  var scope = req.query.scope;
  var name = req.query.name;
  var session_id = req.query.session_id;
  var debug = req.query.debug;

  var cond = {};

  if (scope != undefined) {
    cond["scope"] = scope;
  }

  if (name != undefined) {
    cond["name"] = name;
  }

  if (session_id != undefined) {
    cond["session"] = session_id;
  }

  // 시간을 5분단위로
  var date = new Date();
  date.setMinutes(date.getMinutes() - (date.getMinutes() % 5));
  date.setSeconds(00);
  date.setMilliseconds(000);


  summaryData.findlimit(cond, 12 * time, function (err, result) {
    //배열로 가져온 데이터를 가공.
    var calcArr = [];
    var dataArr = [];
    var ts = moment(date).unix() * 1000;
    var tsgap = 300000 * time;

    if (result.length !== 0) {
      ts = result[0]._ts;
    }

    //time갯수만큼 잘라서 배열에 넣는다.
    var len = 0;
    var loopcnt = 0;

    while (len < 12 * time) {
      var sum = 0;
      var avg = 0;
      var cnt = 0;

      for (var i = 0; i < time; i++) {
        if (len < result.length) {
          sum += result[len].value;
          cnt++;
        }
        len += 1;
      }

      avg = sum / cnt;

      if (cnt === 0)
        avg = 0

      var val = Number(avg).toFixed(2);
      val = Number(val);

      if (debug) {
        dataArr.push({x: moment(ts - (tsgap * loopcnt)).format(), y: val})
      } else {
        dataArr.push({x: ts - (tsgap * loopcnt), y: val})
      }

      loopcnt++;
    }

    return res.json(dataArr);
  });
};

exports.find = function (req, res) {
  var time = Number(req.params.time);
  var scope = req.query.scope;
  var name = req.query.name;
  var session_id = req.query.session_id;
  var debug = req.query.debug;

  var cond = {};

  if (scope != undefined) {
    cond["scope"] = scope;
  }

  if (name != undefined) {
    cond["name"] = name;
  }

  if (session_id != undefined) {
    cond["session"] = session_id;
  }

  var calcArr = [];
  summaryData.findlimit(cond, 12 * time, function (err, result) {
    for (var i = 0; i < result.length; i++) {
      calcArr.push({x: moment(result[i]._ts).format(), y: result[i].value})
    }
    return res.json(calcArr);
  });
};