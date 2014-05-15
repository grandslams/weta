var metricsData = require('./model/metrics');
var async = require('async');
var moment = require('moment');

exports.search = function (req, res) {
  var len = req.query.len;
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

  if (len === undefined) {
    len = 12;
  }

  //len+1분만큼만 가져옴
  var tsnow = Date.now();
  cond["_ts"] = {$gte: tsnow - (60000 * len) + 10000, $lt: tsnow};

  metricsData.findlimit(cond, len, function (err, result) {
    //배열로 가져온 데이터를 가공
    var calcArr = [];
    //len만큼 가져왔는지 체크
    if (result.length >= len) {
      for (var i = 0; i < result.length; i++) {
        var val = Math.round(result[i].value * 100) / 100;

        if (debug) {
          calcArr.push({x: moment(result[i]._ts).format(), y: val})
        } else {
          calcArr.push({x: result[i]._ts, y: val})
        }
      }
    }
    //len 만큼 가져오지 않았으면 시간값을 00시00분으로 해서 넣어줌.
    else {
      var xval = Date.now();
      var yval = 0;

      for (var i = 0; i < len; i++) {
        if (i < result.length) {
          var val = Math.round(result[i].value * 100) / 100;

          xval = result[i]._ts;
          yval = val;
        } else {
          xval = xval - 60000;
          yval = 0;
        }

        if (debug) {
          calcArr.push({x: moment(xval).format(), y: yval})
        } else {
          calcArr.push({x: xval, y: yval})
        }
      }
    }

    return res.json(calcArr);
  });
};

exports.search_tmp = function (req, res) {
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

  // 현재 날짜로 렌덤데이터 만듬
  var datetmp = Date.now();
  var retArr = []
  var val;

  function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }

  for (var i = 0; i < 12; i++) {
    datetmp -= 60000;
    val = randomIntInc(1, 30);
    retArr.push({"x": datetmp, "y": val})
  }
  res.json(retArr);
};


exports.calcdata = function (req, res) {
  var time = req.params.time;
  var scope = req.query.scope;
  var name = req.query.name;
  var session_id = req.query.session_id;

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

  var ts1 = Date.now() - 3600000 * time;
  var ts2 = ts1;
  var tsArr = [];
  for (var i = 0; i < 12; i++) {
    ts1 = ts2;
    ts2 += 300000 * time;//30sec
    tsArr.push({seq: i, ts1: ts1, ts2: ts2});
  }

  var hourInfo = function (tsdata, doneCallback) {
    var condsub = cond;
    condsub["_ts"] = {$gte: tsdata.ts1, $lt: tsdata.ts2};

    metricsData.find(condsub, function (err, result) {
      //배열로 가져온 데이터를 가공하여 평균을 낸다.
      var sum = 0;
      var avg = 0;

      for (var i = 0; i < result.length; i++) {
        sum += result[i].metrics.data.payload.args.value;
      }

      avg = sum / result.length;

      //시간을 계산한다.
      var date = new Date(tsdata.ts1);
      var hour = date.getHours() + ":" + date.getMinutes();
      return doneCallback(null, {x: hour, y: avg});
    });
  }

  async.map(tsArr, hourInfo, function (err, results) {
    res.json(results);
  })
};


exports.calcdata_old = function (req, res) {
  var time = req.params.time;
  var scope = req.query.scope;
  var name = req.query.name;
  var session_id = req.query.session_id;

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

  var ts1 = Date.now() - 3600000 * time;
  var ts2 = ts1;
  var tsArr = [];
  for (var i = 0; i < 12; i++) {
    ts1 = ts2;
    ts2 += 300000 * time;//30sec
    tsArr.push({seq: i, ts1: ts1, ts2: ts2});
  }

  var hourInfo = function (tsdata, doneCallback) {
    var condsub = cond;
    condsub["_ts"] = {$gte: tsdata.ts1, $lt: tsdata.ts2};

    metricsData.find(condsub, function (err, result) {
      //배열로 가져온 데이터를 가공하여 평균을 낸다.
      var sum = 0;
      var avg = 0;

      for (var i = 0; i < result.length; i++) {
        sum += result[i].metrics.data.payload.args.value;
      }

      avg = sum / result.length;

      //시간을 계산한다.
      var date = new Date(tsdata.ts1);
      var hour = date.getHours() + ":" + date.getMinutes();
      return doneCallback(null, {x: hour, y: avg});
    });
  }

  async.map(tsArr, hourInfo, function (err, results) {
    res.json(results);
  })
};

exports.summarize = function (tsfrom, tsto, session, scope, name) {
  var cond = {};

  if (scope != undefined) {
    cond["metrics.data.payload.args.scope"] = scope;
  }

  if (name != undefined) {
    cond["metrics.data.payload.args.name"] = name;
  }

  if (session != undefined) {
    cond["metrics.session_id"] = session;
  }

  cond["metrics.data.ts"] = {$gte: tsfrom, $lt: tsto};

  metricsData.find(cond, function (err, result) {
    //배열로 가져온 데이터를 가공하여 평균을 낸다.
    var sum = 0;
    var avg = 0;

    for (var i = 0; i < result.length; i++) {
      sum += result[i].metrics.data.payload.args.value;
    }

    avg = sum / result.length;

    //시간을 tsto로 하여 db에 저장한다.
    console.log({Time: tsto, Avg: avg});

  });
};

exports.calcdata_tmp = function (req, res) {
  var time = req.params.time;
  var scope = req.query.scope;
  var name = req.query.name;
  var session_id = req.query.session_id;

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

  var datetmp = 1393812112000;
  var retArr = []
  var val;

  function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  }

  for (var i = 0; i < 12; i++) {
    datetmp -= 300000 * time;
    val = randomIntInc(1, 30);
    retArr.push({"x": datetmp, "y": val})
  }

  res.json(retArr);
};