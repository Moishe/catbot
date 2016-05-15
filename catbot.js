const catbotModule = require('./catbot-runner');
// In the future we should serve a pretty webpage with user stats!
// For now we have a simple app that doesn't do anything but listen
// and serve a dummy webpage

const express = require('express')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const _ = require('lodash')

var app = express()

if (process.env.PROXY_URI) {
  app.use(process.env.PROXY_URI), {
    forwardPath: function(req, res) { return require('url').parse(req.url).path }
  }
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(req, res) { res.send('\n 😻😻 catbot! 😻😻 \n') });
app.use(express.static(__dirname + '/assets'));

app.listen(process.env.PORT, function(err) {
  if (err) throw err

  console.log('Listening on ' + process.env.PORT);

  catbotRunner = new catbotModule.CatRunner();

  catbotRunner.init();
  catbotRunner.start();
})
