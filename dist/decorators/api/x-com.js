"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XCom = void 0;
const x_com_cfg_1 = require("../../x-com-cfg");
const XCom = (alias) => {
    return function (target) {
        x_com_cfg_1.xcomCfg.metadataStore.get(target, true).set("xcom.alias", alias ? alias : target.name);
    };
};
exports.XCom = XCom;
//# sourceMappingURL=x-com.js.map