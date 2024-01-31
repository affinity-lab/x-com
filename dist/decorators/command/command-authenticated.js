"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandAuthenticated = void 0;
const x_com_cfg_1 = require("../../x-com-cfg");
const CommandAuthenticated = (status = true) => {
    return function (target, propertyKey) {
        x_com_cfg_1.xcomCfg.metadataStore.get(target.constructor, true).set(["command", propertyKey.toString(), "authenticated"], status);
    };
};
exports.CommandAuthenticated = CommandAuthenticated;
//# sourceMappingURL=command-authenticated.js.map