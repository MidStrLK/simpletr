var http                = require("http"),
    url                 = require("url"),
    periodiccheck       = require("./periodiccheck"),
    telegrambot         = require("./telegrambot"),
    mongodb             = require("../mongo/mongodb"),
    COLLECTION,
    TELEGRAM,
	server_port         = 8001,
	server_ip_address   = '127.0.0.1';


exports.start = start;

function start(route, handle) {

    periodicCheck();

    function onRequest(request, response) {
        var postData = "";
        var pathname = url.parse(request.url).pathname;

        request['setEncoding']("utf8");

        request.addListener("data", function (postDataChunk) {
            postData += postDataChunk;
        });

        request.addListener("end", function () {
            routeRouter(route, handle, pathname, response, postData);
        });

    }

    var server = http.createServer(onRequest);
    server.listen(server_port, server_ip_address, function () {
        console.log("Listening on " + server_ip_address + ", server_port " + server_port)
    });


}

function routeRouter(route, handle, pathname, response, postData) {
    if(COLLECTION){
        if(TELEGRAM){
            route(handle, pathname, response, postData, COLLECTION, TELEGRAM);
        }else{
            telegrambot.getBot(function(data){
                TELEGRAM = data;
            });
            routeRouter(route, handle, pathname, response, postData)
        }
    }else{
        mongodb.getCollectionMDB(function(COLL){
            COLLECTION = COLL;
            routeRouter(route, handle, pathname, response, postData)
        })
    }
}

function periodicCheck(){
    if(COLLECTION) {
        if (TELEGRAM) {
            periodiccheck.exp(COLLECTION, TELEGRAM);
        } else {
            telegrambot.getBot(function (data) {
                TELEGRAM = data;
                periodicCheck();
            });
        }
    }else{
        mongodb.getCollectionMDB(function(COLL){
            COLLECTION = COLL;
            periodicCheck();
        })
    }
}