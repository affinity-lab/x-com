"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XComClient = void 0;
const config_1 = require("../../config");
const XComClient = (client, version = 1) => {
    return function (target) {
        config_1.XComConfig.set(target, cmdSet => {
            cmdSet.clients.push({ client, version });
            return cmdSet;
        });
    };
};
exports.XComClient = XComClient;
//# sourceMappingURL=x-com-client.js.map