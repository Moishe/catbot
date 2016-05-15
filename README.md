catbot
===

_A simple framework to write simple, stateful bots._

This framework will listen to all messages delivered to any channel it's invited to.

The bot framework is triggered by a message whose first character is a "?"

When the framework hears a message like this, it treats it as a command in the following format:

```?module-name target-user arg1 arg2 ...```

The framework will attempt to load the module identified by the module-name param. If it exists,
the framework will pass the `target-user` and `args` as one array (user is the first element), as well as
storage objects specific to the user, specific to the module and common across all modules, to the
module's `handle` function.

Quick Start
---

Clone this repo and get all its dependencies:

```git clone https://github.com/Moishe/catbot.git```
```cd catbot```
```npm install```

Set up a [custom integration for your team](https://api.slack.com/bot-users). Get the API token for the bot, and then run:

```SLACK_API_TOKEN=[token] npm start```

Now you can `/invite catbot` into your channels, and try `?++ foo` to make sure it's working.

You can add new modules in the `modules` directory; look at `echo.js` and `++.js` for sample code.

Tutorial with Heroku
---

TODO

Things to do / errata
---

Tests should be much better, including better per-module tests.

Note that `user` is the first parameter after module specifier. Currently the module handler() method doesn't
receive any data about the user who actually typed the command. I suspect this would be useful.

Allow modules to describe the kind of input they expect. Right now I'm assuming that the first argument is a
user (and doing things with storage with that assumption). Certain modules might not care about a user (eg ?meme)
and shouldn't get "user" storage set up.

Relatedly, currently the 'user' parameter can be any string. It _might_ be more sensible to enforce it to be a reference
to a user (eg @foo) for consistency but doing that removes some use cases, like "?endorse rain for making things wet".

"Chaining" modules might be nice -- effectively letting a module return a ?command (or an array of them) for the runner
to process. Eg. let ?endorse chain to ?++.

Storage right now is very very naïve, just using the node implementation of localStorage, which maps to files.
Would be much better to use SQLite for this.

Right now the bot exposes an empty web page. I would love it if each module could return a blob of HTML describing
stats for users or other module-specific renderings, and then put those on the page. For instance, if someone
implemented a ?meme bot, it would be fun to show the last _n_ memes.