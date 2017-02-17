/**
 * Module dependencies.
 */

const debug    = require('debug')('chime:api');
const path     = require('path');
const fs       = require('fs');
const join     = path.resolve;
const readdir  = fs.readdirSync;

/**
 * Load resources in `root` directory.
 *
 * TODO: move api.json (change name?)
 * bootstrapping into an npm module.
 *
 * TODO: adding .resources to config is lame,
 * but assuming no routes is also lame, change
 * me
 *
 * @param {Application} app
 * @param {Router} router
 * @param {String} root
 * @api private
 */

module.exports = function (app, router, root) {
  readdir(root).forEach(function (file) {
    if (file === '_template') return;
    const dir   = join(root, file);
    const stats = fs.lstatSync(dir);
    if (stats.isDirectory()) {
      const conf     = require(dir + '/config.json');
      conf.name      = file;
      conf.directory = dir;
      if (conf.routes) {
        route(router, conf);
      } else {
        console.warn('No routes found in `' + file + '/config.json`');
      }
    }
  })
};

/**
 * Define routes in `conf`.
 */

function route(router, conf) {
  debug('routes: %s', conf.name);
  
  const mod = require(conf.directory);
  
  for (const key in conf.routes) {
    const prop   = conf.routes[key];
    const method = key.split(' ')[0];
    const path   = key.split(' ')[1];
    debug('%s %s -> .%s', method, path, prop);
    
    const fn = mod[prop];
    if (!fn) throw new Error(conf.name + ': exports.' + prop + ' is not defined');
    
    router[method.toLowerCase()](path, fn);
  }
}