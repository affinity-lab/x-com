"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XComAuthenticated = void 0;
const x_com_cfg_1 = require("../../x-com-cfg");
const XComAuthenticated = (status = true) => {
    return function (target) {
        x_com_cfg_1.xcomCfg.metadataStore.get(target, true).set("xcom.authenticated", status);
    };
};
exports.XComAuthenticated = XComAuthenticated;
//# sourceMappingURL=x-com-authenticated.js.map