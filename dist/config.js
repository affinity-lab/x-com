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
        if (Reflect.has(target, "cmd-set")) {
            let t = Reflect.get(target, "cmd-set");
            if (t.name != target.name) {
                t.name = target.name;
                t.target = target;
            }
            return t;
        }
        else
            return new XComConfig(target);
    }
    ;
    static set(target, callback) {
        const value = callback(this.get(target));
        Reflect.set(target, "cmd-set", value);
    }
    getCmd(name, c) {
        if (this.cmdConfigs.hasOwnProperty(name)) {
            if (this.cmdConfigs[name.toString()].c != c)
                this.cmdConfigs[name.toString()].c = c;
        }
        else
            this.cmdConfigs[name.toString()] = new CommandConfig(name.toString(), c);
        return this.cmdConfigs[name.toString()];
    }
    static getConfigsFromCommandSets(commands) {
        return commands.map(command => Reflect.get(command, "cmd-set"));
    }
}
exports.XComConfig = XComConfig;
class CommandConfig {
    func;
    c;
    alias;
    cache;
    clients = [];
    authenticated;
    preprocess;
    validate;
    description;
    constructor(func, c) {
        this.func = func;
        this.c = c;
        this.alias = func;
    }
}
exports.CommandConfig = CommandConfig;
//# sourceMappingURL=config.js.map