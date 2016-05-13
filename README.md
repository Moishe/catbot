catbot
---

A simple framework to write simple bots.

If a line is typed that starts with a ?, this bot will split the line by spaces, like so:

```?module arg1 arg2 arg3```

And look for a file named `module.js` in the modules directory. If that file exists, the framework will attempt to load that module using `require`; if successful, the `handle` method in that function will be called with an array of args defined by the line the bot intercepted.

if the module defines a function called `needsStorage` and that function returns `true`, a localStorage object will be created, initialized to a private store for that module, and passed as the second parameter to the `handle` method in the module.

Requires [node-slack-client](https://github.com/slackhq/node-slack-client), which you can install with:

```npm install @slack/client --save```

as well as [node-localstorage](https://www.npmjs.com/package/node-localstorage):

```npm install node-localstorage```

To run,

```SLACK_API_TOKEN=[token] node catbot.js```
