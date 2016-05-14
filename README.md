catbot
===

_A simple framework to write simple, stateful bots._

This framework will listen to all messages delivered to any channel it's invited to.

The bot framework is triggered by a message whose first character is a "?"

When the framework hears a message like this, it treats it as a command in the following format:

```?module-name user arg1 arg2 ...```

The framework will attempt to load the module identified by the module-name param. If it exists,
the framework will populate a `commonStorage` object and a `userStorage` object and pass them,
along with the `user` and `args` parameters, to the module's `handle` function.

Quick Start
---

Set up a [custom integration for your team](https://api.slack.com/bot-users). Get the API token for the bot, and then run:

```SLACK_API_TOKEN=[token] node catbot.js```

You can add new modules in the `modules` directory; look at `echo.js` and `++.js` for sample code.

Tutorial
---

TODO