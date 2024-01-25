"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandClient = void 0;
const config_1 = require("../../config");
const CommandClient = (client, version = 1, cache = true) => {
    return function (target, propertyKey) {
        config_1.XComConfig.set(target.constructor, cmdSet => {
            const cmd = cmdSet.getCmd(propertyKey, target.constructor.name);
            cmd.clients.push({ client, version, cache });
            return cmdSet;
        });
    };
};
exports.CommandClient = CommandClient;
//# sourceMappingURL=command-client.js.map