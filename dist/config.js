"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandConfig = exports.XComConfig = void 0;
const reflektor_1 = require("./reflektor");
class XComConfig {
    static reflektor = new reflektor_1.Reflektor();
    alias;
    clients = [];
    authenticated = false;
    cmdConfigs = {};
    constructor(target) {
        this.alias = target.name;
    }
    static get(target) {
        let entry = this.reflektor.get(target, () => new XComConfig(target));
        return entry.value;
    }
    ;
    static set(target, callback) {
        callback(this.get(target));
    }
    getCmd(name) {
        return this.cmdConfigs.hasOwnProperty(name)
            ? this.cmdConfigs[name.toString()]
            : this.cmdConfigs[name.toString()] = new CommandConfig(name.toString());
    }
}
exports.XComConfig = XComConfig;
class CommandConfig {
    func;
    alias;
    cache;
    clients = [];
    authenticated;
    preprocess;
    validate;
    description;
    constructor(func) {
        this.func = func;
        this.alias = func;
    }
}
exports.CommandConfig = CommandConfig;
//# sourceMappingURL=config.js.map