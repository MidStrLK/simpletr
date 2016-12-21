exports.defaultDownloadPatch = '/shares/Public/NEW';

exports.url = 'http://midstr.sytes.net:9191/transmission/rpc';

exports.patchCombo = {
    'Сериал':   '/shares/Public/Episodes',
    'Фильм':    '/shares/Public/Films',
    'Музыка':   '/shares/Public/Music',
    'Новый':    '/shares/Public/NEW'
};

exports.linkOptions = [
    {
        type: 'rutor',
        alias: ['rutor.org', 'rutor.info', 'vip-tor.org'],
        name: '#all > h1',
        magnet: '#download > a',
        magnetText: 'magnet',
        count: '#details .header > span > u',
        countText: 'Файлы'
    }

];

exports.testMode = false;

exports.periodicInterval = 1;       // Минуты

exports.transmissionAnswer = {
    arguments: {
        torrents: [
            {
                doneDate:       0,              // Если есть - на удаление
                status:         4,              // Если >5   - на удаление
                percentDone:    0.5,
                name:           'test name',
                type:           'once',
                downloadDir:    'test/Directory/'
            },{
                doneDate:       'date',              // Если есть - на удаление
                status:         6,              // Если >5   - на удаление
                percentDone:    1,
                name:           'done name',
                type:           'once',
                downloadDir:    'test/Directory/'
            }
        ]
    }
};