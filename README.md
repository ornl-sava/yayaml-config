settings-node
=============

[Node.js](http://nodejs.org/) configuration module. The settings can be defined with [yaml](http://yaml.org/) for different environments (e.g. `production` and `development`) in a single file. Shared settings can be defined in the `default` environment. Choose the environment using `NODE_ENV`.

There are several similar modules on [npm](https://npmjs.org/)[https://npmjs.org/browse/keyword/config]. This is based on [yaml-config](https://github.com/rjyo/yaml-config-node/), but this uses a more idiomatic node style.


## Installation

Clone the repo until this is put in npm registry.


## Defining settings

The settings file can define one or more environments. `default` is used in all environments. Settings are merged for the environment that is defined.

    default: 
      redis: 
        port: 6379
        host: 127.0.0.1
        db: 1
        options: {}
    test: 
      redis: 
        db: 12
    production: 
      redis: 
        host: 192.168.1.2
        db: 0

If the environment is set to `test`, `redis.db` is set to `12`. If the environment is set to `production`, `redis.db` is set to `0`. Otherwise, `redis.db` is set to `1`.


## Usage

To define the environment, set `NODE_ENV` on the command line, or set it in the code. If no environment is set `development` is assumed.

    var config = require('settings')
      , configFile = './config-example.yaml';
    config.readConfig(configFile, function (err, settings) {
      if (err) { console.error(err); return err; }
      console.log('\nSettings for default (development)');
      console.log(util.inspect(settings));
    });

The `readConfig()` function optionally takes a second parameter as enviroment name. If you do not define an environment, the `development` configuration will be loaded. For example:

    config.readConfig(configFile, 'test', function (err, settings) {
      if (err) { console.error(err); return err; }
      console.log(settings.redis.db);
    });

The `updateConfig()` function will take current settings and save them back to the configuration file:

    config.readConfig(configFile, 'production', function (err, settings) {
      if (err) { console.error(err); return err; }
      console.log('\nCurrent settings for production');
      console.log(util.inspect(settings));

      settings.redis.host='192.168.1.2';
      config.updateConfig(settings, configFile, 'production', function (err, newSettings) {
        if (err) { console.error(err); return err; }
        console.log('\nUpdated configuration file:');
        console.log(newSettings);
      });
    });


## License

settings is freely distributable under the terms of the MIT License.

Copyright (c) UT-Battelle, LLC (the "Original Author")

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS, THE U.S. GOVERNMENT, OR UT-BATTELLE BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
