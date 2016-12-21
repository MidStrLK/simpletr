var mongodb  = require("../mongo/mongodb");

/* передача на сервер функции */
exports.exp = checkall;

function checkall(callback, COLLECTION){
    mongodb.selectList(callback, COLLECTION);
}