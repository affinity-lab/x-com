"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XComClient = void 0;
const x_com_cfg_1 = require("../../x-com-cfg");
const XComClient = (client, version = 1) => {
    return function (target) {
        x_com_cfg_1.xcomCfg.metadataStore.get(target, true).push("xcom.clients", { client, version });
    };
};
exports.XComClient = XComClient;
//# sourceMappingURL=x-com-client.js.map