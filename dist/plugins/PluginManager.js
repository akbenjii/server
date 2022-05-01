"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PluginManager {
  constructor(handler) {
    this.dir = `${__dirname}/plugins`;
    this.events = {};
    this.plugins = {};
    this.loadPlugins(handler);
  }

  loadPlugins(handler) {
    _fs.default.readdirSync(this.dir).forEach(plugin => {
      let pluginImport = require(_path.default.join(this.dir, plugin)).default;

      let pluginObject = new pluginImport(handler);
      this.plugins[plugin.replace('.js', '').toLowerCase()] = pluginObject;
      this.loadEvents(pluginObject);
    });
  }

  loadEvents(plugin) {
    for (let event in plugin.events) {
      this.events[event] = plugin.events[event].bind(plugin);
    }
  }

  getEvent(event, args, user) {
    try {
      this.events[event](args, user);
    } catch (error) {
      console.error(`[PluginManager] Event (${event}) not handled: ${error}`);
    }
  }

}

exports.default = PluginManager;