function makeRunner(test) {
	catbot = require('../catbot-runner.js');
	test.ok(catbot);

	runner = new catbot.CatRunner();
	test.ok(runner);

	return runner;
}

exports.testSimpleInit = function(test) {
	runner = makeRunner(test);
	runner.init();

	test.done();
};

exports.testLoadsModule = function(test) {
	runner = makeRunner(test);
	var _loader = runner.loader;
	runner.loader = function(moduleName) {
		test.equal(moduleName, '++');
		return null;
	}

	runner.handleRtmMessage({'type': 'message', 'text': "?++ foo"});

	test.done();
}

exports.testLoadsModuleWithUserInfo = function(test) {
	runner = makeRunner(test);
	var _loader = runner.loader;
	runner.loader = function(moduleName) {
		test.equal(moduleName, '++');
		return {
			"options": function() { 
				return {
					'storage': true,
					'privatestore': false,
				} 
			},

			"handle": function(pieces, globalProperties, userProperties) {
				var user = pieces[0];

				if (userProperties['pluses']) {
					userProperties['plus'] += 1;
				} else {
					userProperties['plus'] = 0;
				}
			}
		}
	}

	runner.handleRtmMessage({'type': 'message', 'text': "?++ foo"});

	test.done();	
}
