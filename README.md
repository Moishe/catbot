catbot
---

A simple framework to write simple bots.

If a line is typed that matches the regex /^\?([a-z])+.*$/, if the file $1.js exists in the modules directory, import that js file and call the 'handle' export in that module with the remainder of the line split by space.

Requires [node-slack-client](https://github.com/slackhq/node-slack-client), which you can install with:

```npm install @slack/client --save```

To run,

```SLACK_API_TOKEN=[token] node catbot.js```
