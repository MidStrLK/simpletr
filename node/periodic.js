var mongodb  = require("../mongo/mongodb");

/* передача на сервер функции */
exports.exp = periodic;

/* ПОЛУЧАЕТ ПЕРИОДИЧНЫЕ */
function periodic(callback, COLLECTION){
    mongodb.selectListRemembered(callback, COLLECTION);
}