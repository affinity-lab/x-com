"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const x_com_cfg_1 = require("../../x-com-cfg");
const Command = (alias) => {
    return function (target, propertyKey) {
        x_com_cfg_1.xcomCfg.metadataStore.get(target.constructor, true).set(["command", propertyKey.toString(), "alias"], alias || propertyKey.toString());
    };
};
exports.Command = Command;
//# sourceMappingURL=command.js.map