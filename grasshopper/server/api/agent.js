var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var agentData = require('./model/agent');

exports.saveAppName = function (req) {
  var session_id = req.query.session_id;

  // agent의 appName을 넣는다.
  agentData.find({Name: session_id}, function (err, result) {
    if (result.length <= 0) {
      console.log('saved session', session_id);
      agentData.save({Name: session_id}, function (err, result) {
        //saved
      })
    }
  })
}

exports.list = function (req, res) {
  var session_id = req.params.session_id;
  var scopesearch = req.query.scopesearch;
  var onlyname = req.query.onlyname;
  var selectCond = {};
  var cond = {};
  var scopesearchCond={};
  if (onlyname != undefined) {
    selectCond['Name'] = 1;
  }

  if (scopesearch != undefined) {
    //selectCond['MetricsNames'] = {$elemMatch: {Scope: new RegExp(search, 'i')}};
    scopesearchCond['MetricsNames.Scope'] = new RegExp(scopesearch, 'i');
  }

  if (session_id != undefined) {
    cond['Name'] = session_id;
  }

  console.log(selectCond);
  // agent의 appName을 넣는다.
  if (scopesearch != undefined) {
    agentData.findDiskIndex(cond, scopesearchCond, function (err, result) {
      if(result.length !== 0) {
        res.json([{Name:session_id,MetricsNames:result[0].data}]);
      } else {
        res.json([]);
      }
    })
  } else {
    agentData.findselect(cond, selectCond, function (err, result) {
      res.json(result);
    })
  }

}

var saveMetricsName = function (session, scope, name, callback) {
  var Agent = mongoose.model('Agent');
  async.waterfall([
    function (callback) {
      //항목이 있는지 쿼리
      agentData.findMetricsName(session, scope, name, function (err, result) {
        callback(err, result);
      });
    },
    function (result, callback) {
      if (result === undefined || result === null) {
        callback(null, 'is not set');
      } else if (result.MetricsNames.length == 0) {
        //항목이 없으면 save
        agentData.findOne({Name: session}, function (err, result) {
          if (result != undefined) {
            result.MetricsNames.push({Scope: scope, Name: name});

            //TODO : save와 update의 차이는?
            result.save(function (err, result) {
              if (err) {
                console.log(err);
              }
              callback(err, 'is saved:' + scope + '/' + name);
            });
          }
        })
      } else {
        callback(null, 'is exist');
      }
    }
  ], function (err, result) {
//    console.log(result)
  });
}

exports.push = function (req, payload) {
  var session_id = req.query.session_id;

  if (payload.payload.args._ns == 'metrics') {
    // metrics이름 넣기 : scope, name
    var scope = payload.payload.args.scope;
    var name = payload.payload.args.name;

//    console.log(payload);

    saveMetricsName(session_id, scope, name);

    // metrics데이터 넣기
    var metricsData = {
      session: session_id,
      scope: payload.payload.args.scope,
      name: payload.payload.args.name,
      value: payload.payload.args.value,
      unit: payload.payload.args.unit,
      op: payload.payload.args.op,
      source: payload.payload.args.source,
      _ns: payload.payload.args._ns,
      id: payload.payload.args._id,
      _ts: payload.payload.args._ts,
      _sum: payload.payload.args._sum,
      _count: payload.payload.args._count
    };
    var Metrics = mongoose.model('Metrics');
    var saveMetrics = new Metrics(metricsData);

    saveMetrics
      .save(function (err) {
        if (err) {
          console.log(err);
        }
      });
  }
//  else if (payload.payload.args._ns == 'info') {
//    var infoData = {info: {session_id: session_id, data: payload}};
//    var Info = mongoose.model('Info');
//    var saveInfo = new Info(infoData);
//
//    saveInfo
//      .save(function (err) {
//        if (err) {
//          console.log(err);
//        }
//      });
//  }
//  else if (payload.payload.args._ns == 'samples') {
//    var sampleData = {samples: {session_id: session_id, data: payload}};
//    var Samples = mongoose.model('Samples');
//    var saveSamples = new Samples(sampleData);
//
//    saveSamples
//      .save(function (err) {
//        if (err) {
//          console.log(err);
//        }
//      });
//  }
//  else {
//    var Etc = mongoose.model('Etc');
//    var saveEtc = new Etc({etc: payload});
//
//    saveEtc
//      .save(function (err) {
//        if (err) {
//          console.log(err);
//        }
//      });
//  }

};

exports.poll = function (req, res) {
// agent로 전송되는 커맨드
//[ { payload: { cmd: 'profileCpu', args: 10, broadcast: false }, ts: 1392791347421 } ]
  res.json([]);
};