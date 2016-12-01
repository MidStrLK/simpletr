var options = require("../options");

/* передача на сервер функции */
exports.getCombo = getCombo;

function getCombo(callback){
    var list = options.patchCombo,
        res = [];

    for(var key in list){

        res.push(key);
    }

    callback(0, res);
}
