/**
 * Created by Y on 14. 2. 19.
 */
/**
 * Created by Y on 14. 2. 18.
 */
//var levelup = require('level');
//var path = require('path')
//
//// 1) Create our database, supply location and options.
////    This will create or open the underlying LevelDB store.
//var db = levelup('./data/mydb.leveldb');
//
//// 2) put a key & value
//db.put('name', 'LevelUP', function (err) {
//
//    if (err) return console.log('Ooops!', err);
//
//    db.get('name', function (err, value) {
//
//        if (err) return console.log('Ooops!', err);
//
//        console.log('name=' + value);
//    });
//});


/*
 leveldb를 사용하는 모니터 데이타 저장소 구현
 - 모니터링 대상 서버당 디렉토리 할당
 - 모니터링 내용별 leveldb 저장소 생성
 (예 system monitoring => SystemProbe.leveldb
 - 디렉토리 구조
 - DATA_DIR
   - userid
     + appid_1
     + appid_2
     - appid_3
       - systemProbe.leveldb
       - mysqlProbe.leveldb
       - redisProbe.leveldb
*/


var levelup = require('level')
var path = require('path')


function MonitorDB(dir, userId, monitorId){
   this._dbPath = path.join(dir, userId, monitorId)
   return this
}

MonitorDB.prototype.fullPath = function(tableName){
    return path.join(this._dbPath, tableName)
}

MonitorDB.prototype.getTable = function(tableName){
    var db =  levelup(this.fullPath(tableName))
    console.log('db is ' + db);
    return db
}

exports.MonitorDB = MonitorDB

