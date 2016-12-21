var utils     = require('./utils'),
    check     = require("./check"),
    mongodb   = require("../mongo/mongodb"),
    interval  = false;

exports.exp = add;

/* ДОБАВЛЕНИЕ ССЫЛКИ В ПРОГРАММУ И ЕЕ СТАРТ */
function add(callback, data, COLLECTION, TELEGRAM){

    var patch  = data['patch'],
        magnet = data['magnet'],
        type   = data['type'];

    if(magnet === 'droptable'){
        mongodb.removeDB(null, null, COLLECTION);
        return;
    }

    if(magnet === 'checkall'){
        mongodb.selectList(callback, COLLECTION);
        return;
    }

    if(!magnet){
        callback(1, 'Неправильная ссылка');
        return;
    }

    if(patch && utils.getOptions('patchCombo')[patch]) patch = utils.getOptions('patchCombo')[patch];

    if(!patch) patch = utils.getOptions('defaultDownloadPatch');

    if(type === 'remember'){
        rememberTr(patch, magnet, callback, COLLECTION, TELEGRAM)
    }else{
        downloadTr(patch, magnet, callback, COLLECTION, TELEGRAM);
    }



}

/* ЕСЛИ ОБЪЕКТ ПЕРИОДИЧНЫЙ - СОХРАНЯЕМ ЕГО В БАЗУ */
function rememberTr(patch, link, callback, COLLECTION, TELEGRAM){
    var trOptions = utils.getTrOptions(link),
        magnet = false,
        count = false,
        name = false,
        magnetCallback = function(data){
            magnet = data;
            fullCallback();
        },
        countCallback = function(data){
            count = data - +!utils.isTestMode();
            fullCallback();
        },
        nameCallback = function(data){
            name = data;
            fullCallback();
        },
        fullCallback = function() {

            if(magnet === false || count === false || name === false) return;
            if(magnet === null){
                callback(1, 'Не найдена ссылка');
                return;
            }
            if(count === null){
                callback(1, 'Не найдено количество серий');
                return;
            }
            if(name === null){
                callback(1, 'Не найдено название');
                return;
            }

            var downloadData = {
                    patch: patch,
                    magnet: magnet
                },
                mongoData = {
                    link:       link,
                    name:       name,
                    count:      count,
                    magnet:     magnet,
                    type:       'period',
                    directory:  patch
                },
                afterAddCallback = function(){
                    mongodb.insertList(mongoData, callback, COLLECTION)
                };

            add(afterAddCallback, downloadData, COLLECTION, TELEGRAM);

        };

    utils.getFromSite(link, 'magnet', trOptions.magnet, trOptions.magnetText, magnetCallback);
    utils.getFromSite(link, 'count',  trOptions.count,  trOptions.countText,  countCallback);
    utils.getFromSite(link, 'name',   trOptions.name,   null,                 nameCallback);

}

/* ДОБАВЛЕНИЕ ОБЪЕКТА В ОЧЕРЕДЬ */
function downloadTr(patch, magnet, callback, COLLECTION, TELEGRAM) {
    var body = JSON.stringify({
        "method": "torrent-add",
        "arguments": {
            "paused": false,
            "download-dir": patch,
            "filename": magnet
        }
    });

    if(!interval) interval = check.runCheck(COLLECTION, TELEGRAM);

    utils.submitRequest(body, callback);
}




