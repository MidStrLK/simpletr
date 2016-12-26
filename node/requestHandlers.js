var fs              = require("fs"),
    index           = fs['readFileSync']('./index.html'),
    combo           = require("./combo"),
    add             = require("./add"),
    check           = require("./check"),
    periodic        = require("./periodic"),
    checkall        = require("./checkall"),
    remove          = require("./remove");

function submitRequest(response, handle, pathname, postData, COLLECTION, TELEGRAM) {
    if (!pathname || !response) {
        response['writeHead'](500, {'Content-Type': 'application/json', 'charset': 'utf-8'});
        response.write('Ошибка в запросе ' + pathname);
        response.end();
    } else {
        if (pathname === '/') {
            response['writeHead'](200, {'Content-Type': 'text/html; charset=utf8'});
            response.end(index);
        } else {
            var path = pathname.replace(/\//g, ''),
                func = function (err, result) {
                    var res = 0,
                        httpsc = 200;
                    if (err) {
                        res = err;
                        httpsc = 500;
                    } else {
                        if (result || result === 0) res = result;
                    }

                    response['writeHead'](httpsc, {'Content-Type': 'application/json', 'charset': 'utf-8'});
                    response.write(JSON.stringify(res));
                    response.end();
                };

            if(postData) postData = JSON.parse(postData);

            if (pathname === '/add') {
                add.exp(func, postData, COLLECTION, TELEGRAM);
            }else if (pathname === '/getcombo') {
                combo.exp(func);
            }else if (pathname === '/check') {
                check.exp(func, COLLECTION, null , TELEGRAM);
            }else if (pathname === '/periodic') {
                periodic.exp(func, COLLECTION);
            }else if (pathname === '/checkall') {
                checkall.exp(func, COLLECTION);
            }else if (pathname === '/remove') {
                remove.exp(postData, func, COLLECTION);
            }else {
                response['writeHead'](500, {'Content-Type': 'application/json', 'charset': 'utf-8'});
                response.write('Ошибка в запросе к БД ' + path);
                response.end();
            }
        }
    }
}

exports.submitRequest       = submitRequest;