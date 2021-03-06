/* globals require:true, console:true */
// Usage: cd examples; node run.js

'use strict';

var config = require('..')
  , util = require('util')
  , configFile = './config-example.yaml';

config.read(configFile, function (err, settings) {
  if (err) { console.error(err); return err; }
  console.log('\nSettings for default (development)');
  console.log(util.inspect(settings));
});

config.read(configFile, 'test', function (err, settings) {
  if (err) { console.error(err); return err; }
  console.log('\nSettings for test');
  console.log(util.inspect(settings));
});

config.read(configFile, 'production', function (err, settings) {
  if (err) { console.error(err); return err; }
  console.log('\nCurrent settings for production');
  console.log(util.inspect(settings));

  settings.redis.host='192.168.1.2';
  config.update(settings, configFile, 'production', function (err, newSettings) {
    if (err) { console.error(err); return err; }
    console.log('\nUpdated configuration file:');
    console.log(newSettings);
  });
});