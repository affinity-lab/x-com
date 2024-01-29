"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandResolver = void 0;
const command_handler_1 = require("./command-handler");
const errors_1 = require("./errors");
const request_parser_1 = require("./request-parser");
const response_type_1 = require("./response-type");
const config_1 = require("./config");
const affinity_util_1 = require("@affinity-lab/affinity-util");
class CommandResolver {
    commandSets;
    resolvers = {};
    requestParser;
    cacheReader;
    eventEmitter;
    constructor(commandSets, options = {}) {
        this.commandSets = commandSets;
        this.requestParser = options.requestParser === undefined ? new request_parser_1.RequestParser() : options.requestParser;
        this.cacheReader = options.cacheReader;
        this.eventEmitter = options.eventEmitter;
        this.parse();
    }
    parse() {
        for (const targetClass of this.commandSets) {
            const cmdSetConfig = config_1.XComConfig.get(targetClass);
            const defaultAuthenticated = (cmdSetConfig.authenticated === undefined ? false : cmdSetConfig.authenticated);
            for (const cmdKey in cmdSetConfig.cmdConfigs) {
                const cmdConfig = cmdSetConfig.cmdConfigs[cmdKey];
                const defaultCacheOptions = (cmdConfig.cache === undefined ? undefined : cmdConfig.cache);
                const target = new targetClass();
                let func = cmdConfig.func;
                let authenticated = cmdConfig.authenticated === undefined ? defaultAuthenticated : cmdConfig.authenticated;
                const command = cmdSetConfig.alias + "." + cmdConfig.alias;
                const handler = target[func];
                /* Global clients */
                for (const client of cmdSetConfig.clients) {
                    if (!Array.isArray(client.version))
                        client.version = [client.version];
                    for (const version of client.version) {
                        this.addCmd(new command_handler_1.CommandHandler(target, func, authenticated, defaultCacheOptions, cmdConfig.preprocess, cmdConfig.validate, client.client, version, command, this, { "class": target.constructor.name, func }, cmdConfig.description));
                    }
                }
                /* Command clients */
                for (const client of cmdConfig.clients) {
                    let cacheOptions;
                    if (client.cache === false) {
                        cacheOptions = undefined;
                    }
                    else if (client.cache === true) {
                        cacheOptions = defaultCacheOptions;
                    }
                    else {
                        cacheOptions = client.cache;
                    }
                    if (!Array.isArray(client.version))
                        client.version = [client.version];
                    for (const version of client.version) {
                        this.addCmd(new command_handler_1.CommandHandler(target, func, authenticated, cacheOptions, cmdConfig.preprocess, cmdConfig.validate, client.client, version, command, this, { "class": target.constructor.name, func }, cmdConfig.description));
                    }
                }
            }
        }
    }
    addCmd(cmd) {
        if (!this.resolvers.hasOwnProperty(cmd.client.name))
            this.resolvers[cmd.client.name] = {};
        if (!this.resolvers[cmd.client.name].hasOwnProperty(cmd.version))
            this.resolvers[cmd.client.name][cmd.version] = {};
        if (this.resolvers[cmd.client.name][cmd.version].hasOwnProperty(cmd.command))
            throw (0, affinity_util_1.fatalError)(`CommandResolver ${cmd.client.name}/${cmd.version}/${cmd.command} has double declaration!`);
        this.resolvers[cmd.client.name][cmd.version][cmd.command] = cmd;
    }
    async handle(client, version, command, req, res) {
        const c = this.resolvers[client];
        if (c === undefined)
            throw errors_1.xComError.notFound(`client not found: ${client}`); // Client not found
        const v = c[version];
        if (v === undefined)
            throw errors_1.xComError.notFound(`version not found ${client}.${version}`); // Version not found
        const cmd = v[command];
        if (cmd === undefined)
            throw errors_1.xComError.notFound(`command not found ${client}.${version}/${command}`); // Command not found
        const result = await cmd.handle(req, res);
        if (result instanceof response_type_1.ResponseType) {
            await result.send(res);
        }
        else {
            res.json(result);
        }
    }
}
exports.CommandResolver = CommandResolver;
//# sourceMappingURL=command-resolver.js.map