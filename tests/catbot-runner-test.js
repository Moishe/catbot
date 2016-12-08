function makeRunner(test) {
	var catbot = require('../catbot-runner.js');
	test.ok(catbot);

	var runner = new catbot.CatRunner();
	test.ok(runner);

	return runner;
}

exports.testSimpleInit = function(test) {
	var runner = makeRunner(test);
	runner.init();

	test.done();
};

exports.testLoadsModule = function(test) {
	var runner = makeRunner(test);
	runner.init();
	var _loader = runner.loader;
	runner.loader = function(moduleName) {
		test.equal(moduleName, './modules/++.js');
		return null;
	};

	runner.handleRtmMessage({'type': 'message', 'text': "?++ foo"});

	test.done();
};

exports.testLoadsModuleWithUserInfo = function(test) {
	var runner = makeRunner(test);
	runner.init();
	var _loader = runner.loader;
	runner.loader = function(moduleName) {
		test.equal(moduleName, './modules/++.js');
		return {
			"handle": function(pieces, userStorage, moduleStorage, commonStorage) {
				test.ok(userStorage);
				test.ok(moduleStorage);
				test.ok(commonStorage);
			}
		}
	};
	_loader('foo');

	runner.handleRtmMessage({'type': 'message', 'text': "?++ foo"});

	test.done();	
};
