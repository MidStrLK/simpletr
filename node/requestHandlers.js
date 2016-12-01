var fs      = require("fs"),
    index   = fs['readFileSync']('./index.html'),
    combo   = require("./combo"),
    //addTr   = require("./addTr"),
    infoTr  = require("./infoTr");
    //watchTr = require("./watchTr"),
    //address = 'http://midstr.sytes.net:9191/transmission/rpc';

function submitRequest(response, handle, pathname, postData, COLLECTION) {
    if (!pathname || !response) {
        response.writeHead(500, {'Content-Type': 'application/json', 'charset': 'utf-8'});
        response.write('Ошибка в запросе ' + pathname);
        response.end();
    } else {
        if (pathname === '/') {
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
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
                        //if (result && (result.result || result.result === 0)) res = result.result;
                        //if (result && result.result && (result.result.n || result.result.n === 0)) res = result.result.n;
                    }

                    response.writeHead(httpsc, {'Content-Type': 'application/json', 'charset': 'utf-8'});
                    response.write(JSON.stringify(res));
                    response.end();
                };

            if(postData) postData = JSON.parse(postData);
console.info('pathname - ',pathname);
            if (pathname === '/add') {
                infoTr.add(func, postData, COLLECTION);
            }else if (pathname === '/getcombo') {
                combo.getCombo(func);
            }else if (pathname === '/check') {
                infoTr.check(func, COLLECTION);
            }else {
                response.writeHead(500, {'Content-Type': 'application/json', 'charset': 'utf-8'});
                response.write('Ошибка в запросе к БД ' + path);
                response.end();
            }
        }
    }
}

exports.submitRequest       = submitRequest;