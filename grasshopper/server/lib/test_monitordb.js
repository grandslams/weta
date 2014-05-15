/**
 * Created by Y on 14. 2. 19.
 */
//////////////////////////////////////////////////////////////////
//// 사용예

var monitordb = require('./monitordb')
var assert = require('assert')

var baseDir = "DB"
var userId = "testId"
var monitorId = '5be987b0-990e-11e3-8bb0-b3dd6277fd6a'

var mdb = new monitordb.MonitorDB(baseDir, userId, monitorId)

// db 테이브 생성 또는 오픈
var systemProbe = mdb.getTable('systemProbe')

var shotId = '2014021710101111'

// 레코드 추가 삭제
systemProbe.put(shotId, 'testdata', function (err) {
    if (err) return console.log('Ooops!', err)

    systemProbe.get(shotId, function (err, value) {
        if (err) return console.log('Ooops!', err)
        console.log('name=' + shotId)
    })
})

// batch 처리
var ops = [
    , { type: 'put', key: '2014021710101123', value: '첫쨰' }
    , { type: 'put', key: '2014021710101456', value: '둘째' }
    , { type: 'put', key: '2014021710101789', value: '셋쨰' }
    , { type: 'put', key: '2014021710101999', value: '막네' }
]

systemProbe.batch(ops, function (err) {
    if (err) return console.log('Ooops!', err)
    console.log('Adding successfully!!')


    ops.forEach(function(one){
        systemProbe.get(one.key, function(err, value){
            if(err) {console.log('error '+ err)}

            console.log(value + ',' + one.value);
            //assert.equal(value ,one.value);
        })
    })

    var delops = [
        , { type: 'del', key: '2014021710101123'}
        , { type: 'del', key: '2014021710101456'}
        , { type: 'del', key: '2014021710101789'}
        , { type: 'del', key: '2014021710101999'}
    ]

    systemProbe.batch(delops, function (err) {
        if (err) return console.log('Ooops!', err)
        console.log('Deleting successfully!')
    })

})

