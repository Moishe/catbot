/**
 * Example for creating and working with the Slack RTM API.
 */

/* eslint no-console:0 */

catbotModule = require('./catbot-runner');
catbotRunner = new catbotModule.CatRunner();

catbotRunner.init();
catbotRunner.start();