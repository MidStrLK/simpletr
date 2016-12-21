var add         = require("./add"),
    check       = require("./check"),
    TelegramBot = require('node-telegram-bot-api'),
    //bot         = new TelegramBot('264486644:AAEctsBwChYfpbs8M9dalmD5q7PdOBl_tzc', {polling: true}),
    //bot         = new TelegramBot(token, botOptions),
    token       = '264486644:AAEctsBwChYfpbs8M9dalmD5q7PdOBl_tzc',
    botOptions  = {polling: true};

exports.done = done;
exports.getBot = getBot;

function getBot(callback, COLLECTION){

    var bot = new TelegramBot(token, botOptions);

    bot.on('text', function (msg) {
        var messageChatId = msg['chat']['id'];
        var messageText = msg['text'];

        bot.messageChatId = messageChatId;

        if (messageText.indexOf('/add') !== -1 && messageText.indexOf('magnet') !== -1) {
            addTl(messageText, messageChatId, COLLECTION, bot);
        }else if (messageText.indexOf('/period') !== -1) {
            rememberTl(messageText, messageChatId, COLLECTION, bot);
        }else if (messageText === '/check') {
            checkTl(messageChatId, COLLECTION, bot);
        }else{
            sendMessageByBot(messageChatId, 'Я тебя запомнил.', bot)
        }
    });

    callback(bot);
}

function checkTl(messageChatId, COLLECTION, bot){
    var func = function(err, result){
        var res = 0;
        if (err) {
            res = err;
        } else {
            if (result || result === 0) res = result;
        }

        sendMessageByBot(messageChatId, JSON.stringify(res), bot);
    };

    check.exp(func, COLLECTION, true);
}

function addTl(messageText, messageChatId, COLLECTION, bot){
    var magnet = messageText.substr(5),
        func = function(err, result){
            var res = 0;
            if (err) {
                res = err;
            } else {
                res = 'added';
            }

            sendMessageByBot(messageChatId, JSON.stringify(res), bot);
        };

    add.exp(func, {magnet: magnet}, COLLECTION, true);
}

function rememberTl(messageText, messageChatId, COLLECTION, bot){
    var magnet = messageText.substr(5),
        func = function(err, result){
            var res = 0;
            if (err) {
                res = err;
            } else {
                res = 'added';
            }

            sendMessageByBot(messageChatId, JSON.stringify(res), bot);
        };

    add.exp(func, {magnet: magnet, type: 'remember'}, COLLECTION, true);
}


function sendMessageByBot(aChatId, aMessage, bot) {
    if(!bot || !aChatId) return;

    bot['sendMessage'](aChatId, aMessage, {caption: 'I\'m a cute bot!'});
}

function done(data, bot){

    if(!bot || !bot.messageChatId) return;

    var msg = data.status + ' -> ' + data.name;

    bot['sendMessage'](bot.messageChatId, msg, {caption: 'I\'m a cute bot!'});
}