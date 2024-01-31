"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandClient = void 0;
const x_com_cfg_1 = require("../../x-com-cfg");
const CommandClient = (client, version = 1, cache = true) => {
    return function (target, propertyKey) {
        x_com_cfg_1.xcomCfg.metadataStore.get(target.constructor, true).push(["command", propertyKey.toString(), "clients"], { client, version, cache });
    };
};
exports.CommandClient = CommandClient;
//# sourceMappingURL=command-client.js.map