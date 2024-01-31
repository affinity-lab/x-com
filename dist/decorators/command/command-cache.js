"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandCache = void 0;
const x_com_cfg_1 = require("../../x-com-cfg");
const CommandCache = (cache) => {
    return function (target, propertyKey) {
        x_com_cfg_1.xcomCfg.metadataStore.get(target.constructor, true).set(["command", propertyKey.toString(), "cache"], cache);
    };
};
exports.CommandCache = CommandCache;
//# sourceMappingURL=command-cache.js.map