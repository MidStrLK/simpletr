var utils     = require('./utils'),
    add       = require('./add'),
    periodic = require('./periodic'),
    mongodb  = require("../mongo/mongodb");

/* передача на сервер функции */
exports.exp = periodicCheck;

function periodicCheck(COLLECTION){

    setInterval(function(){
        var func = function(err, data){
console.info('periodicCheck - ',data);
            if(data && data.forEach){
                data.forEach(function(val){
                    var trOptions = utils.getTrOptions(val.link),
                        countCallback = function(count){
                            console.info('BD -> count - ',val.count, count);
                            if(val.count < count){
                                console.log('intervalCheck', val.count, count);
                                val.count = count;
                                reDownload(val, COLLECTION)
                            }
                        };

                    console.info('trOptions - ',trOptions);

                    utils.getFromSite(val.link, 'count',  trOptions.count,  trOptions.countText,  countCallback);
                })
            }
        };

        periodic.exp(func, COLLECTION);
    }, utils.getPeriodicInterval());

}

function reDownload(data, COLLECTION){
console.info('reDownload - ',data);
    var downloadData = {
            patch: data.directory,
            magnet: data.magnet
        },
        func = function(){
            mongodb.updateMD(id, data, COLLECTION)
        },
        id = data['_id'];

    delete data['_id'];
    add.exp(func, downloadData, COLLECTION);

}
