var request = require("request"),
    options = require("../options");

/* передача на сервер функции */
exports.add = add;

function add(callback, address, data){

    var patch = data['patch'],
        magnet = data['magnet'];

    if(!magnet){
        callback(1, 'Неправильная ссылка');
        return;
    }

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

    console.info('address, body - ',address, body);

    submitRequest(address, body, callback);
}

/* Запрос данных с сайта */
function submitRequest(url, body, callback){

    request({
        uri: url,
        body: body
    }, function(error, response, body) {
        console.info('error - ',error);
        callback(error, response);
    });
}
