"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandResolver = void 0;
const errors_1 = require("./errors");
const request_parser_1 = require("./request-parser");
const response_type_1 = require("./response-type");
const util_1 = require("@affinity-lab/util");
const x_com_cfg_1 = require("./x-com-cfg");
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
        for (const targetClass of this.commandSets) {
            const handlers = x_com_cfg_1.xcomCfg.parseXComMeta(targetClass, this);
            for (const handler of handlers) {
                this.addCmd(handler);
            }
        }
    }
    addCmd(cmd) {
        if (!this.resolvers.hasOwnProperty(cmd.client.name))
            this.resolvers[cmd.client.name] = {};
        if (!this.resolvers[cmd.client.name].hasOwnProperty(cmd.version))
            this.resolvers[cmd.client.name][cmd.version] = {};
        if (this.resolvers[cmd.client.name][cmd.version].hasOwnProperty(cmd.command))
            throw (0, util_1.fatalError)(`CommandResolver ${cmd.client.name}/${cmd.version}/${cmd.command} has double declaration!`);
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