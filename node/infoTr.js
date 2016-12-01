var request = require("request"),
    options = require("../options"),
    mongodb  = require("../mongo/mongodb"),
    sessionId = null;

/* передача на сервер функции */
exports.check   = check;
exports.add     = add;


/* ДОБАВЛЯЕТ ТОРРЕНТ ДЛЯ СКАЧИВАНИЯ */
function add(callback, data, COLLECTION){

    var patch  = data['patch'],
        magnet = data['magnet'],
        type   = data['type'];

    if(magnet === 'droptable'){
        dropMD(COLLECTION);
        return;
    }

    if(!magnet){
        callback(1, 'Неправильная ссылка');
        return;
    }

    if(!type) type = 'download';

    if(patch && options.patchCombo[patch]) patch = options.patchCombo[patch];

    if(!patch) patch = options.defaultDownloadPatch;

    var body = JSON.stringify({
        "method":           "torrent-add",
        "arguments":{
            "paused":       false,
            "download-dir": patch,
            "filename":     magnet
        }
    });

    if(!sessionId) {
        getSessionId(body, callback);
    }else{
        submitRequest(body, callback);
    }
}

/* ПРОВЕРЯЕТ ЗАГРУЖЕННЫЕ И ЗАГРУЖАЕМЫЕ */
/* -> checkTorrents -> checkCallback*/
function check(callback, COLLECTION){
    checkTorrents(function(error, response, body){
        checkCallback(error, response, body, callback, COLLECTION)
    });
}

/*---------------C H E C K----------------*/


/* ПРОВЕРЯЕТ ДАННЫЕ - ЕСТЬ ЛИ АКТИВНЫЕ ИЛИ НЕТ  */
/* removeTr || getResponceList */
function checkCallback(error, response, body, callback, COLLECTION){
    if(body && typeof body === 'string') body = JSON.parse(body);

    if(body && body.arguments && body.arguments['torrents'] && body.arguments['torrents'].forEach){
        removeTr(body.arguments['torrents'], callback, COLLECTION);
    }else{
        getResponceList(null, callback, COLLECTION)
    }
}

/* ПРОВЕРЯЕТ, НАДО ЛИ УДАЛЯТЬ ЗАВЕРШЕННЫЕ
 * НАДО - СОХРАНИМ В БАЗУ
 * getResponceList || submitRequest(remove),  setMD -> getResponceList */
function removeTr(data, callback, COLLECTION){
    var ids = getRemoveIds(data);

    if(!ids || !ids.length || !ids.forEach){
        getResponceList(data, callback);
    }else{
        var removeBody = JSON.stringify({
            method: "torrent-remove",
            arguments: {
                ids: ids
            }
        }),
            func = function(){
                getResponceList(data, callback, COLLECTION);
            };

        setMD(getRemoveList(data), func, COLLECTION);

        submitRequest(removeBody);
    }
}

/* ГОТОВИТ ДАННЫЕ ДЛЯ ОТПРАВКИ ОБРАТНО */
/* getSavedList, getMD -> manageResponceList */
function getResponceList(data, callback, COLLECTION){
    var saved = getSavedList(data);

    getMD(function(err, result){
        manageResponceList(saved, result, callback)
    }, COLLECTION)
}


/* КОМБИНИРУЕТ ДАННЫЕ ДЛЯ ПОКАЗА И ОТПРАВЛЯЕТ ОБРАТНО */
function manageResponceList(siteArr, baseArr, callback){

    if(!siteArr || !(siteArr instanceof Array)) siteArr = [];
    if(!baseArr || !(baseArr instanceof Array)) baseArr = [];

    callback(0, JSON.stringify(siteArr.concat(baseArr)));
}





/*-------------S E R V I C E---------------*/

function getRemoveIds(data){
    var res = [];
    data.forEach(function(val){
        if(val['doneDate'] && val['status'] > 5){
            res.push(val.id);
        }
    });
    return res;
}

function getSavedList(data){
    var res = [],
        statuscode = {
            0:  'Stop',
            2:  'Check',
            4:  'Download',
            6:  'Check sid',
            8:  'Siding',
            16: 'Pause'
        };

    data.forEach(function(val){
        if(!val['doneDate'] && val['status'] < 5) {
            res.push({
                date:       val['doneDate'] || '',
                name:       val['name'] || '',
                percent:    (val['percentDone'] * 100).toFixed(2),
                status:     statuscode[val['status']] || '',
                type:       'once',
                directory:  val['downloadDir'] || ''
            });
        }
    });

    return res;
}

function getRemoveList(data){
    var res = [];

    data.forEach(function(val){
        if(val['doneDate'] && val['status'] > 5) {
            res.push({
                date:       val['doneDate'] || '',
                name:       val['name'] || '',
                status:     'Done',
                type:       'once',
                directory:  val['downloadDir'] || ''
            });
        }
    });

    return res;
}

/* Запрос данных с сайта */
function submitRequest(body, callback){

    if(body && body instanceof Object) body = JSON.stringify(body);

    request({
        method: 'POST',
        url: options.url,
        headers: {
            'X-Transmission-Session-Id': sessionId
        },
        body: body
    }, function(error, response, body) {

        //if(response && response.statusCode !== 409 && response.body && typeof response.body === 'string') response = JSON.parse(response.body);

        callback(error, response, body);
    });
}

function checkSession(callback){
    var body = JSON.stringify({"method": "session-get"});

    if(!sessionId) {
        getSessionId(body, callback);
    }else{
        submitRequest(body, callback);
    }
}

function getSessionId(bodyP, callback){
    var func = function(error, response, body){
        if(body && body.indexOf('X-Transmission-Session-Id: ') !== -1){
            sessionId = body.slice(body.indexOf('X-Transmission-Session-Id: ') + 27);
            sessionId = sessionId.substr(0, sessionId.indexOf('</'));

            submitRequest(bodyP, callback);
        }
    };

    submitRequest('{"method": "torrent-get"}', func)
}

function checkTorrents(callback){
    var body = JSON.stringify({
        "method": "torrent-get",
        "arguments": {
            "fields": [
                "percentDone",
                "id",
                "error",
                "doneDate",
                "name",
                "status",
                "errorString",
                "eta",
                "downloadDir"
            ]
        }
    });

    if(!sessionId) {
        getSessionId(body, callback);
    }else{
        submitRequest(body, callback);
    }
}


/*----------------M O N G O-----------------*/

function getMD(callback, COLLECTION){
    mongodb.selectList(callback, COLLECTION)
}

function getMDR(callback, COLLECTION){
    mongodb.selectListRemembered(callback, COLLECTION)
}

function setMD(data, callback, COLLECTION){
    mongodb.insertList(data, callback, COLLECTION)
}
function dropMD(COLLECTION){
    mongodb.removeDB(null, null, COLLECTION)
}