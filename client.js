var grpc = require('grpc')

var PROTO_PATH = './impl.proto'
var conf = require('./conf')
var place_list = require('./db')
var impl_proto = grpc.load(PROTO_PATH).impl

var client = new impl_proto.LBS(conf.ip.client + ':' + conf.port, grpc.credentials.createInsecure())

function callback() {
    console.log('end')
}

function locate() {
    client.locate({
        latitude: 401809022,
        longitude: -744157964
    }, function(err, response) {
        console.log(response)
    })
}

function list() {
    var call = client.list({
        size: 64
    })
    console.log('开始')
    call.on('data', function(feature) {
        console.log(121212)
        console.log(feature)
    });
    console.log('结束')
    call.on('end', callback)
}

function query() {
    var call = client.query()
    call.on('data', function(place) {
        console.log(place.name)
    });
    call.on('end', callback)

    for (var index in place_list) {
        call.write(place_list[index].location)
    }
    call.end()
}

// 分别执行下面三个方法，可以看到效果
//简单调用
// locate()
//服务端流式方法
list()

//双向流式方法
// query()
