/**
 * Created by harrylang on 16/10/24.
 */

var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var Segment = require('segment');

var app = express();
app.set('port', process.env.PORT || 3000);

// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

// router
app.get('/', function (req, res, next) {
    res.render('index');
});
app.post('/bang', function (req, res, next) {
    var result = segment.doSegment(req.body.text || '', {
        simple: true
    });
    res.json(result);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('404', {
        title: '404',
        message: err.message,
        stack: err.stack
    });
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        title: '错误信息',
        message: '页面不存在',
        stack: err.stack
    });
});

//
var server = app.listen(app.get('port'));

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    throw error;
}

function onListening() {
    console.log('Listening on port %d', app.get('port'));
}

module.exports = app;