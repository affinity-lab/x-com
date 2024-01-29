"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandAuthenticated = void 0;
const config_1 = require("../../config");
const CommandAuthenticated = (status = true) => {
    return function (target, propertyKey) {
        config_1.XComConfig.set(target.constructor, cmdSet => {
            const cmd = cmdSet.getCmd(propertyKey);
            cmd.authenticated = status;
            return cmdSet;
        });
    };
};
exports.CommandAuthenticated = CommandAuthenticated;
//# sourceMappingURL=command-authenticated.js.map