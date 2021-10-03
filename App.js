const express = require('express');
const app = express();
var path = require('path');
const BookApp = require('./Apis/Bookapp');
var http = require('http');
var cookieParser = require('cookie-parser');
const helmet = require('helmet');
app.use(helmet());
var cors = require('cors');
app.use(cors());
var mcache = require('memory-cache');
var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}
var debug = require('debug')('app');
var name = '';
debug('booting %s', name);
var fs = require('fs');
app.use(cookieParser({ SameSite: true }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, 'nodeproject')));
app.use('/BookApp', BookApp, cache(10));
let port1 = process.env.PORT || 3090;
const server1 = http.createServer(app);
server1.listen(port1, '0.0.0.0', function () {
  console.log('Listening to port http:' + port1);
});
module.exports = app;
