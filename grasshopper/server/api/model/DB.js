var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , db = mongoose.connect('mongodb://localhost/grasshopper');

// 성능데이터
var MetricsSchema = new Schema({
  session:{ type: String, index: true },
  scope:{ type: String, index: true },
  name:{ type: String, index: true },
  value: Number,
  unit: String,
  op: String,
  source: String,
  _ns: String,
  id: Number,
  _ts: Number,
  _sum: Number,
  _count: Number
});
var Metrics = mongoose.model('Metrics', MetricsSchema);

var InfoSchema = new Schema({info: Schema.Types.Mixed});
var Info = mongoose.model('Info', InfoSchema);

var SamplesSchema = new Schema({samples: Schema.Types.Mixed});
var Samples = mongoose.model('Samples', SamplesSchema);

var EtcSchema = new Schema({etc: Schema.Types.Mixed});
var Etc = mongoose.model('Etc', EtcSchema);

// 앱 데이터(appName) - app관련정보
var MetricsNameSchema = new Schema({Scope:String, Name:String});

var AgentSchema = new Schema({
  Name: String,
  MetricsNames: [MetricsNameSchema]
});
var Agent = mongoose.model('Agent', AgentSchema);

// 평균 데이터(5분)
var SummarySchema = new Schema({
  session:{ type: String, index: true },
  scope:{ type: String, index: true },
  name:{ type: String, index: true },
  value: Number,
  unit: String,
  op: String,
  source: String,
  _ns: String,
  id: [Number],
  _ts: Number,
  _sum: Number,
  _count: Number
});
var Summary = mongoose.model('Summary', SummarySchema);
