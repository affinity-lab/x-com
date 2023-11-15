"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XComAuthenticated = void 0;
const config_1 = require("../../config");
const XComAuthenticated = (status = true) => {
    return function (target) {
        config_1.XComConfig.set(target, cmdSet => {
            cmdSet.authenticated = status;
            return cmdSet;
        });
    };
};
exports.XComAuthenticated = XComAuthenticated;
//# sourceMappingURL=x-com-authenticated.js.map