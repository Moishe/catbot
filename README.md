catbot
===

A simple framework to write simple, stateful bots.
---

If a line is typed that starts with a ?, this bot will split the line by spaces, like so:

```?module user arg1 arg2 ...```

This bot assumes the first argument, if provided, is a username or other team-unique identifier. The reason for this will be discussed below.

And look for a file named `module.js` in the modules directory. If that file exists, the framework will attempt to load that module using `require`.




To run,

```SLACK_API_TOKEN=[token] node catbot.js```
