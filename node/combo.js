var utils = require("./utils");

/* передача на сервер функции */
exports.exp = getCombo;

function getCombo(callback){
    var list = utils.getOptions('patchCombo'),
        res = [];

    for(var key in list){
        res.push(key);
    }

    callback(0, res);
}
