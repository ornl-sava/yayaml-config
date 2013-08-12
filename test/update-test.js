/*global require:true, describe:true, before:true, after:true, it:true */

'use strict';

var util = require('util')
  , path = require('path')
  , fs = require('fs')
  , assert = require('chai').assert
  , should = require('chai').should()
  

var configFile=path.join(__dirname,'test.yaml');

function resetSettings (done) {
  var defaultSettings =   'default:\n' +
                          '  redis: \n' +
                          '    port: 6379\n' +
                          '    host: 127.0.0.1\n' +
                          '    password: ""\n' +
                          '    db: 1\n' +
                          '    options: {}\n' +
                          'test:\n' +
                          '  redis:\n' +
                          '    db: 12\n' +
                          'production:\n' +
                          '  redis:\n' +
                          '    db: 0\n' +
                          '  new_prop:\n' + 
                          '    hello: world\n';
  fs.writeFile(configFile, defaultSettings, function (err) {
    done(err);
  });
}

describe(path.basename(__filename) + ' testing with: ' + configFile, function() {

  // reset configurations
  before (function (done) {
    resetSettings(function (err) {
      if (err) return done(err);
      done();
    });
  });

  after (function (done) {
    resetSettings(function (err) {
      if (err) return done(err);
      done();
    });
  });

  
  describe("updateDefault", function() {
    it('should save a new value for redis.host and redis.db in the \'default\' section of ' + path.basename(configFile), function (done) {
      var config = require('..');
      config.readConfig(configFile, 'default', function (err, settings) {
        if (err) return done(err);
        settings.redis.host = '10.1.1.1';
        settings.redis.db = 2;
        config.updateConfig(settings, configFile, 'default', function (err) {
          if (err) return done(err);
          // check the updates
          config.readConfig(configFile, 'default', function (err, newSettings) {
            if (err) return done(err);
            newSettings.redis.host.should.equal(settings.redis.host);
            newSettings.redis.db.should.equal(settings.redis.db);
            done();
          });
        });
      });
    });    
  });
  
  
  describe("updateDevelopment", function() {
    it('should save a new value for redis.host and redis.db in the \'development\' section of ' + path.basename(configFile), function (done) {
      var config = require('..');
      config.readConfig(configFile, function (err, settings) {
        if (err) return done(err);
        settings.redis.host = '10.1.100.100';
        settings.redis.db = 3;
        config.updateConfig(settings, configFile, function (err) {
          if (err) return done(err);
          // check the updates
          config.readConfig(configFile, function (err, newSettings) {
            if (err) return done(err);
            newSettings.redis.host.should.equal(settings.redis.host);
            newSettings.redis.db.should.equal(settings.redis.db);
            done();
          });
        });
      });
    });    
  });

  describe("updateProduction", function() {
    it('should save a new value for redis.host and redis.db in the \'production\' section of '+ path.basename(configFile), function (done) { 
      var config = require('..');
      config.readConfig(configFile, 'production', function (err, settings) {
        if (err) return done(err);
        settings.redis.host = '10.1.50.100';
        settings.redis.db = 1;
        config.updateConfig(settings, configFile, 'production', function (err) {
          if (err) return done(err);
          // check the updates
          config.readConfig(configFile, 'production', function (err, newSettings) {
            if (err) return done(err);
            newSettings.redis.host.should.equal(settings.redis.host);
            newSettings.redis.db.should.equal(settings.redis.db);
            done();
          });
        });
      });
    });    
  });

});