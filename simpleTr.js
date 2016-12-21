var server 			= require("./node/server"),
	router 			= require("./node/router"),
	requestHandlers = require("./node/requestHandlers")/*,
	handle 			= {}*/;

/*handle["/"]                 = requestHandlers.submitRequest;
handle["/getcombo"]         = requestHandlers.submitRequest;
//handle["/checksession"]     = requestHandlers.submitRequest;
//handle["/checktorrents"]    = requestHandlers.submitRequest;
//handle["/removedone"]       = requestHandlers.submitRequest;
handle["/add"]              = requestHandlers.submitRequest;
//handle["/info"]             = requestHandlers.submitRequest;
//handle["/watch"]            = requestHandlers.submitRequest;
handle["/check"]            = requestHandlers.submitRequest;
handle["/periodic"]         = requestHandlers.submitRequest;
handle["/checkall"]         = requestHandlers.submitRequest;
handle["/remove"]           = requestHandlers.submitRequest;*/

server.start(router.route, requestHandlers.submitRequest);