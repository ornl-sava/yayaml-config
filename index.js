/* globals require:true, module:true, process:true */

'use strict';

var yaml = require('js-yaml')
  , fs   = require('fs');

/**
 * Merges properties from `from` object to the `dest` object
 *
 * @private
 * @param {Object} dest An obect with a set of properties
 * @param {Object} from An object with an overlapping set of properties you wish to remove from 'dest'
 */
var _extend = function(dest, from) {
  var props = Object.getOwnPropertyNames(from);
  props.forEach(function(name) {
    if (name in dest && typeof dest[name] === 'object') {
      _extend(dest[name], from[name]);
    }
    else {
      var destination = Object.getOwnPropertyDescriptor(from, name);
      Object.defineProperty(dest, name, destination);
    }
  });
};

/**
 * Removes properties of the 'dest' object where the 'from' objects
 * properties exactly match those in the 'dest' object
 *
 * @private
 * @param {Object} dest An obect with a set of properties
 * @param {Object} from An object with an overlapping set of properties to remove from 'dest'
 */
var _complement = function(dest, from) {
  var props = Object.getOwnPropertyNames(from);
  props.forEach(function(name) {
    if (name in from && typeof from[name] === 'object') {
      if(typeof dest[name] !== 'undefined') {
        _complement(dest[name], from[name]);
        //If all keys were removed, remove the object
        if(Object.keys(dest[name]).length === 0) {
          delete dest[name];
        }
      }
    } 
    else {
      if(dest[name] === from[name]) {
        delete dest[name];
      }
    }
  });
};

/**
 * Reads the config file for the given environment
 *
 * @public
 * @param {String} file A path to an existing configuration file
 * @param {String} env The section to be updated (optional, defaults to 'development')
 * @param {Function} callback The callback function, returns (err, settings)
 */
var read = function(file, env, callback) {
  if(! fs.existsSync(file)) {
    return callback('Error: ' + file + ' does not exist.');
  }

  if (typeof env === 'function') {
    callback = env;
    env = process.env.NODE_ENV || 'development';
  }

  fs.readFile(file, {encoding: 'utf8'}, function (err, configData) {
    if (err) return callback(err);
    
    var config = yaml.safeLoad(configData)
      , settings = config['default'] || {}
      , settings_env = config[env] || {};

    _extend(settings, settings_env);

    return callback(null, settings);
  });
};

/**
 * Updates the config file so that it only contain properties 
 * that are different from the defaults and writes the modified
 * configuration for that environment back to the specified file
 *
 * NOTE: Currently this function does not support preserving comments
 *
 * @public
 * @param {Object} currentSettings A settings object representing an updated state for a configuration file
 * @param {String} file A path to an existing configuration file
 * @param {String} env The section to be updated (optional, defaults to 'development')
 * @param {Function} callback The callback function, returns (err, newFileContents)
 */
var update = function(currentSettings, file, env, callback) {
  if(! fs.existsSync(file)) {
    return callback('Error: ' + file + ' does not exist.');
  }

  if (typeof env === 'function') {
    callback = env;
    env = process.env.NODE_ENV || 'development';
  }

  fs.readFile(file, {encoding: 'utf8'}, function (err, configData) {
    if (err) return callback(err);

    var config = yaml.safeLoad(configData)
      , settings = config['default'] || {};

    if (currentSettings===null || Object.keys(currentSettings).length===0) {
      // delete settings for env
      if (typeof config[env] !== 'undefined') {
        delete config[env];
      }
    }
    else {
      if (env !== 'default') {
        // remove all properties from the current configuration that
        // exist in the default AND are equal to the default value
        _complement(currentSettings, settings);
      }
      // update the values in the configuration
      config[env] = currentSettings;
    }
    
    var newFileContents = yaml.safeDump(config, config.CORE_SCHEMA);
    fs.writeFile(file, newFileContents, {encoding: 'utf8'}, function (err) {
      if (err) return callback('Error: Unable to write to ' + file + ' - ' + err);
      return callback(null, newFileContents);
    });

  });

};

module.exports.read = read;
module.exports.update = update;