"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandCache = void 0;
const config_1 = require("../../config");
const CommandCache = (cache) => {
    return function (target, propertyKey) {
        config_1.XComConfig.set(target.constructor, cmdSet => {
            const cmd = cmdSet.getCmd(propertyKey);
            cmd.cache = cache;
            return cmdSet;
        });
    };
};
exports.CommandCache = CommandCache;
//# sourceMappingURL=command-cache.js.map