"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xcomCfg = void 0;
const command_handler_1 = require("./command-handler");
const class_meta_data_1 = require("./util/class-meta-data");
class XComCfg {
    metadataStore = new class_meta_data_1.ClassMetaData();
    parseXComMeta(target, commandResolver) {
        const meta = this.metadataStore.read(target);
        const commandHandlers = [];
        const xcomInstance = new target();
        const xcom = {
            alias: meta.xcom.alias,
            authenticated: meta.xcom.authenticated === undefined ? false : meta.xcom.authenticated,
            clients: meta.xcom.clients === undefined ? [] : meta.xcom.clients
        };
        for (const func in meta.command) {
            const commandCfg = meta.command[func];
            const authenticated = commandCfg.authenticated !== undefined ? commandCfg.authenticated : xcom.authenticated;
            // preprocess clients
            const clientsCfg = commandCfg.clients !== undefined ? [...commandCfg.clients, ...xcom.clients] : xcom.clients;
            const clients = {};
            for (const clientCfg of clientsCfg) {
                if (!Array.isArray(clientCfg.version))
                    clientCfg.version = [clientCfg.version];
                for (const version of clientCfg.version) {
                    clients[`${clientCfg.client.name}.${version}`] = {
                        client: clientCfg.client,
                        version: version,
                        cache: clientCfg.cache === undefined ? commandCfg.cache : clientCfg.cache
                    };
                }
            }
            for (const key in clients) {
                const client = clients[key];
                const handler = new command_handler_1.CommandHandler(xcomInstance, func, commandCfg.authenticated === undefined ? authenticated : commandCfg.authenticated, client.cache, commandCfg.preprocess, commandCfg.validate, client.client, client.version, xcom.alias + "." + commandCfg.alias, commandResolver, { class: target.name, func }, commandCfg.description);
                commandHandlers.push(handler);
            }
        }
        return commandHandlers;
    }
}
exports.xcomCfg = new XComCfg();
//# sourceMappingURL=x-com-cfg.js.map