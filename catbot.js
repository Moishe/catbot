/**
 * Example for creating and working with the Slack RTM API.
 */

/* eslint no-console:0 */

catbotRunner = require('./catbot-runner').CatRunner;

console.log(JSON.stringify(catbotRunner));

catbotRunner.init();
catbotRunner.start();