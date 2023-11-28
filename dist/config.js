"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandConfig = exports.XComConfig = void 0;
class XComConfig {
    target;
    alias;
    clients = [];
    authenticated = false;
    cmdConfigs = {};
    constructor(target) {
        this.target = target;
        this.alias = target.name;
    }
    static get(target) {
        return Reflect.has(target, "cmd-set")
            ? Reflect.get(target, "cmd-set")
            : new XComConfig(target);
    }
    ;
    static set(target, callback) {
        const value = callback(this.get(target));
        Reflect.set(target, "cmd-set", value);
    }
    getCmd(name) {
        return this.cmdConfigs.hasOwnProperty(name)
            ? this.cmdConfigs[name.toString()]
            : this.cmdConfigs[name.toString()] = new CommandConfig(name.toString());
    }
    static getConfigsFromCommandSets(commands) {
        return commands.map(command => Reflect.get(command, "cmd-set"));
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