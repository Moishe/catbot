catbot
===

_A simple framework to write simple, stateful bots._

This framework will listen to all messages delivered to any channel it's invited to.

The bot framework is triggered by a message whose first character is a "?"

When the framework hears a message like this, it treats it as a command in the following format:

```?module-name user arg1 arg2 ...```

The framework will attempt to load the module identified by the module-name param. If it exists,
the framework will pass the `user` and `args` as one array (user is the first element), as well as
storage objects specific to the user, specific to the module and common across all modules, to the
module's `handle` function.

Quick Start
---

Set up a [custom integration for your team](https://api.slack.com/bot-users). Get the API token for the bot, and then run:

```SLACK_API_TOKEN=[token] npm start```

You can add new modules in the `modules` directory; look at `echo.js` and `++.js` for sample code.

Tutorial with Heroku
---

TODO

Things to do / errata
---

Currently the 'user' parameter can be any string. It might be more sensible to enforce it to be a reference
to a user (eg @foo) for consistency but doing that removes some use cases, like "?endorse rain for making things wet"

Storage right now is very very naïve, just using the node implementation of localStorage, which maps to files.
Would be much better to use SQLite for this.