var http                = require("http"),
    url                 = require("url"),
    mongodb             = require("../mongo/mongodb"),
    COLLECTION,
	server_port         = 8001,
	server_ip_address   = '127.0.0.1';

function routeRouter(route, handle, pathname, response, postData) {
    if(COLLECTION){
        route(handle, pathname, response, postData, COLLECTION);
    }else{
        mongodb.getCollectionMDB(function(COLL){
            COLLECTION = COLL;
            routeRouter(route, handle, pathname, response, postData, COLLECTION)
        })
    }
}

function start(route, handle) {
  function onRequest(request, response) {
      var postData = "";
      var pathname = url.parse(request.url).pathname;

      request['setEncoding']("utf8");

      request.addListener("data", function (postDataChunk) {
          postData += postDataChunk;
          console.log("Received POST data chunk '" +
              postDataChunk + "'.");
      });

      request.addListener("end", function () {
          routeRouter(route, handle, pathname, response, postData);
      });

  }
 
	var server = http.createServer(onRequest);
	server.listen(server_port, server_ip_address, function () {
		console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
	});


}

exports.start = start;