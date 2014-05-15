var mongoose = require('mongoose');
var db = require('../api/model/DB');
var async = require('async');
var moment = require('moment');
var metricsData = require('../api/model/metrics');
var agentData = require('../api/model/agent');
var summaryData = require('../api/model/summary');

function Data(result, ts, session) {
  this.session = session,
    this.scope = result[0].scope,
    this.name = result[0].name,
    this.value = 0,
    this.unit = result[0].unit,
    this.op = result[0].op,
    this.source = result[0].source,
    this._ns = result[0]._ns,
    this.id = [],
    this._ts = ts,
    this._sum = 0,
    this._count = result.length
}

var hoursummary = function () {
  // 5분에 1번씩 수행되어 summary데이터를 생성한다.
  // xx min 59 sec 999 msec
  var date = new Date();
  date.setMinutes(date.getMinutes() - (date.getMinutes() % 5));
  date.setSeconds(00);
  date.setMilliseconds(000);

  var tsto = moment(date).unix() * 1000;
  var tsfrom = tsto - 300000; //5분전
//  console.log(moment(tsfrom).format(), moment(tsto).format());

  // 계산할 항목을 가져온다.
  agentData.find({}, function (err, result) {
    async.each(result, avgData, function (err) {
      //3시간 데이터 남기고 삭제
      metricsData.remove({_ts:{$lt:tsto-(60000*60*3)}}, function (err, result) {
        process.exit(0);
      });
    });

    // 구간 데이터를 계산한다.
    function avgData(agent, callback) {
      var session = agent.Name;
      console.log('calc:', session);

      var hourInfo = function (metricsName, doneCallback) {
        var cond = {};
        cond["session"] = session;
        cond["scope"] = metricsName.Scope;
        cond["name"] = metricsName.Name;
        cond["_ts"] = {$gte: tsfrom, $lt: tsto};

        metricsData.find(cond, function (err, result) {
          //배열로 가져온 데이터를 가공하여 평균을 낸다.
          if (result.length > 0) {
            var data = new Data(result, tsto, session);

            for (var i = 0; i < result.length; i++) {
              data.id.push(result[i].id);
              data._sum += result[i].value;
            }

            if(data._sum != 0) {
              data.value = data._sum / data._count;
            }

            // 5분간 평균데이터 저장
            summaryData.save(data, function (err, result) {
              return doneCallback(null, {x: tsto, y: data.value});
            })
          } else {
            return doneCallback(null, {x: tsto, y: 0});
          }
        });
      }
      async.map(agent.MetricsNames, hourInfo, function (err, results) {
        //async.each에 끝남을 알림
        callback(null);
      })
    }
  })

  //계산후 저장.
  //종료.
}

var filearg = process.argv[2];

if (filearg == "-h" || filearg == "--help") {
  console.log("usage : node hoursummary.js")
  process.exit(0);
}

hoursummary();